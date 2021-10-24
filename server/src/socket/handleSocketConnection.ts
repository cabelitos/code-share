import type { Socket, Server } from 'socket.io';
import Container from 'typedi';

import InterviewService from '../services/interview';

const event = 'editorChanged';
const participantJoined = 'participantJoined';
const participantLeft = 'participantLeft';

const handleSocketConnection = async (
  io: Server,
  socket: Socket,
): Promise<void> => {
  const {
    joinInterviewInput,
    authCtx: { email },
  } = socket.data;
  const service = Container.get(InterviewService);
  const interviewId = joinInterviewInput.decodedInterviewId;

  try {
    const diffs = await service.getInterviewDiff(interviewId);
    diffs.forEach(data => socket.emit(event, data));

    const sockets = await io.in(interviewId).fetchSockets();
    sockets.forEach(s => socket.emit(participantJoined, s.data.authCtx.email));
    socket.join(interviewId);
    socket.to(interviewId).emit(participantJoined, email);

    socket.once('disconnect', () => {
      socket.to(interviewId).emit(participantLeft, email);
      socket.removeAllListeners();
    });

    socket.on(event, async (data): Promise<void> => {
      try {
        await service.createInterviewDiff(data, email, interviewId);
        socket.to(interviewId).emit(event, data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`An error has happenned disconnecting socket`, err);
        socket.disconnect();
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`An error has happenned disconnecting socket`, err);
    socket.disconnect();
  }
};

export default handleSocketConnection;
