import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import commonSettings from './global';

const colors = {
  otterDark: '#1D2654',
  otterBlue: '#3B4BD8',
  otterBlueHover: '#303FC7',
  darkGray200: '#5E6E99',
  darkGray300: '#434E77',
  clamPink: '#FF6854',
};

const lightTheme = {
  color: '#1D2654',
  white: '#ffffff',
  gold: '#F8CC82',
  gray: '#A3A3A3',
  textHighlightColor: '#3B4BD8',
  backgroundColor: '#AFCDE9',
  background: 'linear-gradient(180deg, #AFCDE9 1%, #F7FBE7 100%)',
  paperBg: '#fff',
  modalBg: '#FAFAFAEF',
  popoverBg: 'rgba(255, 255, 255, 0.95)',
  menuBg: 'rgba(255, 255, 255, 0.5)',
  backdropBg: 'rgba(0, 0, 0, 0.3)',
  largeTextColor: '#759AAE',
  activeLinkColor: '#222222',
  activeLinkSvgColor: 'invert(64%) sepia(11%) saturate(934%) hue-rotate(157deg) brightness(90%) contrast(86%)',
  primaryButtonColor: '#fff',
  primaryButtonBG: colors.otterBlue,
  primaryButtonHoverBG: colors.otterBlueHover,
  // these need fixing
  primaryButtonHoverColor: '#fff',
  secondaryButtonHoverBG: '#fff',
  outlinedPrimaryButtonHoverBG: '#F8CC82',
  outlinedPrimaryButtonHoverColor: '#333333',
  outlinedSecondaryButtonHoverBG: '#fff',
  outlinedSecondaryButtonHoverColor: colors.darkGray300,
  containedSecondaryButtonHoverBG: '#fff',
};

export const light = responsiveFontSizes(
  createTheme(
    {
      primary: {
        main: lightTheme.color,
      },
      palette: {
        type: 'light',
        background: {
          default: lightTheme.backgroundColor,
          paper: lightTheme.paperBg,
        },
        //@ts-ignore
        contrastText: lightTheme.color,
        primary: {
          main: lightTheme.color,
        },
        neutral: {
          main: lightTheme.color,
          secondary: lightTheme.gray,
        },
        text: {
          primary: lightTheme.color,
          secondary: colors.darkGray200,
        },
      },
      props: {
        MuiSvgIcon: {
          //@ts-ignore
          // htmlColor: lightTheme.svgColor,
        },
      },
      overrides: {
        MuiCssBaseline: {
          '@global': {
            body: {
              background: lightTheme.background,
            },
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: lightTheme.paperBg,
            backdropFilter: 'blur(100px)',
            '&.ohm-card': {
              backgroundColor: lightTheme.paperBg,
            },
            '&.ohm-modal': {
              backgroundColor: lightTheme.modalBg,
            },
            '&.ohm-menu': {
              backgroundColor: lightTheme.white,
            },
            '&.ohm-popover': {
              backgroundColor: lightTheme.white,
              color: lightTheme.color,
            },
          },
        },
        MuiDrawer: {
          paper: {
            backgroundColor: lightTheme.paperBg,
          },
        },
        MuiBackdrop: {
          root: {
            backgroundColor: lightTheme.backdropBg,
          },
        },
        MuiLink: {
          root: {
            color: lightTheme.color,
            '&:hover': {
              color: colors.clamPink,
              textDecoration: 'none',
              '&.active': {
                color: colors.clamPink,
              },
            },
            '&.active': {
              color: colors.clamPink,
            },
            '@media (hover:none)': {
              '&:hover': {
                color: colors.clamPink,
                textDecoration: 'none',
                backgroundColor: '#00000000 !important',
              },
              '&:focus': {
                color: colors.clamPink,
                backgroundColor: '#00000000 !important',
              },
            },
          },
        },
        MuiTableCell: {
          root: {
            color: lightTheme.color,
          },
          head: {
            color: colors.otterDark,
          },
        },
        MuiInputBase: {
          root: {
            color: lightTheme.color,
            fontWeight: 700,
            borderRadius: '10px',
          },
        },
        MuiOutlinedInput: {
          notchedOutline: {
            borderColor: `${lightTheme.color} !important`,
            '&:hover': {
              borderColor: `${lightTheme.color} !important`,
            },
          },
        },
        MuiTab: {
          root: {
            marginRight: 60,
          },
          textColorPrimary: {
            color: colors.darkGray200,
            '&:selected': {
              color: colors.otterDark,
            },
          },
        },
        //@ts-ignore
        PrivateTabIndicator: {
          colorPrimary: {
            backgroundColor: lightTheme.color,
          },
        },
        MuiToggleButton: {
          root: {
            backgroundColor: lightTheme.paperBg,
            '&:hover': {
              color: lightTheme.color,
              backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
            },
            selected: {
              backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
            },
            '@media (hover:none)': {
              '&:hover': {
                color: lightTheme.color,
                backgroundColor: lightTheme.paperBg,
              },
              '&:focus': {
                color: lightTheme.color,
                backgroundColor: lightTheme.paperBg,
              },
            },
          },
        },
        MuiIconButton: {
          root: {
            '&:hover': {
              backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
            },
            '@media (hover:none)': {
              '&:hover': {
                color: lightTheme.color,
                backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
              },
              '&:focus': {
                color: lightTheme.color,
                backgroundColor: lightTheme.containedSecondaryButtonHoverBG,
              },
            },
          },
        },
        MuiButton: {
          containedPrimary: {
            color: '#fff',
            backgroundColor: lightTheme.primaryButtonBG,
            '&:hover': {
              backgroundColor: lightTheme.primaryButtonHoverBG,
              color: lightTheme.primaryButtonHoverColor,
            },
            '@media (hover:none)': {
              backgroundColor: lightTheme.primaryButtonBG,
              '&:hover': {
                backgroundColor: lightTheme.primaryButtonHoverBG,
              },
            },
          },
          containedSecondary: {
            color: lightTheme.color,
            backgroundColor: lightTheme.paperBg,
            '&:hover': {
              color: lightTheme.outlinedSecondaryButtonHoverColor,
              backgroundColor: `${lightTheme.containedSecondaryButtonHoverBG} !important`,
            },
            '@media (hover:none)': {
              color: lightTheme.color,
              backgroundColor: lightTheme.paperBg,
              '&:hover': {
                // color: '#FCFCFC',
                color: lightTheme.outlinedSecondaryButtonHoverColor,
                backgroundColor: `${lightTheme.containedSecondaryButtonHoverBG} !important`,
              },
            },
          },
          outlinedPrimary: {
            color: colors.otterDark,
            borderColor: colors.otterDark,
            backgroundColor: 'fff',
            '&:hover': {
              color: `${colors.darkGray300} !important`,
              borderColor: `${colors.darkGray300} !important`,
              backgroundColor: 'fff',
            },
            '@media (hover:none)': {
              color: colors.otterDark,
              borderColor: colors.otterDark,
              backgroundColor: 'fff',
              '&:hover': {
                backgroundColor: 'fff',
                color: `${colors.darkGray300} !important`,
                borderColor: `${colors.darkGray300} !important`,
              },
            },
          },
          outlinedSecondary: {
            color: lightTheme.color,
            borderColor: lightTheme.color,
            '&:hover': {
              color: lightTheme.outlinedSecondaryButtonHoverColor,
              backgroundColor: lightTheme.outlinedSecondaryButtonHoverBG,
              borderColor: '#333333',
            },
          },
          textPrimary: {
            color: '#A3A3A3',
            '&:hover': {
              color: lightTheme.textHighlightColor,
              backgroundColor: '#00000000',
            },
            '&:active': {
              color: lightTheme.gold,
              borderBottom: '#F8CC82',
            },
          },
          textSecondary: {
            color: lightTheme.color,
            '&:hover': {
              color: lightTheme.textHighlightColor,
            },
          },
        },
      },
    },
    commonSettings,
  ),
);
