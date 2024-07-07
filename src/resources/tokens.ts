import { Db } from "mongodb";
import axios from "axios";

export function getTokenFromDb(db: Db) {
  return db.collection("tokens_schwab").findOne({});
}

export async function refreshAccessToken(client: any) {
  const data = {
    grant_type: "refresh_token",
    refresh_token: client.config.token.refreshToken,
  };

  const options = {
    headers: {
      Authorization: `Basic ${client.config.authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const url = "https://api.schwabapi.com/v1/oauth/token";

  return axios.post(url, data, options);
}
