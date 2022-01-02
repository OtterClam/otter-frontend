import { ElementType, ComponentProps, forwardRef, CSSProperties } from 'react';

import { Box, colors, SvgIcon } from '@material-ui/core';

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

type ButtonConfig = Partial<Pick<BoxProps, 'bgcolor' | 'color' | 'border'>>;
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

const CustomButton = forwardRef<any, Props>(({ type = 'solid', text, icon, ...props }, ref) => {
  if (type === 'icon') {
    return (
      <Box {...({ ref } as any)} className="icon-button" border="2px solid" {...props}>
        {icon && <SvgIcon component={icon} style={{ ...ICON_BASE_STYLE }} />}
      </Box>
    );
  }
  return (
    <Box {...({ ref } as any)} className="custom-button" border={type === 'outline' && '2px solid'} {...props}>
      {icon && <SvgIcon component={icon} style={{ ...ICON_BASE_STYLE, ...ICON_SPACING }} />}
      <p>{text}</p>
    </Box>
  );
});

export default CustomButton;
