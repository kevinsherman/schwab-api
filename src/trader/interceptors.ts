import axios from "axios";
import Trader from "./trader";
import Base from "./base";
import get from "lodash.get";

function appendAccessToken(trader: Trader) {
  trader.axios.interceptors.request.use((request: any) => {
    if (trader.config.accessToken) {
      request.headers.Authorization = `Bearer ${trader.config.accessToken}`;
    }

    return request;
  });
}

function updateConfigOnNewToken(trader: Trader) {
  trader.axios.interceptors.response.use((response: any) => {
    if (response.config.url === "/oauth2/token") {
      const token = parseToken(response.data);
      Object.assign(trader.config, token);
      trader._emitter.emit("token", token);
    }

    return response;
  });
}

/**
 * Refresh token and retry request on status code 401.
 *
 * @private
 * @param {Base} client Client
 * @returns {void}
 */
function refreshAndRetry(trader: Trader) {
  trader.axios.interceptors.response.use(undefined, (error: any) => {
    const originalRequest = error.config;
    const condition =
      trader.config.refreshAndRetry &&
      get(error, "response.status") === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/oauth2/token";

    if (condition) {
      originalRequest._retry = true;
      return trader.refreshAccessToken(trader.config.accessToken).then(() => {
        originalRequest.headers.Authorization = `Bearer ${trader.config.accessToken}`;
        return axios(originalRequest);
      });
    }

    return Promise.reject(error);
  });
}

function fullResponse(trader: Trader) {
  trader.axios.interceptors.response.use(
    (response: any) => {
      return trader.config.returnFullResponse
        ? response
        : get(response, "data");
    },
    (error: any) => {
      // we don't want to Promise.reject() as it will
      // trigger an ERR_UNHANDLED_REJECTION error.

      // axios response
      if (trader.config.returnFullResponse) {
        throw error;
      }

      // custom error response
      if (error.response) {
        const customError = {
          status: get(error, "response.status"),
          error: get(error, "response.data.error"),
        };

        throw customError;
      }

      // extract error
      const customError = new Error(error.message);
      customError.stack = error.stack;
      throw customError;
    }
  );
}

//#region helpers

function parseToken(data: any) {
  const res = {
    accessToken: data.access_token,
    accessTokenExpiresAt: timeFromNow(data.expires_in),
    refreshToken: data.refresh_token,
    refreshTokenExpiresAt: timeFromNow(data.refresh_token_expires_in),
    scope: data.scope,
    tokenType: data.token_type,
  };

  // remove props with falsey values
  return filterObj(res, (value: any) => value);
} // parseToken()

function timeFromNow(seconds: number) {
  return seconds
    ? new Date(Date.now() + 1000 * seconds).toISOString()
    : undefined;
}

function filterObj(obj: any, cb: any) {
  return Object.keys(obj).reduce((acc: any, cur: any) => {
    if (cb(obj[cur], cur)) {
      acc[cur] = obj[cur];
    }
    return acc;
  }, {});
}

//#endregion

const interceptors = {
  appendAccessToken,
  updateConfigOnNewToken,
  refreshAndRetry,
  fullResponse,
};

/**
 * Add all interceptors to the client's axios instance.
 *
 * @private
 * @param {Base} client Client
 * @returns {void}
 */
function setup(base: Base) {
  Object.keys(interceptors).forEach((key: string) => interceptors[key](base));
}

export default Object.assign({}, interceptors, { setup });
