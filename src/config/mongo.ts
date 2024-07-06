import { MongoClient } from "mongodb";

const mongo_uri: string = process.env.MONGO_URI!;

//@ts-ignore
let _mongo: MongoClient = null;

if (_mongo === null) {
  _mongo = new MongoClient(mongo_uri);
}

export default _mongo;
