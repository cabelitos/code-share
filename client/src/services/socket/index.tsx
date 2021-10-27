import React from 'react';
import io, { Socket } from 'socket.io-client';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../auth';
import { useClearCurrentInterview } from '../../state/interview/currentInterview';
import { useCurrentInterviewLazyQuery } from '../../state/__generated__';

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
}

const SocketCtx = React.createContext<SocketCtxData>({
  onEditorChanged: () => {},
  participants: [],
  connectionState: ConnectionState.DISCONNECTED,
  onSetEditor: () => {},
});

export const useSocket = (): SocketCtxData => React.useContext(SocketCtx);

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
  const [editor, onSetEditor] = React.useState<null | Parameters<OnMount>[0]>(
    null,
  );
  const { t } = useTranslation('notepad');
  const me = t('me');
  const meRef = React.useRef(me);
  meRef.current = me;
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
      });
      socket.on('editorChanged', ({ value, event }) => {
        suppress.current = true;
        editor.executeEdits(value, event);
        suppress.current = false;
      });
      socket.on('participantJoined', email => {
        setParticipants(prev => {
          if (prev.indexOf(email) === -1) return [...prev, email];
          return prev;
        });
      });
      socket.on('interviewEnded', () => {
        ended = true;
        clearCurrentInterview(interviewId);
      });
      socket.on('participantLeft', email => {
        setParticipants(prev => prev.filter(e => e !== email));
      });
      socket.on('disconnect', reason => {
        if (reason === 'io server disconnect' && !ended) {
          socket.connect();
        }
        setParticipants([meRef.current]);
        setConnectionState(ConnectionState.DISCONNECTED);
      });
      socketRef.current = socket;
    }
    return (): void => {
      socketRef.current?.disconnect();
      socketRef.current?.removeAllListeners();
      socketRef.current = null;
      suppress.current = false;
    };
  }, [data, accessToken, editor, clearCurrentInterview]);
  const value = React.useMemo<SocketCtxData>(
    () => ({
      onEditorChanged: (
        value: Parameters<OnChange>[0],
        { changes, versionId }: Parameters<OnChange>[1],
      ): void => {
        if (suppress.current) {
          return;
        }
        socketRef.current?.emit('editorChanged', {
          value,
          event: changes,
          versionId,
        });
      },
      participants,
      connectionState,
      onSetEditor: editor => onSetEditor(editor),
    }),
    [connectionState, participants],
  );
  return <SocketCtx.Provider value={value}>{children}</SocketCtx.Provider>;
};

export default SocketProvider;
