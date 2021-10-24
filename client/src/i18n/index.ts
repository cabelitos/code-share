import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en';
import pt from './pt';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, pt },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: true,
    },
  });

export default i18n;
