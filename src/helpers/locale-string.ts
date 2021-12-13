import { useTranslation } from 'react-i18next';

export const localeString = (): string => {
  const { t, i18n } = useTranslation();
  var ls = 'en-US';
  switch (i18n.language) {
    case 'en':
      ls = 'en-US';
      break;
    case 'no':
      ls = 'no-NO';
      break;
    case 'id':
      ls = 'in-ID';
      break;
    case 'tl':
      ls = 'tl-PH';
      break;
    case 'fr':
      ls = 'fr-FR';
      break;
    default:
      ls = 'default';
      break;
  }
  return ls;
};
