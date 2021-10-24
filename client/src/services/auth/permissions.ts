import jwtDecode from 'jwt-decode';

export enum Permissions {
  CREATE_INTERVIEW = 'interview:create',
  END_INTERVIEW = 'interview:end',
}

const getPermissions = (
  accessToken: string | null | undefined,
): Set<string> => {
  if (!accessToken) return new Set();
  const decodedJwt = jwtDecode<{ permissions?: string[] }>(accessToken);
  return new Set(decodedJwt.permissions ?? []);
};

export default getPermissions;
