export const localeString = (i18n: any): string => {
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
