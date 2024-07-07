import { AxiosError } from "axios";
import Trader from "./Trader";
import { refreshAccessToken } from "./resources/tokens";

function appendAccessTokenInterceptor(client: Trader) {
  client.axios.interceptors.request.use((request) => {
    if (client.config.accessToken) {
      request.headers.Authorization = `Bearer ${client.config.accessToken}`;
    }
    return request;
  });
}

function refreshAndRetryInterceptor(client: Trader) {
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
          originalRequest.headers.Authorization = `Bearer ${client.config.accessToken}`;
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

export function setupInterceptors(client: Trader) {
  Object.keys(interceptors).forEach((key) => {
    interceptors[key](client);
  });
}
