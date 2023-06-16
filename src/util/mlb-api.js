import { postRequest, query } from "../pages/api.js";

const startDate = "2023-06-15";

export const mlbUrlByDateRange = (startDate, endDate) => {
  return `https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-scoreboard?stitch_env=prod&sortTemplate=4&sportId=1&&sportId=51&startDate=${startDate}&endDate=${endDate}&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&&gameType=C&language=en&leagueId=104&&leagueId=103&&leagueId=159&&leagueId=160&contextTeamId=`;
};

const getTodaysDate = () => {
  const todayDate = new Date();

  todayDate.setMinutes(todayDate.getMinutes() - todayDate.getTimezoneOffset());
  return todayDate.toISOString().split("T")[0];
};
export const getLatestUpdate = async () => {
  try {
    const res = await query(`*[ _type == "latest" ]`);
    const json = await res.json();
    return json.result[0];
  } catch (error) {
    console.error(error);
  }
};

export async function getTeamsAndArchivedScores() {
  const endDate = getTodaysDate();

  let teams;
  try {
    const res = await query(`*[ _type == "team" ]`);
    const json = await res.json();
    teams = json.result;
  } catch (error) {
    console.error(error);
  }

  const { date } = await getLatestUpdate();

  let archivedScores = {};

  const todayScores = await getTodaysScores(date, true);

  teams.forEach((team) => {
    archivedScores[team.name] = {};
    const teamScoresToday = todayScores[team.name];
    team.items.forEach((scoreObj) => {
      const { score, date } = scoreObj;
      const curDate = new Date(date);

      if (
        !archivedScores[team.name][score] &&
        curDate >= new Date(startDate) &&
        curDate <= new Date(endDate)
      ) {
        archivedScores[team.name][score] = { ...scoreObj };
      }
    });

    if (teamScoresToday) {
      teamScoresToday.forEach((scoreObj) => {
        const { score } = scoreObj;

        if (!archivedScores[team.name][score]) {
          archivedScores[team.name][score] = { ...scoreObj };
        }
      });
    }
  });

  return { archivedScores, teams };
}

const getMLBTeams = async () => {
  const response = await fetch(mlbUrlByDateRange("2023-03-30", "2023-04-20"));
  const allGames = await response.json();

  console.log({ allGames });

  const allTeams = [];
  const teamsObj = {};

  allGames.dates.forEach((date) => {
    date.games.forEach((game) => {
      //	const { teamName: name, franchiseName: city, id: apiId } = game.teams.home.team

      const homeTeam = {
        name: game.teams.home.team.teamName,
        apiId: game.teams.home.team.id,
        city: game.teams.home.team.franchiseName,
      };

      const awayTeam = {
        name: game.teams.away.team.teamName,
        apiId: game.teams.away.team.id,
        city: game.teams.away.team.franchiseName,
      };

      if (!teamsObj[homeTeam.apiId]) {
        teamsObj[homeTeam.apiId] = homeTeam;
        allTeams.push(homeTeam);
      }

      if (!teamsObj[awayTeam.apiId]) {
        teamsObj[awayTeam.apiId] = awayTeam;
        allTeams.push(awayTeam);
      }
    });
  });

  return allTeams;
};

export const getTodaysScores = async (overideDate = "", isObject = false) => {
  try {
    const todayDate = getTodaysDate();

    const response = await fetch(
      mlbUrlByDateRange(overideDate || todayDate, todayDate)
    );
    const allGames = await response.json();

    const allScores = [];
    const teamsObj = {};

    allGames.dates.forEach((date, i) => {
      date.games.forEach((game) => {
        const { gamePk } = game;
        const homeTeam = game.teams.home.team.teamName;
        const awayTeam = game.teams.away.team.teamName;

        if (game.gameUtils.isFinal) {
          const homeTeamScore = {
            team: homeTeam,
            opponent: awayTeam,
            score: game.teams.home.score,
            date: date.date,
            gamePk: gamePk.toString(),
          };

          const awayTeamScore = {
            team: awayTeam,
            opponent: homeTeam,
            score: game.teams.away.score,
            date: date.date,
            gamePk: gamePk.toString(),
          };

          if (!teamsObj[homeTeam]) {
            teamsObj[homeTeam] = [];
          }
          if (!teamsObj[awayTeam]) {
            teamsObj[awayTeam] = [];
          }

          teamsObj[homeTeam].push(homeTeamScore);
          teamsObj[awayTeam].push(awayTeamScore);

          allScores.push(homeTeamScore);
          allScores.push(awayTeamScore);
        }
      });
    });
    return isObject ? teamsObj : allScores;
  } catch (error) {
    console.dir(error);
  }
};

export async function postTeams() {
  const { teams } = await getMLBTeams();

  const mutations = teams.map((team) => ({
    create: {
      _type: "team",
      name: team.name,
      city: team.city,
      apiId: team.apiId,
    },
  }));
  try {
    const res = await postRequest({ mutations });
    const json = await res.json();
  } catch (error) {
    console.dir(error);
  }
}

export async function postScores() {
  const todayDate = getTodaysDate();
  const { date, _id, _type } = await getLatestUpdate();
  const scores = await getTodaysScores(date);
  const { teams } = await getTeamsAndArchivedScores();

  const mutations = scores
    .map((scoreObj, i) => {
      const { team, opponent, score, date, gamePk } = scoreObj;
      const teamObj = teams.find((teamObj) => teamObj.name === team);
      const id = teamObj._id;

      if (teamObj.items.some((item) => item.gamePk === gamePk)) return;

      return {
        patch: {
          id,
          insert: {
            after: "items[-1]",
            items: [
              {
                opponent,
                score: parseFloat(score),
                date,
                gamePk,
              },
            ],
          },
        },
      };
    })
    .filter(Boolean);

  try {
    console.log(mutations);
    const res = await postRequest({ mutations });
    const json = await res.json();

    const response = await postRequest({
      mutations: [
        {
          createOrReplace: {
            _id,
            _type,
            date: todayDate,
          },
        },
      ],
    });

    if (json.results.length) {
      const json2 = await response.json();
      console.log({ hello: json2.results[0] });
    }

    console.log(json);
    return json;
  } catch (error) {
    console.dir(error);
  }
}
