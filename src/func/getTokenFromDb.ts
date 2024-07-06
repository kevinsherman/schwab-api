import { Db } from "mongodb";

export function getTokenFromDb(db: Db) {
  return db.collection("tokens_schwab").findOne({});
}
