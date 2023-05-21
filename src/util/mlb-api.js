import { postRequest, query } from "../pages/api.js";

export const mlbUrlByDateRange = (startDate, endDate) => {
  // formated as YYYY-MM-DD
  return `https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-scoreboard?stitch_env=prod&sortTemplate=4&sportId=1&&sportId=51&startDate=${startDate}&endDate=${endDate}&gameType=E&&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&&gameType=C&language=en&leagueId=104&&leagueId=103&&leagueId=159&&leagueId=160&contextTeamId=`;
};

export async function getTeamsAndArchivedScores(
  startDate = "2022-04-01",
  endDate = "2022-04-01"
) {
  const res = await query(`*[ _type == "team" ]`);
  const json = await res.json();
  const teams = json.result;
  let archivedScores = {};

  const todayScores = await getTodaysScores(undefined, true);

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

  console.log({allGames})

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
  let todayDate = new Date();
  if (typeof todayDate === "object") {
    todayDate.setMinutes(todayDate.getMinutes() - todayDate.getTimezoneOffset())
     todayDate = todayDate.toISOString().split("T")[0];
    console.log({todayDate})
  }

  // write a fuction that takes a date formatted as YYYY-MM-DD and formats to correct timezone

  const response = await fetch(mlbUrlByDateRange("2023-05-06", todayDate))
  const allGames = await response.json();

  const allScores = [];
  const teamsObj = {};

  allGames.dates.forEach((date, i) => {

    console.log({date: date.date})
    date.games.forEach((game) => {

      const { gamePk } = game;
      const homeTeam = game.teams.home.team.teamName;
      const awayTeam = game.teams.away.team.teamName;


      if (
        game.gameUtils.isFinal
      ) {
        const homeTeamScore = {
          team: homeTeam,
          opponent: awayTeam,
          score: game.teams.home.score,
          date: date.date,
          gamePk: gamePk.toString()
        };

        const awayTeamScore = {
          team: awayTeam,
          opponent: homeTeam,
          score: game.teams.away.score,
          date: date.date,
          gamePk: gamePk.toString()
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
  const scores = await getTodaysScores();
  const { teams } = await getTeamsAndArchivedScores();

  const mutations = scores.map((scoreObj, i) => {
    const { team, opponent, score, date, gamePk } = scoreObj;
    const teamObj = teams.find((teamObj) => teamObj.name === team)
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
  }).filter(Boolean);

  try {
    console.log(mutations)
    // const res = await postRequest({ mutations });
    // const json = await res.json();
    // console.log(json);
    // return json;
  } catch (error) {
    console.dir(error);
  }
}