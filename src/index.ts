import { Config } from "./Base";
import Client from "./Client";
import mongo from "./config/mongo";
import { getTokenFromDb } from "./resources/tokens";
import { Token } from "./types";

// initialize database
await mongo.connect();
const db = mongo.db("stratbot_db");

// get token
const token = await getTokenFromDb(db);
if (token) {
  const config = {
    token,
    onNewTokenFunc: (token: Token) => saveTokenToDb(token),
  } as Partial<Config>;

  const client = new Client(config);

  const accounts = await client.Trader.getAccounts();
  console.log(JSON.stringify(accounts.data, null, 2));

  const result = await client.MarketData.getPriceHistory("AAPL");
  console.log(JSON.stringify(result.data, null, 2));
} else {
  console.log("ain't no token, bruv");
}

await mongo.close();

async function saveTokenToDb(token: Token) {
  const { refreshToken, ...rest } = token;
  const query = { refreshToken };
  const update = {
    $set: {
      ...rest,
    },
  };
  await db
    .collection("tokens_schwab")
    .updateOne(query, update, { upsert: true });
}
