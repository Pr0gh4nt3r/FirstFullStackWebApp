export interface IAuthContextType {
  accessToken: string | null;
  userId: string | null;
  refresh: () => Promise<void>;
}
