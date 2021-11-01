import React from 'react';
import io, { Socket } from 'socket.io-client';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import type { editor } from 'monaco-editor';
import promiseRetry from 'promise-retry';
import { v4 as uuidV4 } from 'uuid';

import { useAuth } from '../auth';
import { useClearCurrentInterview } from '../../state/interview/currentInterview';
import { useCurrentInterviewLazyQuery } from '../../state/__generated__';
import useUpdatedRef from '../../hooks/useUpdatedRef';

export enum ConnectionState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
}

interface SocketCtxData {
  onEditorChanged: OnChange;
  participants: string[];
  connectionState: ConnectionState;
  onSetEditor: (editor: Parameters<OnMount>[0] | null) => void;
  onLanguageChanged: (language: string) => void;
  language: string;
}

const defaultLanguage = 'typescript';

const SocketCtx = React.createContext<SocketCtxData>({
  onEditorChanged: () => {},
  participants: [],
  connectionState: ConnectionState.DISCONNECTED,
  onSetEditor: () => {},
  onLanguageChanged: () => {},
  language: defaultLanguage,
});

export const useSocket = (): SocketCtxData => React.useContext(SocketCtx);

const timeoutInMs = parseInt(
  process.env.REACT_APP_SOCKET_TIMEOUT_IN_MS ?? '3000',
  10,
);

const emitEvent = (
  socket: Socket | null,
  event: string,
  data: Record<string, unknown>,
) => {
  const dataToSend = { ...data, etag: uuidV4() };
  return promiseRetry(
    retry =>
      Promise.race([
        new Promise<void>((resolve, reject) => {
          try {
            if (!socket || socket.disconnected) {
              resolve();
              return;
            }
            socket.emit(event, dataToSend, resolve);
          } catch (err) {
            reject(err);
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeoutInMs),
        ),
      ]).catch(retry),
    // eslint-disable-next-line no-console
  ).catch(console.error);
};

const SocketProvider: React.FC<{}> = ({ children }) => {
  const socketRef = React.useRef<Socket | null>(null);
  const [fetchCurrentInterview, { data }] = useCurrentInterviewLazyQuery({
    fetchPolicy: 'network-only',
  });
  const { authData } = useAuth();
  const clearCurrentInterview = useClearCurrentInterview();
  const accessToken = authData?.accessToken;
  const [connectionState, setConnectionState] = React.useState(
    ConnectionState.DISCONNECTED,
  );
  const [language, setLanguage] = React.useState(defaultLanguage);
  const [editor, onSetEditor] = React.useState<null | Parameters<OnMount>[0]>(
    null,
  );
  const { t } = useTranslation('notepad');
  const me = t('me');
  const meRef = useUpdatedRef(me);
  const [participants, setParticipants] = React.useState<string[]>([
    meRef.current,
  ]);
  const suppress = React.useRef(false);

  React.useEffect(() => {
    if (accessToken) {
      fetchCurrentInterview();
    }
  }, [accessToken, fetchCurrentInterview]);

  React.useEffect((): (() => void) => {
    const interviewId = data?.currentInterview?.id;
    if (
      accessToken &&
      interviewId &&
      process.env.REACT_APP_SERVICE_URL &&
      editor
    ) {
      let ended = false;
      const socket = io(process.env.REACT_APP_SERVICE_URL, {
        path: process.env.REACT_APP_SOCKET_PATH,
        query: {
          interviewId,
        },
        transports: ['websocket', 'polling'],
        auth: {
          token: `Bearer ${accessToken}`,
        },
      });
      setConnectionState(ConnectionState.CONNECTING);
      socket.on('connect', () => {
        socketRef.current = socket;
        setConnectionState(ConnectionState.CONNECTED);
        editor.updateOptions({ readOnly: false });
      });
      socket.on('editorChanged', ({ value, event }, ack) => {
        suppress.current = true;
        editor.executeEdits(
          value,
          event.map((e: editor.IIdentifiedSingleEditOperation) => ({
            ...e,
            forceMoveMarkers: true,
          })),
        );
        suppress.current = false;
        ack();
      });
      socket.on('participantJoined', (email, ack) => {
        setParticipants(prev => {
          if (prev.indexOf(email) === -1) return [...prev, email];
          return prev;
        });
        ack();
      });
      socket.on('interviewEnded', () => {
        ended = true;
        clearCurrentInterview(interviewId);
      });
      socket.on('participantLeft', (email, ack) => {
        setParticipants(prev => prev.filter(e => e !== email));
        ack();
      });
      socket.on('disconnect', reason => {
        if (reason === 'io server disconnect' && !ended) {
          socket.connect();
        }
        setParticipants([meRef.current]);
        setConnectionState(ConnectionState.DISCONNECTED);
        editor.updateOptions({ readOnly: true });
      });
      socket.on('onLanguageChanged', ({ language }, ack) => {
        setLanguage(language);
        ack();
      });
      socketRef.current = socket;
    }
    return (): void => {
      socketRef.current?.disconnect();
      socketRef.current?.removeAllListeners();
      socketRef.current = null;
      suppress.current = false;
    };
  }, [data, accessToken, editor, clearCurrentInterview, meRef]);
  const value = React.useMemo<SocketCtxData>(
    () => ({
      onEditorChanged: (
        value: Parameters<OnChange>[0],
        { changes, versionId }: Parameters<OnChange>[1],
      ): void => {
        if (suppress.current) {
          return;
        }
        emitEvent(socketRef.current, 'editorChanged', {
          value,
          event: changes,
          versionId,
        });
      },
      participants,
      language,
      connectionState,
      onSetEditor,
      onLanguageChanged: (language: string) => {
        setLanguage(language);
        emitEvent(socketRef.current, 'onLanguageChanged', { language });
      },
    }),
    [connectionState, participants, language],
  );
  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>;
};

export default SocketProvider;
