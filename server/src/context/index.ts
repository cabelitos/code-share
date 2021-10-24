import { FastifyRequest } from 'fastify';
import type { Server } from 'socket.io';

import type { AuthContext } from '../auth/types';

export interface ContextData {
  authCtx: AuthContext;
  io: Server;
}

const createContext = ({
  request: { authCtx, io },
}: {
  request: FastifyRequest;
}): ContextData => ({ authCtx, io });

export default createContext;
