import React from 'react';
import styled from 'styled-components';
import { List } from '@react95/core';
import { Wmsui322223 } from '@react95/icons';

const StyledList = styled(List)`
  height: 50vh;
  overflow: auto;
  z-index: 1000;
`;

const emptyExtraProps = {};
const iconExtraProps = { icon: <Wmsui322223 variant="16x16_4" /> };

interface LanguagesSelectorProps {
  languages: string[];
  selectedLanguage: string;
  onLanguageChanged: (language: string) => void;
}

type LanguageSelectorItemProps = Omit<LanguagesSelectorProps, 'languages'> & {
  language: string;
};

const LanguageSelectorItem: React.FC<LanguageSelectorItemProps> = ({
  language,
  onLanguageChanged,
  selectedLanguage,
}) => {
  const onClick = React.useCallback(() => {
    onLanguageChanged(language);
  }, [onLanguageChanged, language]);
  let extraProps: Record<string, unknown> = emptyExtraProps;
  if (language === selectedLanguage) {
    extraProps = iconExtraProps;
  }
  return (
    <List.Item onClick={onClick} {...extraProps}>
      {language}
    </List.Item>
  );
};

const LanguagesSelector: React.FC<LanguagesSelectorProps> = ({
  languages,
  onLanguageChanged,
  selectedLanguage,
}) => {
  return (
    <StyledList>
      {languages.map(language => (
        <LanguageSelectorItem
          key={language}
          language={language}
          selectedLanguage={selectedLanguage}
          onLanguageChanged={onLanguageChanged}
        />
      ))}
    </StyledList>
  );
};

export default LanguagesSelector;
