type Description = {
  type: 'normal' | 'highlight';
  text: string;
};

export interface DescriptionMetadata {
  imgSrc: string;
  description: Description[];
  buttonText: string;
}
