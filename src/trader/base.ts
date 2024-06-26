import axios from "axios";
import defaults from "./config";
import EventEmitter from "eventemitter3";
import interceptors from "./interceptors";

class Base {
  public _emitter: EventEmitter;
  config: any;
  axios: any;
  derp: string = "will it rain?";
  constructor(config: any) {
    this._emitter = new EventEmitter();
    this.config = Object.assign({}, defaults, config);
    this.axios = axios.create({ baseURL: this.config.baseURL });

    interceptors.setup(this);
  }

  on(event: any, fn: any) {
    return this._emitter.on(event, fn);
  }

  getAccessToken(authCode: string) {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("access_type", this.config.accessType || "offline");
    params.append("client_id", this.config.apiKey);
    params.append("redirect_uri", this.config.redirectUri);
    params.append("code", authCode || this.config.authCode);

    delete this.config.accessToken;

    return this.axios.post("/oauth2/token", params);
  }

  refreshAccessToken(refreshToken: any) {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("access_type", this.config.accessType || "offline");
    params.append("client_id", this.config.apiKey);
    params.append("refresh_token", refreshToken || this.config.refreshToken);

    delete this.config.accessToken;

    return this.axios.post("/oauth2/token", params);
  }

  isAccessTokenExpired() {
    return this.config.accessTokenExpiresAt
      ? new Date(this.config.accessTokenExpiresAt).getTime() <= Date.now()
      : true;
  }
  isRefreshTokenExpired() {
    return this.config.refreshTokenExpiresAt
      ? new Date(this.config.refreshTokenExpiresAt).getTime() <= Date.now()
      : true;
  }
}

export default Base;
