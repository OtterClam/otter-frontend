const breakpointValues = {
  xs: 0,
  sm: 596,
  md: 800,
  lg: 1000,
  xl: 1333,
};

const commonSettings = {
  direction: 'ltr',
  typography: {
    fontSize: 16,
    fontFamily: 'Gilroy',
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '1.3px',
      fontFamily: 'Gilroy',
    },
    h3: {
      fontSize: '1.75rem',
      fontFamily: 'Gilroy',
    },
    h4: {
      fontSize: '1.5rem',
      fontFamily: 'Gilroy',
    },
    h5: {
      fontSize: '1.25rem',
      letterSpacing: '0.4px',
      fontFamily: 'Gilroy',
    },
    h6: {
      fontSize: '1rem',
      fontFamily: 'Gilroy',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: 1,
      fontFamily: 'Gilroy',
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1,
      fontFamily: 'Gilroy',
    },
    button: {
      textTransform: 'none',
      fontSize: '1.25rem',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        breakpoints: { values: breakpointValues },
        body: {
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiToolbar: {
      root: {
        justifyContent: 'flex-end',
      },
    },
    MuiPaper: {
      root: {
        backdropFilter: 'blur(33px)',
        '&.ohm-card': {
          padding: '20px 20px 20px 20px',
          borderRadius: '10px',
          maxWidth: '833px',
          width: '97%',
          marginBottom: '1.8rem',
        },
        '&.ohm-menu': {
          padding: '22px 0px',
          borderRadius: '10px',
          margin: '0px',
        },
      },
    },
    MuiContainer: {
      root: {
        backgroundColor: 'transparent',
        flexGrow: 1,
      },
    },
    MuiLink: {
      root: {
        textUnderlineOffset: '.23rem',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'none',
          underline: 'none',
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: 0,
        fontFamily: 'Gilroy',
      },
    },
    MuiDrawer: {
      root: {
        width: '280px',
        flexShrink: 0,
      },
      paper: {
        width: 'inherit',
        // backdropFilter: 'blur(33px)',
        backgroundColor: 'inherit',
        padding: 0,
        zIndex: 7,
      },
    },
    MuiBackdrop: {
      root: {
        backdropFilter: 'blur(15px)',
        zIndex: 3,
      },
    },
    MuiToggleButton: {
      root: {
        border: 0,
        borderRadius: '5px',
        margin: '8px',
        padding: '10px',
      },
    },
    MuiButton: {
      root: {
        fontFamily: 'Gilroy',
        borderRadius: '29px',
        textTransform: 'none',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        minWidth: 'max-content',
        maxHeight: '57px',
        height: '44px',
      },
      containedSizeLarge: {
        fontSize: '18px',
      },
      containedPrimary: {
        border: 0,
        fontWeight: 'bold',
      },
      containedSecondary: {
        fontWeight: '400',
        height: '44px',
      },
      outlinedPrimary: {
        height: '44px',
        borderRadius: '22px',
        border: '2px solid',
        padding: '9px 20px',
        fontWeight: 'bold',
        '&:hover': {
          border: '2px solid',
        },
      },
      outlinedSecondary: {
        textTransform: 'none',
        textDecoration: 'none',
        height: '33px',
        fontSize: '1.1em',
        padding: '9px 20px',
      },
      text: {
        '&:hover': {
          backgroundColor: '#00000000',
        },
      },
      textSecondary: {
        textTransform: 'none',
        textDecoration: 'none',
        padding: '2px 2px',
        '&:hover': {
          backgroundColor: '#00000000',
        },
      },
    },
    MuiIconButton: {
      root: {
        '&:hover': {
          backgroundColor: '#00000000',
        },
      },
    },
    MuiInputBase: {
      root: {
        height: '57px',
        padding: '5px',
        fontFamily: 'Gilroy',
        fontWeight: 700,
        borderRadius: '10px',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '10px',
      },
    },
    MuiInputLabel: {
      outlined: {
        transform: 'translate(16px, 14px) scale(1)',
      },
    },
    MuiTabs: {
      root: {
        minHeight: '40px',
        height: '40px',
      },
    },
    MuiTab: {
      root: {
        minWidth: 'min-content !important',
        width: 'min-content',
        padding: '0px',
        margin: '0px 10px',
        fontWeight: 400,
        fontSize: '24px',
        fontStyle: 'normal',
        fontFamily: 'Gilroy',
        lineHeight: '24px',
      },
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiButton: {
      disableElevation: true,
      disableFocusRipple: true,
      disableRipple: true,
    },
    MuiTextButton: {
      disableFocusRipple: true,
      disableRipple: true,
    },
    MuiPaper: {
      elevation: 0,
    },
    MuiTypograph: {
      gutterBottom: true,
      fontFamily: 'Gilroy',
    },
    MuiLink: {
      underline: 'none',
    },
    MuiSvgIcon: {
      viewBox: '0 0 24 24',
      fontSize: 'small',
    },
    MuiBackdrop: {
      transitionDuration: 300,
    },
    MuiPopover: {
      transitionDuration: 300,
    },
  },
};

export default commonSettings;
