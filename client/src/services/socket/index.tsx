import React from 'react';
import io, { Socket } from 'socket.io-client';
import type { OnChange, OnMount } from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../auth';
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
  const accessToken = authData?.accessToken;
  const [connectionState, setConnectionState] = React.useState(
    ConnectionState.DISCONNECTED,
  );
  const [editor, onSetEditor] = React.useState<null | Parameters<OnMount>[0]>(
    null,
  );
  const { t } = useTranslation('notepad');
  const [participants, setParticipants] = React.useState<string[]>([t('me')]);
  const maxVersionId = React.useRef(-1);

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
      socket.on('editorChanged', ({ value, event, versionId }) => {
        maxVersionId.current = Math.max(maxVersionId.current, versionId);
        editor.executeEdits(value, event);
      });
      socket.on('participantJoined', email => {
        setParticipants(prev => {
          if (prev.indexOf(email) === -1) return [...prev, email];
          return prev;
        });
      });
      socket.on('participantLeft', email => {
        setParticipants(prev => prev.filter(e => e !== email));
      });
      socket.on('disconnect', () => {
        setConnectionState(ConnectionState.DISCONNECTED);
      });
      socketRef.current = socket;
    }
    return (): void => {
      socketRef.current?.disconnect();
      socketRef.current?.removeAllListeners();
      socketRef.current = null;
    };
  }, [data, accessToken, editor]);
  const value = React.useMemo<SocketCtxData>(
    () => ({
      onEditorChanged: (
        value: Parameters<OnChange>[0],
        { changes, versionId }: Parameters<OnChange>[1],
      ): void => {
        if (versionId <= maxVersionId.current) {
          return;
        }
        maxVersionId.current = versionId;
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
