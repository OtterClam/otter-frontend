import { ElementType, ComponentProps, CSSProperties } from 'react';
import { Box, SvgIcon, SvgIconProps } from '@material-ui/core';

import './style.scss';

type BoxProps = ComponentProps<typeof Box>;
type ButtonType = 'outline' | 'solid' | 'icon';
type Props = BoxProps & {
  text?: string;
  type?: ButtonType;
  icon?: ElementType<any>;
  iconSvgProps?: SvgIconProps;
};

type ButtonConfig = Pick<BoxProps, 'bgcolor' | 'color' | 'border'>;
const STYLE: Record<ButtonType, ButtonConfig> = {
  outline: {
    border: '2px solid',
    bgcolor: '',
    color: 'text.primary',
  },
  solid: {
    bgcolor: 'otter.otterBlue',
    color: 'otter.white',
  },
  icon: {
    border: '2px solid',
    bgcolor: '',
    color: 'text.primary',
  },
};
const ICON_BASE_STYLE: CSSProperties = { width: '20px', height: '20px', verticalAlign: 'middle' };
const ICON_SPACING: CSSProperties = { marginRight: '10px', marginLeft: '-10px' };

const RoundedButton = ({ type = 'solid', className = '', text, icon, iconSvgProps, ...boxProps }: Props) => {
  return (
    <Box className={'custom-button ' + className} {...STYLE[type]} {...boxProps}>
      {icon && <SvgIcon component={icon} style={{ ...ICON_BASE_STYLE, ...ICON_SPACING }} {...iconSvgProps} />}
      <p>{text}</p>
    </Box>
  );
};

export default RoundedButton;
