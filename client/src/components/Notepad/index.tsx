import React from 'react';
import { Modal } from '@react95/core';
import { Notepad as NotepadIcon } from '@react95/icons';
import MonacoEditor, { useMonaco, OnMount } from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { animated, SpringValue } from '@react-spring/web';

import LanguagesSelector from './LanguagesSelector';
import Participants from './Participants';
import { useSocket, ConnectionState } from '../../services/socket';
import useDebounced from '../../hooks/useDebounced';

const NotepadIconStyled = <NotepadIcon variant="16x16_4" />;
const defaultPosition = { x: 0, y: 0 };
const defaultEditorOptions = {
  fontFamily: 'MS Sans Serif',
  fontSize: 15,
  readOnly: false,
  minimap: { enabled: false },
};

const StyledModal = styled(animated(Modal))<{ isFullscreen: boolean }>`
  height: ${({ isFullscreen }) =>
    isFullscreen ? '100%;' : 'calc(100% - 28px);'};
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  width: 100vw;
  display: flex;
`;

const StyledMonacoEditor = styled(MonacoEditor)`
  margin: -6px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
`;

const BlockerMessage = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  color: rgb(255, 255, 255);
  pointer-events: none;
`;

interface NotepadProps {
  onClose: () => void;
  style?: {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
  title: string;
  isFullscreen?: boolean;
}

const Notepad: React.FC<NotepadProps> = ({
  onClose,
  style,
  title,
  isFullscreen = false,
}) => {
  const { t } = useTranslation('notepad');
  const monaco = useMonaco();
  const languageStr = t('languages');
  const {
    onEditorChanged,
    onSetEditor,
    connectionState,
    onLanguageChanged: onLanguageChangedSocket,
    language,
  } = useSocket();
  const onSetEditorRef = React.useRef(onSetEditor);
  onSetEditorRef.current = onSetEditor;
  const onLanguageChangedRef = React.useRef(onLanguageChangedSocket);
  onLanguageChangedRef.current = onLanguageChangedSocket;
  const debouncedConnectedState = useDebounced(connectionState);

  const onLanguageChanged = React.useCallback((language: string) => {
    onLanguageChangedRef.current(language);
  }, []);

  const menu = React.useMemo(() => {
    const languagesList = (
      <LanguagesSelector
        selectedLanguage={language}
        onLanguageChanged={onLanguageChanged}
        languages={
          monaco
            ? monaco.languages.getLanguages().map(({ id }) => id)
            : [language]
        }
      />
    );
    return [{ name: languageStr, list: languagesList }];
  }, [monaco, languageStr, language, onLanguageChanged]);

  const isConnected = debouncedConnectedState === ConnectionState.CONNECTED;

  React.useEffect(() => {
    const model = monaco?.editor.getModels()[0];
    if (!model) return;
    monaco?.editor.setModelLanguage(model, language);
  }, [language, monaco]);

  const onMount = React.useCallback<OnMount>(
    editor => {
      onSetEditorRef.current(editor);
    },
    [onSetEditorRef],
  );

  React.useEffect(() => {
    return () => {
      onSetEditorRef.current(null);
    };
  }, []);

  return (
    <StyledModal
      isFullscreen={isFullscreen}
      style={style}
      defaultPosition={defaultPosition}
      icon={NotepadIconStyled}
      title={title}
      closeModal={onClose}
      menu={menu}
    >
      <Content>
        <StyledMonacoEditor
          theme="light"
          onMount={onMount}
          onChange={onEditorChanged}
          defaultLanguage={language}
          options={defaultEditorOptions}
        />
        <Participants />
        {!isConnected && (
          <BlockerMessage>{t('noConnectionMessage')}</BlockerMessage>
        )}
      </Content>
    </StyledModal>
  );
};

export default Notepad;
