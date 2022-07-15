import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';

function Warning() {
  const { t } = useTranslation();
  const time = new Date('2022-7-16 00:00:00Z').toLocaleString();
  return (
    <Box bgcolor="#F5523C" color="white" padding="20px 40px">
      <p style={{ fontSize: '20px', lineHeight: '30px' }}>
        {t('common.warning', { time })}
        <a style={{ color: 'white' }} href="https://ottopia.app/treasury/pond">
          ottopia.app
        </a>
      </p>
    </Box>
  );
}

export default Warning;
