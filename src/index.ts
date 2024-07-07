import Trader from "./Trader";
import mongo from "./config/mongo";
import { getTokenFromDb } from "./func/getTokenFromDb";

// initialize database
await mongo.connect();
const db = mongo.db("stratbot_db");

const token = await getTokenFromDb(db);
if (!token) {
  console.log("No token found, must login to create token.");
}

// initialize trader
const trader = new Trader(db, token);

// attempt to get account information
const accounts = await trader.getAccounts();
console.log(JSON.stringify(accounts.data, null, 2));

await mongo.close();
