import { PropsWithChildren, ReactNode } from 'react';

import './successDialog.scss';
import { Box, Typography, Divider, makeStyles } from '@material-ui/core';
import Dialog from 'src/components/Dialog/Dialog';
import CustomButton from 'src/components/Button/CustomButton';

import NFTDisplayRow from './NFTDisplayRow';

import { Bond } from 'src/constants';
import { NFTDiscountOption } from '../../types';
import DetailRow from './DetailRow';

const useStyle = makeStyles(theme => {
  return {
    helperText: {
      color: theme.palette.mode.darkGray300,
    },
  };
});

const DialogTitle = ({ action }: { action: 'redeem' | 'bond' }) => {
  return (
    <Box>
      <Typography className="success-subtitle" variant="h6" align="center">
        Otter'standing!
      </Typography>
      <Typography className="success-title" variant="h3" align="center">
        Your {action} Was Successful
      </Typography>
    </Box>
  );
};

interface Props {
  open: boolean;
  onClose(): void;
  bond: Bond;
  action: 'bond' | 'redeem';
  selections?: NFTDiscountOption[];
  logoEl: ReactNode;
  helperText?: string;
  subtitle: ReactNode;
  renderRowDescription(selection: NFTDiscountOption): JSX.Element;
}
const BaseDialog = ({
  action,
  subtitle,
  logoEl,
  helperText,
  children,
  selections,
  renderRowDescription,
  open,
  onClose,
}: PropsWithChildren<Props>) => {
  const style = useStyle();
  return (
    <Dialog id="success-dialog" title={() => <DialogTitle action={action} />} open={open} onClose={onClose}>
      <Box className="bond-logo">{logoEl}</Box>
      <Box className="success-subtitle">{subtitle}</Box>
      {selections && <NFTDisplayRow selections={selections} renderRowDescription={renderRowDescription} />}
      {helperText && (
        <Box className="helper-text">
          <Typography variant="caption" className={`${style.helperText} helper-text`}>
            {helperText}
          </Typography>
        </Box>
      )}
      <Divider className="divider" />
      <Box className="bond-detail" bgcolor="otter.white">
        {children}
      </Box>
      <CustomButton
        text="Otterstood"
        color="otter.white"
        bgcolor="otter.otterBlue"
        className="otterstood-btn"
        onClick={onClose}
      />
    </Dialog>
  );
};

BaseDialog.DetailRow = DetailRow;

export default BaseDialog;
