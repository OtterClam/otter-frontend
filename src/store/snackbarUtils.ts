import { useSnackbar, VariantType, WithSnackbarProps } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';

//github.com/iamhosseindhv/notistack/issues/30#issuecomment-542863653
let useSnackbarRef: WithSnackbarProps;
export const SnackbarUtilsConfigurator: React.FC = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

//Enable translation so snackbars can be queued within Hooks / Slices
const { t } = useTranslation();
export default {
  success(msg: string, translate: boolean = true) {
    if (translate) {
      this.toast(t(msg), 'success');
    } else {
      this.toast(msg, 'success');
    }
  },
  warning(msg: string, translate: boolean = true) {
    if (translate) {
      this.toast(t(msg), 'warning');
    } else {
      this.toast(msg, 'warning');
    }
  },
  info(msg: string, translate: boolean = true) {
    if (translate) {
      this.toast(t(msg), 'info');
    } else {
      this.toast(msg, 'info');
    }
  },
  error(msg: string, translate: boolean = true) {
    if (translate) {
      this.toast(t(msg), 'error');
    } else {
      this.toast(msg, 'error');
    }
  },
  toast(msg: string, variant: VariantType = 'default') {
    useSnackbarRef.enqueueSnackbar(msg, { variant });
  },
};
