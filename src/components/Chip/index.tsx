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
  const color = theme.palette.mode.chip.status[status];
  const backgroundColor = theme.palette.mode.chip.status.bg;
  className = classNames(className, 'chip--status');
  const icon = dot ? <span className="chip__dot" style={{ background: color }} /> : undefined;
  return <Chip icon={icon} className={className} {...restProps} style={{ backgroundColor, color }} />;
}

export type LabelChipProps = ChipProps;

export function LabelChip({ className, ...restProps }: ChipProps) {
  const theme = useTheme();
  const color = theme.palette.mode.chip.normal.fg;
  const backgroundColor = theme.palette.mode.chip.normal.bg;
  className = classNames('chip--label', className);
  return <Chip className={className} style={{ color, backgroundColor }} {...restProps} />;
}
