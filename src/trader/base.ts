import axios from "axios";
import defaults from "./config";
import EventEmitter from "eventemitter3";
import interceptors from "./interceptors";

//const tokens = require("./resources/tokens");

class Base {
  public _emitter: EventEmitter;
  config: any;
  axios: any;
  constructor(config: any) {
    this._emitter = new EventEmitter();
    this.config = Object.assign({}, defaults, config);
    this.axios = axios.create({ baseURL: this.config.baseURL });

    interceptors.setup(this);
  }
} // Base

/**
 * Add a listener for a given event.
 *
 * @instance
 * @memberof TDAmeritrade
 * @param {'login'|'token'} event The event name
 * @param {EventEmitter.EventListener<any, any>} fn Callback function
 * @returns {EventEmitter<string | symbol, any>} Event emitter
 */

// function on(event: any, fn: any) {
//   return this._emitter.on(event, fn);
// }
// Base.prototype.on = on;
// Base.prototype.getAccessToken = tokens.getAccessToken;
// Base.prototype.refreshAccessToken = tokens.refreshAccessToken;
// Base.prototype.isAccessTokenExpired = tokens.isAccessTokenExpired;
// Base.prototype.isRefreshTokenExpired = tokens.isRefreshTokenExpired;

export default Base;
