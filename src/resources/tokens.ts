import { Db } from "mongodb";
import axios from "axios";

export function getTokenFromDb(db: Db) {
  return db.collection("tokens_schwab").findOne({});
}

export async function refreshAccessToken(client: any) {
  console.log("refreshing access token...");
  const data = {
    grant_type: "refresh_token",
    refresh_token: client.config.refreshToken,
  };

  const options = {
    headers: {
      Authorization: `Basic ${client.config.authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const url = "https://api.schwabapi.com/v1/oauth/token";

  const token = await axios.post(url, data, options);

  const newAccessToken = token.data.access_token;
  const newExpiry = Math.round(Date.now() / 1000) + token.data.expires_in;
  client.config.accessToken = newAccessToken;
  client.config.accessTokenExpiresAt = newExpiry;

  const query = { refresh_token: client.config.refreshToken };
  const update = {
    $set: {
      access_token: newAccessToken,
      accessTokenExpiresAt: newExpiry,
      accessTokenExpiry: new Date(newExpiry * 1000).toString(),
    },
  };
  await client._db
    .collection("tokens_schwab")
    .updateOne(query, update, { upsert: true });

  return token;
}
