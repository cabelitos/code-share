import { FastifyInstance } from 'fastify';
import fastifySocketIo from 'fastify-socket.io';

import handleSocketConnection from './handleSocketConnection';
import authMiddleware from './authMiddleware';
import envs from '../env';
import joinInterview from './joinInterview';

const registerSocket = (app: FastifyInstance): FastifyInstance =>
  app.register(fastifySocketIo, { path: envs.SOCKET_PATH }).after(err => {
    if (err) return;
    app.io.use(authMiddleware);
    app.io.use(joinInterview);
    app.io.on('connection', socket => handleSocketConnection(app.io, socket));
    const closeSocketRoom = (interviewId: string): void => {
      const broadcast = app.io.in(interviewId);
      broadcast.emit('interviewEnded', true);
      broadcast.disconnectSockets(true);
    };
    app.addHook('preHandler', (request, _, next) => {
      request.closeSocketRoom = closeSocketRoom;
      next();
    });
  });

export default registerSocket;
