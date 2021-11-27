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
  dot?: boolean;
}

export function StatusChip({ className, status = Status.Success, dot = true, ...restProps }: StatusChipProps) {
  const theme = useTheme();
  const color = {
    [Status.Success]: theme.palette.otter.otterGreen,
  }[status];
  className = classNames(className, 'chip--status');
  const icon = dot ? <span className="chip__dot" style={{ background: color }} /> : undefined;
  return <Chip icon={icon} className={className} {...restProps} style={{ color }} />;
}

export type LabelChipProps = ChipProps;

export function LabelChip({ className, ...restProps }: ChipProps) {
  className = classNames('chip--label', className);
  return <Chip className={className} {...restProps} />;
}
