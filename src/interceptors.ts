import { AxiosError } from "axios";
import Trader from "./Trader";

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
    async (error) => {
      const originalRequest = error.config;
      const condition =
        error.response.status === 401 &&
        client.config.refreshAndRetry &&
        !originalRequest._retry &&
        originalRequest.url !== "/v1/oauth/token";
      if (condition) {
        return client.refreshAccessToken().then(() => {
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
