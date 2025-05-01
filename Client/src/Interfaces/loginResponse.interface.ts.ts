export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
  };
}
