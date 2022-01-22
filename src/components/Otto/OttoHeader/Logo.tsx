import { Typography, TypographyTypeMap } from '@material-ui/core';
import LogoImage from 'src/assets/images/logo.png';

interface Props {
  highlightColor: TypographyTypeMap['props']['color'];
}
const Logo = ({ highlightColor }: Props) => {
  return (
    <>
      <img className="otto-header__logo__image" src={LogoImage} />
      <Typography variant="h1" color="primary" className="otto-header__logo__text">
        Otter
        <Typography variant="inherit" color={highlightColor}>
          C
        </Typography>
        lam
      </Typography>
    </>
  );
};
export default Logo;
