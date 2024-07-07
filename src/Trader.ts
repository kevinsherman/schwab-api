import axios, { AxiosInstance } from "axios";
import { Db } from "mongodb";
import { setupInterceptors } from "./interceptors";

class Trader {
  config: any = {};
  axios: AxiosInstance;
  _db: Db;

  constructor(db: Db, thisConfig?: any) {
    this.axios = axios.create({
      baseURL: "https://api.schwabapi.com/trader/v1",
    });

    this._db = db;

    if (thisConfig) {
      this.config.accessToken = thisConfig.access_token;
      this.config.refreshToken = thisConfig.refresh_token;
      this.config.authorization = Buffer.from(
        `${process.env.SCHWAB_APP_KEY}:${process.env.SCHWAB_APP_SECRET}`
      ).toString("base64");
      this.config.refreshAndRetry = process.env.REFRESH_AND_RETRY;
    }

    setupInterceptors(this);
  }

  async getAccounts() {
    return this.axios.get("/accounts");
  }

  async getAccountNumbers() {
    return this.axios.get("/accounts/accountNumbers");
  }
}

export default Trader;
