import createJwksClient, { RsaSigningKey, SigningKey } from 'jwks-rsa';
import { AuthenticationError } from 'apollo-server-core';
import {
  verify as verifyJwt,
  VerifyOptions,
  JwtHeader,
  SigningKeyCallback,
  GetPublicKeyOrSecret,
} from 'jsonwebtoken';
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { promisify } from 'util';
import fastifyAuth from 'fastify-auth';

import type { AuthContext, TokenData } from './types';
import env from '../env';

const jwksClient = createJwksClient({
  jwksUri: env.JWKS_URI,
});

const verifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
};

const verifyJwtPromisified = promisify<
  string,
  GetPublicKeyOrSecret,
  VerifyOptions | undefined,
  object | undefined
>(verifyJwt);

const isRSAKey = (key: SigningKey): key is RsaSigningKey =>
  'rsaPublicKey' in key;

const getJwtKey = (header: JwtHeader, cb: SigningKeyCallback) => {
  if (header.kid) {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        cb(err);
        return;
      }
      const signingKey = isRSAKey(key) ? key.rsaPublicKey : key.publicKey;
      cb(null, signingKey);
    });
  } else {
    cb(new AuthenticationError('Invalid token'));
  }
};

export const decodeToken = async (
  authorization: string | null | undefined,
): Promise<AuthContext | null> => {
  const token = authorization?.split(' ')[1] ?? '';
  if (!token) return null;
  const decodedToken = (await verifyJwtPromisified(
    token,
    getJwtKey,
    verifyOptions,
  )) as TokenData;
  if (!decodedToken) return null;
  const { permissions } = decodedToken;
  return {
    email: decodedToken[env.ACCESS_TOKEN_EMAIL_CLAIN_NAME] ?? '',
    permissions: new Set(permissions),
  };
};

const registerAuthContext = (app: FastifyInstance): FastifyInstance =>
  app
    .decorate(
      'verifyJWTHandler',
      async (request: FastifyRequest, _: FastifyReply): Promise<void> => {
        const { authorization } = request.headers;
        const authCtx = await decodeToken(authorization);
        request.authCtx = authCtx ?? { email: '', permissions: new Set() };
      },
    )
    .register(fastifyAuth)
    .after(err => {
      if (err) return;
      app.addHook('preHandler', app.auth([app.verifyJWTHandler]));
    });

export default registerAuthContext;
