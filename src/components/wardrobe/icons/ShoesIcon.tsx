import { FC } from 'react';
import { iIcon } from './Icon.interface';

const ShoesIcon: FC<iIcon> = ({ className, onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      onClick={onClick}
    >
      <path d="M51.01,339.29v20.27l15.12,5.54c16.69,6.12,35.03,5.94,51.6-.5h0s68.46-36.57,68.46-36.57c4.11-2.2,6.68-6.48,6.68-11.15v-8.94c0-1.9,.98-3.67,2.6-4.68h0c6.04-3.75,8.63-11.21,6.22-17.9l-3.19-8.82-13.4-4.73c-.99-.35-1.29-1.6-.56-2.36l8.63-9.05c.9-.94,2-1.66,3.22-2.11l4.39-1.61c1.97-.72,4.17-.42,5.88,.81l2.06,1.48,21.54,13,6.76-1.32,23.73-19.46,37.34-42.35v-10.37c0-1.8,1.73-2.4,3.49-2.06,20.62,4.07,78.11,37.96,186.67,65.91v71.01l-81.76,35.46c-8.63,3.74-15.69,10.37-19.98,18.74l-13.57,26.48c-1.24,2.42-4.27,3.29-6.61,1.89h0c-11.12-6.67-24.26-9.14-37.03-6.94l-109.93,18.91s-68.28,18.57-110.74,4.18c-42.46-14.39-45.22-2.92-62.68-22.59,0,0-20.85-16.31-13.31-38.55l5.08-12.51c2.96-7.29,7.5-13.82,13.31-19.13h0Z" />
      <path d="M258.94,86.83l-4.77,62.51c-.38,5,2.3,9.72,6.8,11.94,33.78,16.6,196.07,85.88,243.27,86.95,4.28,.1,7.76-3.47,7.76-7.76v-61.17c0-4.01-3.04-7.36-7.04-7.72-16.7-1.5-58.75-13.84-77.95-22.13-20.1-8.68-128.23-55.42-159.19-68.12-4.06-1.67-8.55,1.12-8.88,5.5Z" />
      <path d="M281.11,71.32s141.45,67.31,192.26,77.46V76.3s-38.25-19.98-59.42-16.93c-21.17,3.05-50.09,25.41-55.03,24.49-4.95-.92,4.17-24.28-5.64-42.34-9.81-18.05-19.65-32.05-34.5-31.23-14.86,.83-33.28,3.45-37.66,19.62v41.4Z" />
      <polygon points="488.24 32.92 488.24 153.45 500.28 155.86 500.28 32.92 488.24 32.92" />
      <path d="M9.03,377.56s8.6,36.5,35.5,56.89c13.19,10,83.6,24.72,107.24,21.46,23.65-3.26,73.77-11.78,107.84-18.37,34.07-6.59,66.51-18.03,75.28-15.56,8.78,2.46,24.27,9.29,38.46,7.34l14.19-3.31,10.88-16.15,36.54-17.37s20.26-1.25,35.79-.5c15.52,.75,29.52,.14,29.52,.14l6.24,4.09v72.24s-1.81,21.6-45.03,22.74c-43.22,1.14-106.01,2.18-106.01,2.18,0,0-20.78-30.48-32.28-25.14-11.5,5.34-53.43,19.99-53.43,19.99l-53.4,12.57s-133.71,6.1-164-12.28c-30.29-18.38-46.38-43.77-46.38-43.77l-5.99-15.22,9.03-51.94Z" />
      <path d="M259.72,176.77l-7.21-2.23c-.22-.08-.44-.16-.66-.21-5.99-1.27-13.61,10.75-17.02,26.85s-1.33,30.17,4.66,31.44l7.21,2.23c.22,.08,.44,.16,.66,.21,5.99,1.27,13.61-10.75,17.02-26.85s1.33-30.17-4.66-31.44Z" />
    </svg>
  );
};

export default ShoesIcon;