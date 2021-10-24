import type { Socket } from 'socket.io';

import { decodeToken } from '../auth/authPlugin';
import JoinInterviewInput from '../types/joinInterview';

const authMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> => {
  try {
    const authCtx = await decodeToken(socket.handshake.auth.token);
    if (!authCtx) {
      throw new Error('No auth information');
    }

    const interviewId = socket.handshake.query.interviewId ?? '';
    if (Array.isArray(interviewId)) {
      throw new Error('interviewId is an array');
    }
    const joinInterviewInput = new JoinInterviewInput();
    joinInterviewInput.interviewId = interviewId;

    socket.data = { ...socket.data, authCtx, joinInterviewInput };
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
