import axios, { AxiosResponse } from "axios";
import Base from "./base";
import get from "lodash.get";

function appendAccessToken(base: Base) {
  base.axios.interceptors.request.use((request: any) => {
    if (base.config.accessToken) {
      request.headers.Authorization = `Bearer ${base.config.accessToken}`;
    }

    console.log(request.headers);

    return request;
  });
}

function updateConfigOnNewToken(base: Base) {
  base.axios.interceptors.response.use((response: any) => {
    if (response.config.url === "/oauth2/token") {
      const token = parseToken(response.data);
      Object.assign(base.config, token);
      base._emitter.emit("token", token);
    }

    return response;
  });
}

function refreshAndRetry(base: Base) {
  base.axios.interceptors.response.use(undefined, (error: any) => {
    const originalRequest = error.config;
    const condition =
      base.config.refreshAndRetry &&
      get(error, "response.status") === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/oauth2/token";

    if (condition) {
      originalRequest._retry = true;
      return base.refreshAccessToken(base.config.accessToken).then(() => {
        originalRequest.headers.Authorization = `Bearer ${base.config.accessToken}`;
        return axios(originalRequest);
      });
    }

    return Promise.reject(error);
  });
}

function fullResponse(base: Base) {
  base.axios.interceptors.response.use(
    (response: any) => {
      return base.config.returnFullResponse ? response : get(response, "data");
    },
    (error: any) => {
      // we don't want to Promise.reject() as it will
      // trigger an ERR_UNHANDLED_REJECTION error.

      // axios response
      if (base.config.returnFullResponse) {
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

function poopToken(_this: any) {
  return _this.derp;
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
}

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

function setup(base: Base) {
  Object.keys(interceptors).forEach((key) =>
    interceptors[key as keyof typeof interceptors](base)
  );
}

export default Object.assign({}, interceptors, { setup });
