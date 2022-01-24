import { useTranslation } from 'react-i18next';
import ImageTextSection from 'src/components/Otto/common/ImageTextSection';
import OttoFactoryImage from 'src/assets/images/ottos/otto_factory.png';

const { ImageSection, TextSection } = ImageTextSection;

const OttoFactorySection = () => {
  const { t } = useTranslation();
  return (
    <ImageTextSection
      color="mode.otterDark"
      bgcolor="mode.white"
      title={t('otto.factory.title')}
      slogan={t('otto.factory.slogan')}
    >
      <ImageSection imgSrc={OttoFactoryImage} />
      <TextSection subtitle={t('otto.factory.subtitle')} content={t('otto.factory.content')} />
    </ImageTextSection>
  );
};
export default OttoFactorySection;
