import {postScores} from "../../src/util/mlb-api.js";

export default async () => {
    await postScores()
}

export const config = {
    schedule: '0 8 */2 * *'
}