import MarketData from "./MarketData";
import Trader from "./Trader";
import mongo from "./config/mongo";
import { getTokenFromDb } from "./resources/tokens";
import { Token } from "./types";

// initialize database
await mongo.connect();
const db = mongo.db("stratbot_db");
const token = await getTokenFromDb(db);
if (token) {

  const config = {
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
} else {
  console.log("ain't no token, bruv");
}

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
