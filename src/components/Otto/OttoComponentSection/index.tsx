import { useTranslation } from 'react-i18next';
import ImageTextSection from 'src/components/Otto/common/ImageTextSection';
import ERC71Image from 'src/assets/images/ottos/otto_ERC72.png';
const { ImageSection, TextSection } = ImageTextSection;

const OttoComponentSection = () => {
  const { t } = useTranslation();
  return (
    <ImageTextSection
      color="mode.otterDark"
      bgcolor="mode.lightGray200"
      title={t('otto.component.title')}
      slogan={t('otto.component.slogan')}
    >
      <ImageSection imgSrc={ERC71Image} />
      <TextSection subtitle={t('otto.component.subtitle')} content={t('otto.component.content')} />
    </ImageTextSection>
  );
};
export default OttoComponentSection;
