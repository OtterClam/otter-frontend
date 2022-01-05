import { useState, PropsWithChildren } from 'react';
import { Backdrop, BackdropProps, Paper, makeStyles } from '@material-ui/core';

import './dialog.scss';
import DialogHeader from './DialogHeader';

const useStyle = makeStyles(theme => {
  return {
    modal: {
      backgroundColor: theme.palette.mode.lightGray100,
    },
  };
});

interface Props extends Omit<BackdropProps, 'children'> {
  open: boolean;
  title: string;
  onClose(): void;
}
const Dialog = ({ children, title, onClose, ...props }: PropsWithChildren<Props>) => {
  const style = useStyle();
  return (
    <Backdrop {...props}>
      <Paper className={`${style.modal} dialog`}>
        <DialogHeader title={title} onClose={onClose} />
        {children}
      </Paper>
    </Backdrop>
  );
};
export default Dialog;
