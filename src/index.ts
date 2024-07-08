import { Config } from "./Base";
import Client from "./Client";
import mongo from "./config/mongo";
import { getTokenFromDb } from "./resources/tokens";

// initialize database
await mongo.connect();
const db = mongo.db("stratbot_db");

const token = (await getTokenFromDb(db)) as any;
if (!token) {
  console.log("No token found, must login to create token.");
}

const config: Partial<Config> = {
  token,
  onNewTokenFunc: saveTokenToDb,
};

const client = new Client(config);

const accounts = await client.Trader.getAccountNumbers();
const account = await client.Trader.getAccount(accounts.data[0].hashValue);
console.log(JSON.stringify(account.data, null, 2));
console.log(JSON.stringify(accounts.data, null, 2));

const result = await client.MarketData.getPriceHistory();
console.log(JSON.stringify(result.data, null, 2));

await mongo.close();

async function saveTokenToDb(token: any) {
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
