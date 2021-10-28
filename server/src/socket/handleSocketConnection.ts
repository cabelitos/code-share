import type { Socket, Server } from 'socket.io';
import Container from 'typedi';

import InterviewService from '../services/interview';

const editorChanged = 'editorChanged';
const participantJoined = 'participantJoined';
const participantLeft = 'participantLeft';
const onLanguageChanged = 'onLanguageChanged';

const handleSocketConnection = async (
  io: Server,
  socket: Socket,
  languagePerRoom: Record<string, unknown>,
): Promise<void> => {
  const {
    joinInterviewInput,
    authCtx: { email },
  } = socket.data;
  const service = Container.get(InterviewService);
  const interviewId = joinInterviewInput.decodedInterviewId;

  try {
    const diffs = await service.getInterviewDiff(interviewId);
    diffs.forEach(data => socket.emit(editorChanged, data));
    const languageData = languagePerRoom[interviewId];
    if (languageData) socket.emit(onLanguageChanged, languageData);

    const sockets = await io.in(interviewId).fetchSockets();
    sockets.forEach(s => socket.emit(participantJoined, s.data.authCtx.email));
    socket.join(interviewId);
    socket.to(interviewId).emit(participantJoined, email);

    socket.once('disconnect', () => {
      socket.to(interviewId).emit(participantLeft, email);
      socket.removeAllListeners();
    });

    socket.on(editorChanged, async (data): Promise<void> => {
      try {
        await service.createInterviewDiff(data, email, interviewId);
        socket.to(interviewId).emit(editorChanged, data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`An error has happenned disconnecting socket`, err);
        socket.disconnect();
      }
    });

    socket.on(onLanguageChanged, data => {
      languagePerRoom[interviewId] = data;
      socket.to(interviewId).emit(onLanguageChanged, data);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`An error has happenned disconnecting socket`, err);
    socket.disconnect();
  }
};

export default handleSocketConnection;
