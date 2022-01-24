type Description = {
  type: 'normal' | 'highlight';
  text: string;
};

type Button = {
  text: string;
  href: string;
};
export interface DescriptionMetadata {
  description: Description[];
  button: Button;
}
