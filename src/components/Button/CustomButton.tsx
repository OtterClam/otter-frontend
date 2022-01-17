import { ElementType, ComponentProps, forwardRef, CSSProperties } from 'react';

import { Box, SvgIcon } from '@material-ui/core';

import './button.scss';

type BoxProps = ComponentProps<typeof Box>;
type ButtonType = 'outline' | 'solid' | 'icon';
type Props = BoxProps & {
  text?: string;
  type?: ButtonType;
  mainColor?: string;
  secondaryColor?: string;
  icon?: ElementType<any>;
  href?: string;
  target?: string;
};

const ICON_BASE_STYLE: CSSProperties = { width: '20px', height: '20px', verticalAlign: 'middle' };
const ICON_SPACING: CSSProperties = { marginRight: '10px', marginLeft: '-10px' };

const CustomButton = forwardRef<any, Props>(({ type = 'solid', text, icon, className, ...props }, ref) => {
  if (type === 'icon') {
    return (
      <Box {...({ ref } as any)} className={`icon-button ${className}`} border="2px solid" {...props}>
        {icon && <SvgIcon component={icon} style={{ ...ICON_BASE_STYLE }} />}
      </Box>
    );
  }
  return (
    <Box
      {...({ ref } as any)}
      className={`custom-button ${className}`}
      border={type === 'outline' && '2px solid'}
      {...props}
    >
      {icon && <SvgIcon component={icon} style={{ ...ICON_BASE_STYLE, ...ICON_SPACING }} />}
      <p>{text}</p>
    </Box>
  );
});

export default CustomButton;
