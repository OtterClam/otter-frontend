type Description = {
  type: 'normal' | 'highlight';
  text: string;
};

export interface DescriptionMetadata {
  description: Description[];
  buttonText: string;
}
