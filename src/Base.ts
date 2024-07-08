import axios, { AxiosInstance } from "axios";
import { setupInterceptors } from "./interceptors";
import EventEmitter from "eventemitter3";

class Base {
  config: any;
  axios: AxiosInstance;
  emitter = new EventEmitter();

  constructor(config: Partial<Config>) {
    this.config = Object.assign({}, defaults, config, () => {});
    this.axios = axios.create({ baseURL: this.config.baseURL });
    setupInterceptors(this);
  }

  on(event, fn) {
    return this.emitter.on(event, fn);
  }
}

export default Base;

export const defaults: Config = {
  authorization: Buffer.from(
    `${process.env.SCHWAB_APP_KEY}:${process.env.SCHWAB_APP_SECRET}`
  ).toString("base64"),
  refreshAndRetry: true,
  baseURL: "https://api.schwabapi.com/v1/oauth/token",
  token: {
    accessToken: "",
    refreshToken: "",
    tokenType: "",
    expiresIn: 0,
    scope: "",
  },
};

export type Config = {
  authorization?: string;
  refreshAndRetry?: boolean;
  baseURL?: string;
  token: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
  };
};
