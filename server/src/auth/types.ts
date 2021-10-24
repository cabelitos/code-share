export interface AuthContext {
  permissions: Set<string>;
  email: string;
}

export type TokenData = Record<string, string>;

export enum Permissions {
  CREATE_INTERVIEW = 'interview:create',
  END_INTERVIEW = 'interview:end',
  JOIN_INTERVIEW = 'interview:join',
}
