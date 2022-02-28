import { useTranslation } from 'react-i18next';
import { useState, useContext } from 'react';
import { Popper, Box, Fade, Button, makeStyles, Paper, useMediaQuery, Divider } from '@material-ui/core';
import { AppThemeContext } from 'src/helpers/app-theme-context';
import './language-picker.scss';
import { ReactComponent as IntlIcon } from '../../assets/icons/intl.svg';
import { showTranslations } from 'translation-check';
import CustomButton from '../Button/CustomButton';
import { mobileMediaQuery } from 'src/themes/mediaQuery';

//Add new translations to the dropdown here!
const lngs: any = {
  en: { nativeName: 'English' },
  zh: { nativeName: '中文' },
  de: { nativeName: 'Deutsch' },
  fr: { nativeName: 'Français' },
  it: { nativeName: 'Italiano' },
  id: { nativeName: 'Bahasa' },
  no: { nativeName: 'Norsk' },
  tl: { nativeName: 'Tagalog' },
};

const LangButton = ({ text }: { text: string }) => {
  const isMobile = useMediaQuery(mobileMediaQuery);
  if (isMobile) {
    return <CustomButton type="icon" color="text.primary" icon={IntlIcon} />;
  }
  return <CustomButton type="outline" color="text.primary" icon={IntlIcon} text={`${text}`} />;
};
interface Props {
  border: Boolean;
}
function LanguagePicker(props: Props) {
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any, lng: string) => {
    i18n.changeLanguage(lng);
    i18n.reloadResources();
    //translations aren't reloading correctly for all components,
    //force reload
    // window.location.reload();
  };
  const currentTheme = useContext(AppThemeContext);
  const useStyles = makeStyles(theme => ({
    popperMenu: {
      '& .select-language:hover': {
        backgroundColor: currentTheme.theme.palette.mode.lightGray200,
      },
    },
    colour: {
      '& path': {
        fill: `${currentTheme.theme.palette.primary.main} !important`,
      },
    },
  }));
  const styles = useStyles();

  const getStyle = (lng: string) => {
    return i18n.resolvedLanguage === lng ? 'bold' : 'normal';
  };
  const id = 'lang-popper';
  const open = Boolean(anchorEl);
  const handleMouseOver = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleMouseExit = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="div"
      onMouseEnter={e => handleMouseOver(e)}
      onMouseLeave={() => handleMouseExit()}
      id="lang-menu-button-hover"
    >
      <LangButton text={i18n.resolvedLanguage.toUpperCase()} />
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={400}>
            <Paper className={`${styles.popperMenu} ohm-menu`} elevation={1}>
              <Box component="div" className="buy-tokens">
                {Object.keys(lngs).map(lng => (
                  <Button
                    key={lng}
                    style={{ fontWeight: getStyle(lng) }}
                    type="submit"
                    onClick={e => handleClick(e, lng)}
                    className="select-language"
                  >
                    {lngs[lng].nativeName}
                  </Button>
                ))}

                <Divider color="secondary" />
                <Button className="select-language" onClick={e => showTranslations(i18n)}>
                  {t('common.helpTranslate')}
                </Button>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}

export default LanguagePicker;
