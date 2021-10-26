import { FastifyReply } from 'fastify';

import { AuthContext } from '../../auth/types';

declare module 'fastify' {
  interface FastifyInstance {
    verifyJWTHandler(
      request: FastifyRequest,
      reply: FastifyReply,
      done: (error?: Error) => void,
    ): Promise<void>;
  }

  interface FastifyRequest {
    authCtx: AuthContext;
    closeSocketRoom(interviewId: string): void;
  }
}
