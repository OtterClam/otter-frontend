import { Box, BoxProps } from '@material-ui/core';

type BoxStyle = BoxProps['sx'];

const baseStyles: BoxStyle = {
  display: 'inline-block',
  color: 'otter.white',
  bgcolor: 'text.secondary',
  fontSize: 12,
  fontWeight: 400,
  padding: '2px 5px',
  borderRadius: '4px',
};

const NewChip = (props: BoxProps) => {
  return (
    <Box {...baseStyles} {...props}>
      NEW!
    </Box>
  );
};
export default NewChip;
