export type Config = {
  baseURL?: string; // Schwab API URL
  apiKey?: string; // The API Key (Cliient ID) provided by Schwab
  refreshAndRetry?: boolean; // Refresh token and retry request if a 401 response is received
  returnFullResponse?: boolean; // Return the full axios response instead of only the data
  accessToken?: string; // The OAuth2 access token
  refreshToken?: string; // The OAuth2 refresh token
  accessTokenExpiresAt?: string; // The access token's date and time of expiration
  refreshTokenExpiresAt?: string; // The refresh token's date and time of expiration
  redirectUri?: string; // The local uri to receive the access code from Schwab's OAuth2
};

const config: Config = {
  //baseURL: "https://api.schwabapi.com/trader/v1",
  baseURL: "https://microsoftedge.github.io/Demos/json-dummy-data",
  apiKey: "",
  refreshAndRetry: true,
  returnFullResponse: false,
  accessToken: "",
  refreshToken: "",
  accessTokenExpiresAt: "",
  refreshTokenExpiresAt: "",
  redirectUri: "https://localhost:8443",
};

export default config;
