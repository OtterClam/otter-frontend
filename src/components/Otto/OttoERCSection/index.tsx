import ImageTextSection from 'src/components/Otto/common/ImageTextSection';
import ERC71Image from 'src/assets/images/ottos/otto_ERC72.png';
const { ImageSection, TextSection } = ImageTextSection;

const OttoERCSection = () => {
  // TODO|OTTO: replace placeholder
  return (
    <ImageTextSection
      color="mode.otterDark"
      bgcolor="mode.lightGray100"
      title="OttoERC-721 Tech"
      slogan="Every single DNA and accessory on your Otto has its value"
    >
      <ImageSection imgSrc={ERC71Image} />
      <TextSection
        subtitle="placeholder placeholder"
        content="ERC-721 tokens are non-fungible, meaning that every part in your Otto has its unique value and is to be treated individually. Unlike ERC-20, every single ERC-20 token is equal in value and is identical and inter replaceable."
      />
    </ImageTextSection>
  );
};
export default OttoERCSection;
