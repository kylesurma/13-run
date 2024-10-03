import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { mlbUrlByDateRange } from '../util/mlb-api.js'


const SALT_ROUNDS = 10;

const projectId = import.meta.env.SAN_PROJECT_ID;
const ver = import.meta.env.SAN_VER;
const dataset = import.meta.env.SAN_DATASET;
const sanityToken = import.meta.env.SAN_TOKEN;
const JWTToken = import.meta.env.JWT;
export const  isIntermission = import.meta.env.INTERMISSION === 'on'

export const query = (query) => {
  const encodedQuery = encodeURI(query);
  return fetch(
    `https://${projectId}.api.sanity.io/${ver}/data/query/${dataset}?query=${encodedQuery}`
  );
};

export const postRequest = (mutations) => {
  return fetch(
    `https://${projectId}.api.sanity.io/${ver}/data/mutate/${dataset}?returnDocuments=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sanityToken}`,
      },
      body: JSON.stringify(mutations),
    }
  );
};

export async function createUser(user) {
  const res = await query(`*[ _type == "user" && name == "${user.name}" ]`);
  const json = await res.json();
  if (json.result.length > 0) {
    return { error: "Name already exists" };
  } else {
    const encryptedPass = await bcrypt.hash(user.password, SALT_ROUNDS);
    const mutations = [
      {
        create: {
          _type: "user",
          name: user.name,
          email: user.email,
          password: encryptedPass,
          isAdmin: false,
        },
      },
    ];
    const res = await postRequest({ mutations });
    const json = await res.json();
    return json;
  }
}

export async function loginUser(userCandidate) {
  const res = await query(
    `*[ _type == "user" && name == "${userCandidate.name}" ]`
  );
  const json = await res.json();
  if (json.result.length > 0) {
    const user = json.result[0];
    const match = await bcrypt.compare(user.password, userCandidate.password);
    if (match) {
      const token = jwt.sign({ id: user._id }, JWTToken);
      return { token };
    } else {
      return { error: "Incorrect password" };
    }
  } else {
    return { error: "User does not exist" };
  }
}

export async function getUser(id) {
  const res = await query(`*[ _type == "user" && _id == "${id}" ]`);
  const json = await res.json();
  return json.result;
}

export async function authenticateUser(token) {
  try {
    const { id } = jwt.verify(token, JWTToken);
    const user = await getUser(id);
    return user;
  } catch (err) {
    return null;
  }
}


export async function updateTeamWithScores() {
  const teams = await getMLBTeams();

  // console.log({teams})
  return teams;



  // const mutations = teams.map((team) => ({
  //   patch: {
  //     id: team._id,
  //     set: {
  //       score: 0,
  //     },
  //   },
  // }));
  // try {
  //   const res = await postRequest({ mutations });
  //   const json = await res.json();
  //   console.log(json);
  // } catch (error) {
  //   console.dir(error);
  // }
}
