import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import commonSettings from './global';

const colorPalette = {
  common: {
    clamPink: '#FF6854',
    clamPinkHover: '#F5523C',
    otterBlue: '#3B4BD8',
    otterBlueHover: '#303FC7',
    white: '#FFFFFF',
  },
  light: {
    otterDark: '#1D2654',
    white: '#FFFFFF',
    lightGray100: '#F7F9FB',
    lightGray200: '#E9F0F3',
    lightGray300: '#DBE6EC',
    lightGray400: '#CCD4E0',
    darkGray100: '#8193B5',
    darkGray200: '#5E6E99',
    darkGray300: '#434E77',
  },
  dark: {
    otterDark: '#F7F9FB',
    white: '#0A0E23',
    lightGray100: '#101631',
    lightGray200: '#212B4F',
    lightGray300: '#303E65',
    lightGray400: '#425475',
    darkGray100: '#8192B4',
    darkGray200: '#A1AEC9',
    darkGray300: '#CCD6E7',
  },
};

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    otter: typeof colorPalette['common'];
    mode: typeof colorPalette['light'];
  }
  interface PaletteOptions {
    otter: typeof colorPalette['common'];
    mode: typeof colorPalette['light'];
  }
}

export const light = responsiveFontSizes(
  createTheme(
    {
      palette: {
        type: 'light',
        otter: colorPalette.common,
        mode: colorPalette.light,
        primary: {
          main: colorPalette.light.otterDark,
        },
        secondary: {
          main: colorPalette.light.darkGray200,
        },
        background: {
          default: colorPalette.light.lightGray100,
          paper: colorPalette.light.white,
        },
        text: {
          primary: colorPalette.light.otterDark,
          secondary: colorPalette.common.clamPink,
          hint: colorPalette.common.white,
          disabled: colorPalette.light.darkGray200,
        },
      },
    },
    commonSettings,
  ),
);

export const dark = responsiveFontSizes(
  createTheme(
    {
      palette: {
        type: 'dark',
        otter: colorPalette.common,
        mode: colorPalette.dark,
        primary: {
          main: colorPalette.dark.otterDark,
        },
        secondary: {
          main: colorPalette.dark.darkGray200,
        },
        background: {
          default: colorPalette.dark.lightGray100,
          paper: colorPalette.dark.white,
        },
        text: {
          primary: colorPalette.dark.otterDark,
          secondary: colorPalette.common.clamPink,
          hint: colorPalette.common.white,
          disabled: colorPalette.dark.darkGray200,
        },
      },
    },
    commonSettings,
  ),
);
