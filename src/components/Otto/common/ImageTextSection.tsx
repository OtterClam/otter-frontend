import { ReactNode, PropsWithChildren } from 'react';
import { Box } from '@material-ui/core';
import './style.scss';

interface ImageProps {
  imgSrc: string;
}
const ImageSection = ({ imgSrc }: ImageProps) => {
  return <img className="image-text__image" src={imgSrc} />;
};

interface TextProps {
  subtitle: ReactNode;
  content: ReactNode;
}
const TextSection = ({ subtitle, content }: TextProps) => {
  return (
    <div className="image-text__content">
      <h5 className="image-text__content__h5">{subtitle}</h5>
      <p className="image-text__content__body1">{content}</p>
    </div>
  );
};

interface Props {
  color: string;
  bgcolor: string;
  title: ReactNode;
  slogan: ReactNode;
}

const ImageTextSection = ({ color, bgcolor, title, slogan, children }: PropsWithChildren<Props>) => {
  return (
    <Box className={`image-text__container container`} color={color} bgcolor={bgcolor}>
      <h4 className="image-text__content__h4">{title}</h4>
      <p className="image-text__content__slogan">{slogan}</p>
      <div className="image-text__section">{children}</div>
    </Box>
  );
};

ImageTextSection.ImageSection = ImageSection;
ImageTextSection.TextSection = TextSection;

export default ImageTextSection;
