import { DescriptionMetadata } from './type';

export const OTTO_STEP_METADATA: DescriptionMetadata[] = [
  {
    imgSrc: '',
    description: [
      { type: 'normal', text: 'Make sure you’ve been added in ' },
      { type: 'highlight', text: 'whitelist' },
      { type: 'normal', text: ' Check if you’re in whitelist on Discord.' },
    ],
    buttonText: 'Open Discord',
  },
  {
    imgSrc: '',
    description: [
      { type: 'normal', text: 'Purchase enough ' },
      { type: 'highlight', text: 'CLAM' },
      { type: 'normal', text: ' Ottos can ONLY be minted by CLAM.' },
    ],
    buttonText: 'Buy CLAM',
  },
  {
    imgSrc: '',
    description: [
      { type: 'normal', text: 'Mint Ottos with CLAM on ' },
      { type: 'highlight', text: 'Jan 29' },
      { type: 'normal', text: ' Only 3000 profile image available, so be fast!' },
    ],
    buttonText: 'Add to Calendar',
  },
];
