import { FastifyReply } from 'fastify';
import type { Server } from 'socket.io';

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
    io: Server;
  }
}
