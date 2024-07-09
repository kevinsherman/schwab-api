import { AxiosError } from "axios";
import Base from "./Base";
import { refreshAccessToken } from "./resources/tokens";
import { TokenResponse, Token } from "./types";

function appendAccessTokenInterceptor(client: Base) {
  client.axios.interceptors.request.use((request) => {
    if (client.config.token!.accessToken) {
      request.headers.Authorization = `Bearer ${client.config.token!.accessToken}`;
    }
    return request;
  });
}

function refreshAndRetryInterceptor(client: Base) {
  client.axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config!;
      const condition =
        error.response!.status === 401 &&
        client.config.refreshAndRetry &&
        //@ts-ignore
        !originalRequest._retry &&
        originalRequest.url !== "/v1/oauth/token";
      if (condition) {
        const { data } = await refreshAccessToken(client);
        const token = parseToken(data);

        Object.assign(client.config.token!, token);
        client.emitter.emit("token", token);

        //@ts-ignore
        originalRequest._retry = true;
        return client.axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
}

const interceptors = {
  appendAccessTokenInterceptor,
  refreshAndRetryInterceptor,
};

export function setupInterceptors(client: Base) {
  Object.keys(interceptors).forEach((key) => {
    interceptors[key](client);
  });
}

function parseToken(data: TokenResponse): Token {
  const res = {
    accessToken: data.access_token,
    accessTokenExpiresAt: timeFromNow(data.expires_in),
    refreshToken: data.refresh_token,
    scope: data.scope,
    tokenType: data.token_type,
    idToken: data.id_token,
    expiresIn: data.expires_in,
  };
  // remove props with falsey values
  return filterObj(res, (value: any) => value) as Token;
}

function timeFromNow(seconds: number) {
  return seconds ? new Date(Date.now() + 1000 * seconds).toString() : undefined;
}

function filterObj(obj: object, cb: Function): object {
  return Object.keys(obj).reduce((acc, cur) => {
    if (cb(obj[cur], cur)) {
      acc[cur] = obj[cur];
    }
    return acc;
  }, {});
}
