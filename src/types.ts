export type TokenResponse = {
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  access_token: string;
  id_token: string;
}

export type Token = {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
  idToken: string;
  expiresIn: string;
}
