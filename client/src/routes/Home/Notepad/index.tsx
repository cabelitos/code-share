import React from 'react';
import { Modal, Alert } from '@react95/core';
import { Notepad as NotepadIcon } from '@react95/icons';
import MonacoEditor, { useMonaco, OnMount } from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { animated, SpringValue } from '@react-spring/web';

import LanguagesSelector from './LanguagesSelector';
import Participants from './Participants';
import { useSocket, ConnectionState } from '../../../services/socket';

const NotepadIconStyled = <NotepadIcon variant="16x16_4" />;
const defaultPosition = { x: 0, y: 0 };
const defaultLanguagesList = ['typescript'];
const defaultEditorOptions = {
  fontFamily: 'MS Sans Serif',
  fontSize: 15,
  readOnly: false,
  minimap: { enabled: false },
};

const StyledModal = styled(animated(Modal))`
  height: calc(100% - 28px);
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

const noOp = () => {};
const noButtons: never[] = [];

interface NotepadProps {
  onClose: () => void;
  style?: {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
  title: string;
}

const Notepad: React.FC<NotepadProps> = ({ onClose, title, style }) => {
  const { t } = useTranslation('notepad');
  const monaco = useMonaco();
  const languageStr = t('languages');
  const [language, setLanguage] = React.useState(defaultLanguagesList[0]);
  const { onEditorChanged, onSetEditor, connectionState } = useSocket();
  const onSetEditorRef = React.useRef(onSetEditor);
  onSetEditorRef.current = onSetEditor;

  const menu = React.useMemo(() => {
    const languagesList = (
      <LanguagesSelector
        selectedLanguage={language}
        onLanguageChanged={setLanguage}
        languages={
          monaco
            ? monaco.languages.getLanguages().map(({ id }) => id)
            : defaultLanguagesList
        }
      />
    );
    return [{ name: languageStr, list: languagesList }];
  }, [monaco, languageStr, language]);

  const isConnected = connectionState === ConnectionState.CONNECTED;
  const editorOptions = React.useMemo(
    () => ({
      ...defaultEditorOptions,
      readOnly: !isConnected,
    }),
    [isConnected],
  );

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
          options={editorOptions}
        />
        {!isConnected && (
          <Alert
            buttons={noButtons}
            closeAlert={noOp}
            message={t('noConnectionMessage')}
            title={t('noConnection')}
            type="warning"
          />
        )}
        <Participants />
      </Content>
    </StyledModal>
  );
};

export default Notepad;
