import axios, { AxiosInstance } from "axios";
import { Db } from "mongodb";
import { setupInterceptors } from "./interceptors";

class Base {
  config: any;
  axios: AxiosInstance;

  constructor(config: Partial<Config>) {
    this.config = Object.assign({}, defaults, config, () => {});
    this.axios = axios.create({ baseURL: this.config.baseURL });
    setupInterceptors(this);
  }
}

export default Base;

export const defaults: Config = {
  authorization: Buffer.from(
    `${process.env.SCHWAB_APP_KEY}:${process.env.SCHWAB_APP_SECRET}`
  ).toString("base64"),
  refreshAndRetry: true,
  baseURL: "https://api.schwabapi.com/v1/oauth/token",
  db: null,
  token: {
    access_token: "",
    refresh_token: "",
    token_type: "",
    expires_in: 0,
    scope: "",
  },
};

export type Config = {
  accessToken?: string;
  refreshToken?: string;
  authorization?: string;
  refreshAndRetry?: boolean;
  baseURL?: string;
  db: Db | null;
  token: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  };
};
