import { FastifyRequest } from 'fastify';

import type { AuthContext } from '../auth/types';

export interface ContextData {
  authCtx: AuthContext;
  closeSocketRoom: FastifyRequest['closeSocketRoom'];
}

const createContext = ({
  request: { authCtx, closeSocketRoom },
}: {
  request: FastifyRequest;
}): ContextData => ({ authCtx, closeSocketRoom });

export default createContext;
