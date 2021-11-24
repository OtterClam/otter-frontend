import classNames from 'classnames';
import { Chip as MuiChip, ChipProps, useTheme } from '@material-ui/core';
import './chip.scss';

export type { ChipProps } from '@material-ui/core';

export default function Chip({ className, ...restProps }: ChipProps) {
  className = classNames('chip', className);
  return <MuiChip className={className} {...restProps} />;
}

export enum Status {
  Success = 'success',
}

export interface StatusChipProps extends Omit<ChipProps, 'icon'> {
  status?: Status;
}

export function StatusChip({ status = Status.Success, ...restProps }: StatusChipProps) {
  const theme = useTheme();
  const color = {
    [Status.Success]: '',
  }[status];
  const icon = <span />;
  console.log(theme);
  return <Chip icon={icon} {...restProps} />;
}

export type LabelChipProps = ChipProps;

export function LabelChip({ className, ...restProps }: ChipProps) {
  className = classNames('chip--label', className);
  return <Chip className={className} {...restProps} />;
}
