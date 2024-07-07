import { AxiosError } from "axios";
import Base from "./Base";
import { refreshAccessToken } from "./resources/tokens";

function appendAccessTokenInterceptor(client: Base) {
  client.axios.interceptors.request.use((request) => {
    if (client.config.token.access_token) {
      request.headers.Authorization = `Bearer ${client.config.token.access_token}`;
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
        return refreshAccessToken(client).then(() => {
          //@ts-ignore
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${client.config.token.access_token}`;
          return client.axios(originalRequest);
        });
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
