import axios, { AxiosInstance } from "axios";
import { Db } from "mongodb";

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

    this.init();
  }

  async getAccounts() {
    return this.axios.get("/accounts");
  }

  async getAccountNumbers() {
    return this.axios.get("/accounts/accountNumbers");
  }

  init() {
    this.axios.interceptors.request.use((config) => {
      if (this.config.accessToken) {
        config.headers["Authorization"] = `Bearer ${this.config.accessToken}`;
      }
      return config;
    });

    this.axios.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response.status === 401) {
          const originalRequest = error.config;
          const condition =
            this.config.refreshAndRetry &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "https://api.schwabapi.com/v1/oauth/token";
          if (condition) {
            originalRequest._retry = true;
            return this.refreshAccessToken().then(() => {
              originalRequest.headers.Authorization = `Bearer ${this.config.accessToken}`;
              return this.axios(originalRequest);
            });
          }

          return Promise.reject(error);
        }
      }
    );
  }

  async refreshAccessToken() {
    const data = {
      grant_type: "refresh_token",
      refresh_token: this.config.refreshToken,
    };

    const options = {
      headers: {
        Authorization: `Basic ${this.config.authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const authAxios = axios.create({
      baseURL: "https://api.schwabapi.com",
    });

    const token = await authAxios.post("/v1/oauth/token", data, options);

    const newAccessToken = token.data.access_token;
    const newExpiry = Math.round(Date.now() / 1000) + token.data.expires_in;
    this.config.accessToken = newAccessToken;
    this.config.accessTokenExpiresAt = newExpiry;

    const query = { refresh_token: this.config.refreshToken };
    const update = {
      $set: {
        access_token: newAccessToken,
        accessTokenExpiresAt: newExpiry,
        accessTokenExpiry: new Date(newExpiry * 1000).toString(),
      },
    };
    await this._db
      .collection("tokens_schwab")
      .updateOne(query, update, { upsert: true });

    return token;
  }
}

export default Trader;
