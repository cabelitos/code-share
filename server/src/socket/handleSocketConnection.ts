import type {
  Socket,
  Server,
  BroadcastOperator,
  RemoteSocket,
} from 'socket.io';
import Container from 'typedi';
import promiseRetry from 'promise-retry';

import envs from '../env';
import InterviewService from '../services/interview';
import UniqueConstraintViolated from '../errors/UniqueConstraintViolated';

const editorChanged = 'editorChanged';
const participantJoined = 'participantJoined';
const participantLeft = 'participantLeft';
const onLanguageChanged = 'onLanguageChanged';

const emitMessage = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: Socket | RemoteSocket<Record<string, any>>,
  event: string,
  msg: unknown,
): Promise<unknown> =>
  promiseRetry(retry =>
    Promise.race([
      new Promise<void>((resolve, reject) => {
        try {
          socket.emit(event, msg, resolve);
        } catch (err) {
          reject(err);
        }
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Timeout')),
          envs.SOCKET_TIMEOUT_IN_MS,
        ),
      ),
    ]).catch(retry),
  ).catch(() => socket.disconnect());

const emitMessageToNamespace = async (
  broadcaster: BroadcastOperator<Record<string, unknown>>,
  event: string,
  msg: unknown,
): Promise<unknown> => {
  const sockets = await broadcaster.fetchSockets();
  return Promise.allSettled(sockets.map(s => emitMessage(s, event, msg)));
};

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
    diffs.forEach(data => emitMessage(socket, editorChanged, data));
    const languageData = languagePerRoom[interviewId];
    if (languageData) {
      emitMessage(socket, onLanguageChanged, languageData);
    }

    const sockets = await io.in(interviewId).fetchSockets();
    sockets.forEach(s =>
      emitMessage(socket, participantJoined, s.data.authCtx.email),
    );
    socket.join(interviewId);
    emitMessageToNamespace(socket.to(interviewId), participantJoined, email);

    socket.once('disconnect', () => {
      emitMessageToNamespace(socket.to(interviewId), participantLeft, email);
      socket.removeAllListeners();
    });

    socket.on(editorChanged, async (data, ack): Promise<void> => {
      try {
        await service.createInterviewDiff(data, email, interviewId);
        emitMessageToNamespace(socket.to(interviewId), editorChanged, data);
        ack();
      } catch (err) {
        if (err instanceof UniqueConstraintViolated) {
          ack();
        } else {
          // eslint-disable-next-line no-console
          console.error(`An error has happenned disconnecting socket`, err);
          socket.disconnect();
        }
      }
    });

    socket.on(onLanguageChanged, (data, ack) => {
      if (languagePerRoom[interviewId] !== data) {
        languagePerRoom[interviewId] = data;
        emitMessageToNamespace(socket.to(interviewId), onLanguageChanged, data);
      }
      ack();
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`An error has happenned disconnecting socket`, err);
    socket.disconnect();
  }
};

export default handleSocketConnection;
