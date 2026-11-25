import React from 'react';

interface SherlockLogoIconProps {
  size?: number;
  className?: string;
}

export const SherlockLogoIcon: React.FC<SherlockLogoIconProps> = ({
  size = 32,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="5"
        width="46"
        height="46"
        rx="9"
        fill="#FFFFFF"
        stroke="#1C1B18"
        strokeWidth="3"
      />
      <path d="M8 14a6 6 0 0 1 6-6h14v20H8V14Z" fill="#1F6E4A" />
      <path
        d="M13 18.5l3.5 3.5 7-7.5"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M28 8h14a6 6 0 0 1 6 6v14H28V8Z" fill="#F7F5F0" />
      <circle
        cx="38"
        cy="18"
        r="6"
        fill="none"
        stroke="#C84B31"
        strokeWidth="2.8"
      />
      <line
        x1="33.8"
        y1="22.2"
        x2="42.2"
        y2="13.8"
        stroke="#C84B31"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path d="M8 28h20v20H14a6 6 0 0 1-6-6V28Z" fill="#EFECE4" />
      <rect
        x="13.5"
        y="33.5"
        width="9"
        height="9"
        rx="2"
        fill="#EAB308"
        stroke="#1C1B18"
        strokeWidth="2"
      />
      <line x1="28" y1="6.5" x2="28" y2="49.5" stroke="#1C1B18" strokeWidth="2.6" />
      <line x1="6.5" y1="28" x2="49.5" y2="28" stroke="#1C1B18" strokeWidth="2.6" />
      <line
        x1="47.5"
        y1="47.5"
        x2="58.5"
        y2="58.5"
        stroke="#1C1B18"
        strokeWidth="7.5"
        strokeLinecap="round"
      />
      <line
        x1="47.5"
        y1="47.5"
        x2="58.5"
        y2="58.5"
        stroke="#7C5E3C"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <circle
        cx="39"
        cy="39"
        r="12.5"
        fill="#E0F2FE"
        stroke="#1C1B18"
        strokeWidth="3.2"
      />
      <path
        d="M33 35.5a7 7 0 0 1 7-4.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
