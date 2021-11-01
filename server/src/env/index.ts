import { cleanEnv, host, port, str, url, num } from 'envalid';

const envs = cleanEnv(process.env, {
  ACCESS_TOKEN_EMAIL_CLAIN_NAME: str(),
  GRAPHQL_PATH: str(),
  HOST: host(),
  JWKS_URI: url(),
  PORT: port(),
  SOCKET_PATH: str(),
  SOCKET_TIMEOUT_IN_MS: num(),
});

export default envs;
