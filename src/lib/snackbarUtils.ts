import { useSnackbar, VariantType, WithSnackbarProps } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import i18next from '../i18n';

//github.com/iamhosseindhv/notistack/issues/30#issuecomment-542863653
let useSnackbarRef: WithSnackbarProps;
export const SnackbarUtilsConfigurator: React.FC = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

//Enable translation so snackbars can be queued within Hooks / Slices
export default {
  success(msg: string, translate: boolean = false) {
    this.toast(translate ? i18next.t(msg) : msg, 'success');
  },
  warning(msg: string, translate: boolean = false) {
    this.toast(translate ? i18next.t(msg) : msg, 'warning');
  },
  info(msg: string, translate: boolean = false) {
    this.toast(translate ? i18next.t(msg) : msg, 'info');
  },
  error(msg: string, translate: boolean = false) {
    this.toast(translate ? i18next.t(msg) : msg, 'error');
  },
  toast(msg: string, variant: VariantType = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant });
  },
};
