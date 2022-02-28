import { SVGProps, useContext } from 'react';
import { AppThemeContext } from 'src/helpers/app-theme-context';

function SettingsIcon(props: SVGProps<SVGSVGElement> & { color?: string }) {
  const currentTheme = useContext(AppThemeContext);
  const color = currentTheme.theme.palette.primary.main;

  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.5 13.2919V10.6669L19.3758 10.1559C19.1916 9.41787 18.9007 8.72225 18.5179 8.08481L20.3383 5.48869L18.482 3.63456L15.9204 5.47512C15.2812 5.08881 14.5804 4.79306 13.8353 4.60844L13.2919 1.5H10.6669L10.1612 4.59837C9.41612 4.78125 8.71175 5.07175 8.07125 5.45806L5.51625 3.63106L3.66038 5.48694L5.45631 8.05725C5.06825 8.69994 4.7725 9.40387 4.58481 10.1542L1.5 10.6669V13.2919L4.58131 13.8388C4.76769 14.5874 5.06344 15.29 5.45281 15.934L3.63106 18.482L5.48694 20.3396L8.06075 18.5367C8.70344 18.923 9.40387 19.2153 10.1507 19.3999L10.6669 22.5018H13.2919L13.8441 19.3929C14.5839 19.2052 15.2865 18.9094 15.9222 18.5214L18.5131 20.3396L20.3689 18.482L18.5196 15.9134C18.9024 15.2777 19.1929 14.5804 19.3758 13.8406L22.5 13.2919ZM12 15.5C10.0671 15.5 8.5 13.9329 8.5 12C8.5 10.0671 10.0671 8.5 12 8.5C13.9329 8.5 15.5 10.0671 15.5 12C15.5 13.9329 13.9329 15.5 12 15.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SettingsIcon;
