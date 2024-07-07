import MarketData from "./MarketData";
import Trader from "./Trader";
import mongo from "./config/mongo";
import { getTokenFromDb } from "./resources/tokens";

// initialize database
await mongo.connect();
const db = mongo.db("stratbot_db");

const token = (await getTokenFromDb(db)) as any;
if (!token) {
  console.log("No token found, must login to create token.");
}

const config = {
  db,
  token,
};

// initialize trader
const trader = new Trader(config);
trader.on("token", saveTokenToDb);

// attempt to get account information
const accounts = await trader.getAccounts();
console.log(JSON.stringify(accounts.data, null, 2));

const md = new MarketData(config);
md.on("token", saveTokenToDb);
const result = await md.getPriceHistory();
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
