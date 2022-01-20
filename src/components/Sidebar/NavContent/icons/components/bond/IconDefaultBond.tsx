import { WithThemeColor } from '../types';

interface Props extends WithThemeColor {}
const IconDefaultBond = ({ color }: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.0927 14.4901C16.3264 14.357 15.6015 14.0475 14.9753 13.5862C14.3491 13.1248 13.8387 12.5242 13.4844 11.8317C13.1302 11.1392 12.9418 10.3739 12.9341 9.59611C12.9265 8.81833 13.0997 8.04942 13.4402 7.3501H2.68523C2.2363 7.35207 1.80632 7.53128 1.48887 7.84873C1.17142 8.16618 0.992208 8.59616 0.990234 9.0451V17.8051C0.992208 18.254 1.17142 18.684 1.48887 19.0015C1.80632 19.3189 2.2363 19.4981 2.68523 19.5001H18.5477C18.998 19.5001 19.4299 19.3218 19.7489 19.0041C20.068 18.6864 20.2483 18.2553 20.2502 17.8051V14.0551C19.2728 14.5389 18.1646 14.6916 17.0927 14.4901V14.4901Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.27273 13.0127V17.5577L6.22523 16.3202L4.17773 17.5577V13.0127"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.22488 14.1002C7.55451 14.1002 8.63238 13.0223 8.63238 11.6927C8.63238 10.363 7.55451 9.28516 6.22488 9.28516C4.89526 9.28516 3.81738 10.363 3.81738 11.6927C3.81738 13.0223 4.89526 14.1002 6.22488 14.1002Z"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.9702 14.5723C20.7537 14.5723 23.0102 12.3192 23.0102 9.53982C23.0102 6.76045 20.7537 4.50732 17.9702 4.50732C15.1867 4.50732 12.9302 6.76045 12.9302 9.53982C12.9302 12.3192 15.1867 14.5723 17.9702 14.5723Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M10.9277 14.7227H13.4252" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.9277 16.875H14.9402" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M19.5 8.33992C19.3902 8.14746 19.2402 7.98088 19.0604 7.85147C18.8805 7.72207 18.6749 7.63287 18.4575 7.58992C17.865 7.40992 17.0325 7.58992 16.9575 8.33992C16.8825 9.08992 17.5575 9.33742 18.075 9.55492C18.4725 9.71992 18.9525 9.97492 19.065 10.4249C19.0938 10.6655 19.0334 10.9084 18.8952 11.1074C18.7569 11.3065 18.5505 11.4479 18.315 11.5049C17.8989 11.5937 17.465 11.5371 17.0856 11.3447C16.7062 11.1523 16.4042 10.8356 16.23 10.4474"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M18.5848 6.47266L18.3823 7.56016" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
      <path d="M17.6473 11.5127L17.4448 12.6002" stroke={color} stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

export default IconDefaultBond;
