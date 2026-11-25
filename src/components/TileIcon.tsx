import React from 'react';
import { getTileName } from '../data/themes';

interface TileIconProps {
  row: number;
  item: number;
  size?: number;
  className?: string;
}

export const TileIcon: React.FC<TileIconProps> = ({
  row,
  item,
  size,
  className = '',
}) => {
  const title = getTileName({ row, item });

  return (
    <svg
      {...(size !== undefined ? { width: size, height: size } : {})}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {row === 0 && renderPerson(item)}
      {row === 1 && renderHouse(item)}
      {row === 2 && renderNumber(item)}
      {row === 3 && renderSign(item)}
      {row === 4 && renderPet(item)}
      {row === 5 && renderFlag(item)}
    </svg>
  );
};

function renderPerson(item: number) {
  const skin = ['#F7D1B1', '#F4C7A1', '#EAC096', '#D9A077', '#F5D0B5'][item % 5];
  const stroke = '#1C1B18';

  switch (item) {
    case 0: // Young Girl (pigtails + coral ribbon)
      return (
        <g>
          <circle cx="13" cy="30" r="7" fill="#D97736" stroke={stroke} strokeWidth="2.4" />
          <circle cx="51" cy="30" r="7" fill="#D97736" stroke={stroke} strokeWidth="2.4" />
          <circle cx="17" cy="24" r="3" fill="#E14D43" />
          <circle cx="47" cy="24" r="3" fill="#E14D43" />
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#E14D43" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="30" r="14" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M18 28c2-11 26-11 28 0-4-4-9-5-14-5s-10 1-14 5z" fill="#D97736" stroke={stroke} strokeWidth="2.2" />
          <circle cx="27" cy="31" r="2" fill={stroke} />
          <circle cx="37" cy="31" r="2" fill={stroke} />
          <path d="M28 37c2 2.5 6 2.5 8 0" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case 1: // White-Haired Woman (bun + glasses)
      return (
        <g>
          <circle cx="32" cy="12" r="7" fill="#ECEAE4" stroke={stroke} strokeWidth="2.4" />
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#1F6E6C" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="31" r="14" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M18 29c1-12 27-12 28 0-3-3-8-4-14-4s-11 1-14 4z" fill="#ECEAE4" stroke={stroke} strokeWidth="2.2" />
          <circle cx="26.5" cy="32" r="4" fill="#FFFFFF" fillOpacity="0.4" stroke={stroke} strokeWidth="2" />
          <circle cx="37.5" cy="32" r="4" fill="#FFFFFF" fillOpacity="0.4" stroke={stroke} strokeWidth="2" />
          <path d="M30.5 32h3" stroke={stroke} strokeWidth="2" />
          <circle cx="26.5" cy="32" r="1.4" fill={stroke} />
          <circle cx="37.5" cy="32" r="1.4" fill={stroke} />
          <path d="M29 39c2 1.8 4 1.8 6 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 2: // Detective (deerstalker/fedora)
      return (
        <g>
          <path d="M17 56c0-8 7-13 15-13s15 5 15 13" fill="#7C5E3C" stroke={stroke} strokeWidth="2.4" />
          <path d="M26 44l6 8 6-8" fill="#EFECE4" stroke={stroke} strokeWidth="2" />
          <circle cx="32" cy="32" r="13.5" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M14 23h36" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <path d="M20 23l3-11h18l3 11H20z" fill="#6B4F32" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M21 19h22" stroke="#D9A048" strokeWidth="2.5" />
          <circle cx="27" cy="32" r="2" fill={stroke} />
          <circle cx="37" cy="32" r="2" fill={stroke} />
          <path d="M28 38h8" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case 3: // Chef (toque + red scarf)
      return (
        <g>
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#FFFFFF" stroke={stroke} strokeWidth="2.4" />
          <path d="M26 44l6 6 6-6" fill="#C84B31" stroke={stroke} strokeWidth="2" />
          <circle cx="32" cy="33" r="13" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M21 22c-4 0-5-7 0-9 1-4 7-6 11-4 4-2 10 0 11 4 5 2 4 9 0 9H21z" fill="#FFFFFF" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="21" y="20" width="22" height="5" fill="#FFFFFF" stroke={stroke} strokeWidth="2.2" />
          <circle cx="27" cy="32" r="1.8" fill={stroke} />
          <circle cx="37" cy="32" r="1.8" fill={stroke} />
          <path d="M26 38c2-1.5 4-1 6 0 2-1 4-1.5 6 0" stroke="#4A3525" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case 4: // Artist (purple beret + goatee)
      return (
        <g>
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#334155" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="32" r="13.5" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M16 22c2-9 20-13 31-7 4 2 3 8-2 9H18c-2 0-3-1-2-2z" fill="#7C3AED" stroke={stroke} strokeWidth="2.4" />
          <path d="M32 9l2-3" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="27" cy="31" r="1.9" fill={stroke} />
          <circle cx="37" cy="31" r="1.9" fill={stroke} />
          <path d="M29 38c2 1.5 4 1.5 6 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M29 42l3 3 3-3" fill="#4A3525" />
        </g>
      );
    case 5: // Cyclist (bright helmet + visor)
      return (
        <g>
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#2563EB" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="33" r="13" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M17 26c1-11 10-16 15-16 8 0 14 5 15 16H17z" fill="#EAB308" stroke={stroke} strokeWidth="2.4" />
          <path d="M26 15h12" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          <rect x="22" y="28" width="20" height="6" rx="3" fill="#1E293B" stroke={stroke} strokeWidth="1.8" />
          <path d="M28 39c2 1.8 6 1.8 8 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 6: // Gentleman (bowler hat + white beard)
      return (
        <g>
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#2D3748" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="32" r="13" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M19 34c1 9 6 13 13 13s12-4 13-13c-4 3-8 4-13 4s-9-1-13-4z" fill="#E5E2DC" stroke={stroke} strokeWidth="2.2" />
          <path d="M15 22h34" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <path d="M20 22c0-8 5-12 12-12s12 4 12 12H20z" fill="#2D3748" stroke={stroke} strokeWidth="2.4" />
          <circle cx="27" cy="30" r="1.9" fill={stroke} />
          <circle cx="37" cy="30" r="1.9" fill={stroke} />
        </g>
      );
    case 7: // Schoolboy (green cap)
      return (
        <g>
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#D97706" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="32" r="13.5" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M18 24c1-9 7-13 14-13s13 4 14 13H18z" fill="#1F6E4A" stroke={stroke} strokeWidth="2.4" />
          <path d="M18 24h32" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          <circle cx="27" cy="32" r="2" fill={stroke} />
          <circle cx="37" cy="32" r="2" fill={stroke} />
          <path d="M27 38c3 2.5 7 2.5 10 0" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    default: // Scientist (spiky hair + goggles)
      return (
        <g>
          <path d="M18 56c0-8 6-13 14-13s14 5 14 13" fill="#F8FAFC" stroke={stroke} strokeWidth="2.4" />
          <path d="M29 44v12M35 44v12" stroke="#0D9488" strokeWidth="2.4" />
          <circle cx="32" cy="33" r="13" fill={skin} stroke={stroke} strokeWidth="2.4" />
          <path d="M19 24l4-10 6 4 3-7 4 7 6-4 3 10H19z" fill="#475569" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="26" cy="21" r="4.5" fill="#99F6E4" stroke={stroke} strokeWidth="2" />
          <circle cx="38" cy="21" r="4.5" fill="#99F6E4" stroke={stroke} strokeWidth="2" />
          <circle cx="27" cy="34" r="1.8" fill={stroke} />
          <circle cx="37" cy="34" r="1.8" fill={stroke} />
          <path d="M28 40c2 1.5 6 1.5 8 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
  }
}

function renderHouse(item: number) {
  const palettes = [
    { wall: '#2F855A', roof: '#1C4532', door: '#F6E05E' }, // 0 Green
    { wall: '#C84B31', roof: '#7F1D1D', door: '#FEF3C7' }, // 1 Red
    { wall: '#EA580C', roof: '#9A3412', door: '#FEF9C3' }, // 2 Orange
    { wall: '#2563EB', roof: '#1E3A8A', door: '#FDE68A' }, // 3 Blue
    { wall: '#EAB308', roof: '#854D0E', door: '#FFFFFF' }, // 4 Yellow
    { wall: '#7C3AED', roof: '#4C1D95', door: '#FDE68A' }, // 5 Purple
    { wall: '#0D9488', roof: '#134E4A', door: '#FDBA74' }, // 6 Teal
    { wall: '#F5EFE0', roof: '#B45309', door: '#92400E' }, // 7 Cream Villa
    { wall: '#64748B', roof: '#1E293B', door: '#E2E8F0' }, // 8 Slate Manor
  ];
  const p = palettes[item % palettes.length];
  const stroke = '#1C1B18';

  return (
    <g>
      <rect x="42" y="13" width="6" height="12" fill={p.roof} stroke={stroke} strokeWidth="2" />
      <rect x="14" y="30" width="36" height="25" rx="2" fill={p.wall} stroke={stroke} strokeWidth="2.4" />
      <polygon points="8,32 32,12 56,32" fill={p.roof} stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="27" y="40" width="10" height="15" rx="1.5" fill={p.door} stroke={stroke} strokeWidth="2" />
      <rect x="18" y="36" width="6" height="7" rx="1" fill="#E0F2FE" stroke={stroke} strokeWidth="1.8" />
      <rect x="40" y="36" width="6" height="7" rx="1" fill="#E0F2FE" stroke={stroke} strokeWidth="1.8" />
      <circle cx="34.5" cy="48" r="1.2" fill={stroke} />
    </g>
  );
}

function renderNumber(item: number) {
  const num = item + 1;
  const accentColors = [
    '#1C1B18',
    '#1F6E4A',
    '#C84B31',
    '#1D4ED8',
    '#B45309',
    '#6D28D9',
    '#0F766E',
    '#9F1239',
    '#334155',
  ];
  const bg = accentColors[item % accentColors.length];

  return (
    <g>
      <rect
        x="8"
        y="10"
        width="48"
        height="44"
        rx="8"
        fill={bg}
        stroke="#1C1B18"
        strokeWidth="2.4"
      />
      <rect
        x="12"
        y="14"
        width="40"
        height="36"
        rx="5"
        fill="none"
        stroke="#F7F5F0"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <circle cx="15.5" cy="17.5" r="1.5" fill="#F7F5F0" fillOpacity="0.7" />
      <circle cx="48.5" cy="17.5" r="1.5" fill="#F7F5F0" fillOpacity="0.7" />
      <circle cx="15.5" cy="46.5" r="1.5" fill="#F7F5F0" fillOpacity="0.7" />
      <circle cx="48.5" cy="46.5" r="1.5" fill="#F7F5F0" fillOpacity="0.7" />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="29"
        fontWeight="700"
        fontFamily="Fraunces, Georgia, serif"
      >
        {num}
      </text>
    </g>
  );
}

function renderSign(item: number) {
  const stroke = '#1C1B18';
  switch (item) {
    case 0: // Stop Sign
      return (
        <g>
          <polygon
            points="22,8 42,8 56,22 56,42 42,56 22,56 8,42 8,22"
            fill="#C84B31"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <polygon
            points="23.5,11.5 40.5,11.5 52.5,23.5 52.5,40.5 40.5,52.5 23.5,52.5 11.5,40.5 11.5,23.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <text
            x="32"
            y="36.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="12.5"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            STOP
          </text>
        </g>
      );
    case 1: // Yield Sign
      return (
        <g>
          <polygon
            points="9,14 55,14 32,54"
            fill="#C84B31"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <polygon
            points="17,19 47,19 32,45"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      );
    case 2: // One Way (Blue arrow)
      return (
        <g>
          <circle cx="32" cy="32" r="23" fill="#2563EB" stroke={stroke} strokeWidth="2.4" />
          <path
            d="M18 32h26M35 23l9 9-9 9"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case 3: // Crosswalk (Yellow diamond)
      return (
        <g>
          <polygon
            points="32,7 57,32 32,57 7,32"
            fill="#EAB308"
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="21" r="3.5" fill={stroke} />
          <path
            d="M32 26v10M32 29l-6 5M32 29l6 5M32 36l-5 8M32 36l5 8"
            stroke={stroke}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case 4: // Speed 30
      return (
        <g>
          <circle cx="32" cy="32" r="23" fill="#FFFFFF" stroke="#C84B31" strokeWidth="6" />
          <circle cx="32" cy="32" r="25.5" fill="none" stroke={stroke} strokeWidth="1.8" />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fill={stroke}
            fontSize="21"
            fontWeight="800"
            fontFamily="JetBrains Mono, monospace"
          >
            30
          </text>
        </g>
      );
    case 5: // No Entry
      return (
        <g>
          <circle cx="32" cy="32" r="23" fill="#C84B31" stroke={stroke} strokeWidth="2.4" />
          <rect x="16" y="27" width="32" height="10" rx="2" fill="#FFFFFF" />
        </g>
      );
    case 6: // Parking P
      return (
        <g>
          <rect x="10" y="10" width="44" height="44" rx="8" fill="#1D4ED8" stroke={stroke} strokeWidth="2.4" />
          <text
            x="32"
            y="44"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="33"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            P
          </text>
        </g>
      );
    case 7: // Roundabout
      return (
        <g>
          <circle cx="32" cy="32" r="23" fill="#0D9488" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="32" r="11" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="16 7" />
          <polygon points="32,16 37,22 27,22" fill="#FFFFFF" />
          <polygon points="47,36 41,41 42,31" fill="#FFFFFF" />
          <polygon points="18,37 25,35 20,43" fill="#FFFFFF" />
        </g>
      );
    default: // Bicycle Lane
      return (
        <g>
          <circle cx="32" cy="32" r="23" fill="#1F6E4A" stroke={stroke} strokeWidth="2.4" />
          <circle cx="22" cy="38" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2.8" />
          <circle cx="42" cy="38" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2.8" />
          <path
            d="M22 38l8-11h9l3 11M30 27l3 11h-11"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
  }
}

function renderPet(item: number) {
  const stroke = '#1C1B18';
  switch (item) {
    case 0: // Cat (ginger)
      return (
        <g>
          <polygon points="14,12 25,22 14,30" fill="#EA580C" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="50,12 39,22 50,30" fill="#EA580C" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="32" cy="35" r="17" fill="#F97316" stroke={stroke} strokeWidth="2.4" />
          <circle cx="25" cy="33" r="2.3" fill={stroke} />
          <circle cx="39" cy="33" r="2.3" fill={stroke} />
          <polygon points="29,38 35,38 32,41" fill="#FDBA74" stroke={stroke} strokeWidth="1.5" />
          <path d="M11 35h10M11 40h10M43 35h10M43 40h10" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 1: // Dog (warm brown floppy ears)
      return (
        <g>
          <ellipse cx="14" cy="34" rx="6" ry="13" fill="#78350F" stroke={stroke} strokeWidth="2.4" />
          <ellipse cx="50" cy="34" rx="6" ry="13" fill="#78350F" stroke={stroke} strokeWidth="2.4" />
          <circle cx="32" cy="33" r="16" fill="#D97706" stroke={stroke} strokeWidth="2.4" />
          <ellipse cx="32" cy="40" rx="8" ry="6" fill="#FEF3C7" />
          <circle cx="26" cy="30" r="2.3" fill={stroke} />
          <circle cx="38" cy="30" r="2.3" fill={stroke} />
          <ellipse cx="32" cy="38" rx="3.5" ry="2.4" fill={stroke} />
          <path d="M29 43c1.5 2 4.5 2 6 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 2: // Rabbit
      return (
        <g>
          <ellipse cx="24" cy="18" rx="5" ry="12" fill="#FFFFFF" stroke={stroke} strokeWidth="2.4" />
          <ellipse cx="40" cy="18" rx="5" ry="12" fill="#FFFFFF" stroke={stroke} strokeWidth="2.4" />
          <ellipse cx="24" cy="18" rx="2.2" ry="7" fill="#FDA4AF" />
          <ellipse cx="40" cy="18" rx="2.2" ry="7" fill="#FDA4AF" />
          <circle cx="32" cy="39" r="15" fill="#FFFFFF" stroke={stroke} strokeWidth="2.4" />
          <circle cx="26" cy="37" r="2" fill={stroke} />
          <circle cx="38" cy="37" r="2" fill={stroke} />
          <circle cx="32" cy="42" r="2" fill="#F43F5E" />
        </g>
      );
    case 3: // Parrot
      return (
        <g>
          <path d="M20 48c0-17 6-31 18-31 7 0 11 5 11 11 0 11-7 20-19 25H20z" fill="#16A34A" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="38" cy="26" r="6" fill="#FFFFFF" />
          <circle cx="39" cy="25.5" r="2.2" fill={stroke} />
          <path d="M47 23c6 1 8 6 4 10l-4-2v-8z" fill="#EAB308" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M23 35c5 0 9 5 9 12H21" fill="#DC2626" stroke={stroke} strokeWidth="2" />
        </g>
      );
    case 4: // Turtle
      return (
        <g>
          <circle cx="49" cy="36" r="6" fill="#65A30D" stroke={stroke} strokeWidth="2.2" />
          <circle cx="51" cy="34.5" r="1.5" fill={stroke} />
          <rect x="17" y="42" width="6" height="8" rx="2" fill="#65A30D" stroke={stroke} strokeWidth="2" />
          <rect x="35" y="42" width="6" height="8" rx="2" fill="#65A30D" stroke={stroke} strokeWidth="2" />
          <path d="M12 42c0-13 8-22 18-22s18 9 18 22H12z" fill="#3F6212" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="30,24 37,31 34,39 26,39 23,31" fill="#84CC16" stroke={stroke} strokeWidth="1.8" />
        </g>
      );
    case 5: // Goldfish
      return (
        <g>
          <polygon points="18,32 8,21 11,32 8,43" fill="#FB923C" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <ellipse cx="34" cy="32" rx="17" ry="12" fill="#F97316" stroke={stroke} strokeWidth="2.4" />
          <path d="M29 20l5-7 7 7" fill="#FB923C" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="43" cy="29" r="3" fill="#FFFFFF" />
          <circle cx="43.8" cy="29" r="1.6" fill={stroke} />
        </g>
      );
    case 6: // Fox
      return (
        <g>
          <polygon points="12,13 26,23 15,32" fill="#C2410C" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="52,13 38,23 49,32" fill="#C2410C" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="13,30 32,20 51,30 32,52" fill="#EA580C" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <polygon points="15,31 28,46 32,51 36,46 49,31 32,37" fill="#FFFFFF" />
          <circle cx="25" cy="31" r="2.2" fill={stroke} />
          <circle cx="39" cy="31" r="2.2" fill={stroke} />
          <circle cx="32" cy="50" r="2.8" fill={stroke} />
        </g>
      );
    case 7: // Owl
      return (
        <g>
          <ellipse cx="32" cy="35" rx="17" ry="19" fill="#78350F" stroke={stroke} strokeWidth="2.4" />
          <polygon points="18,19 23,12 28,20" fill="#78350F" stroke={stroke} strokeWidth="2.2" />
          <polygon points="46,19 41,12 36,20" fill="#78350F" stroke={stroke} strokeWidth="2.2" />
          <circle cx="25" cy="29" r="6.5" fill="#FEF3C7" stroke={stroke} strokeWidth="2" />
          <circle cx="39" cy="29" r="6.5" fill="#FEF3C7" stroke={stroke} strokeWidth="2" />
          <circle cx="25" cy="29" r="2.5" fill={stroke} />
          <circle cx="39" cy="29" r="2.5" fill={stroke} />
          <polygon points="29,34 35,34 32,40" fill="#F59E0B" stroke={stroke} strokeWidth="1.8" />
        </g>
      );
    default: // Hedgehog
      return (
        <g>
          <path d="M10 42l3-8-4-6 7-3 1-7 7 1 5-6 5 5 7-2 2 7 7 2-3 7 4 6-7 4H10z" fill="#57534E" stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M26 44c0-9 7-15 16-15 6 0 12 6 12 13 0 2-1 3-3 3H26z" fill="#F5DEB3" stroke={stroke} strokeWidth="2.2" />
          <circle cx="43" cy="36" r="2" fill={stroke} />
          <circle cx="53" cy="41" r="2.5" fill={stroke} />
        </g>
      );
  }
}

function renderFlag(item: number) {
  const stroke = '#1C1B18';
  return (
    <g>
      <defs>
        <clipPath id={`flag-clip-${item}`}>
          <rect x="8" y="14" width="48" height="36" rx="4" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flag-clip-${item})`}>
        {item === 0 && ( // Netherlands
          <>
            <rect x="8" y="14" width="48" height="12" fill="#AE1C28" />
            <rect x="8" y="26" width="48" height="12" fill="#FFFFFF" />
            <rect x="8" y="38" width="48" height="12" fill="#21468B" />
          </>
        )}
        {item === 1 && ( // Japan
          <>
            <rect x="8" y="14" width="48" height="36" fill="#FFFFFF" />
            <circle cx="32" cy="32" r="10.5" fill="#BC002D" />
          </>
        )}
        {item === 2 && ( // Brazil
          <>
            <rect x="8" y="14" width="48" height="36" fill="#009B3A" />
            <polygon points="32,18 52,32 32,46 12,32" fill="#FFDF00" />
            <circle cx="32" cy="32" r="7.5" fill="#002776" />
            <path d="M25 31c4-2 9-1 14 2" stroke="#FFFFFF" strokeWidth="1.6" />
          </>
        )}
        {item === 3 && ( // France
          <>
            <rect x="8" y="14" width="16" height="36" fill="#0055A4" />
            <rect x="24" y="14" width="16" height="36" fill="#FFFFFF" />
            <rect x="40" y="14" width="16" height="36" fill="#EF4135" />
          </>
        )}
        {item === 4 && ( // Canada
          <>
            <rect x="8" y="14" width="12" height="36" fill="#D80621" />
            <rect x="20" y="14" width="24" height="36" fill="#FFFFFF" />
            <rect x="44" y="14" width="12" height="36" fill="#D80621" />
            <polygon points="32,21 35,27 40,26 37,31 40,34 34,35 33,42 31,42 30,35 24,34 27,31 24,26 29,27" fill="#D80621" />
          </>
        )}
        {item === 5 && ( // Sweden
          <>
            <rect x="8" y="14" width="48" height="36" fill="#006AA7" />
            <rect x="21" y="14" width="7" height="36" fill="#FECC00" />
            <rect x="8" y="28.5" width="48" height="7" fill="#FECC00" />
          </>
        )}
        {item === 6 && ( // Switzerland
          <>
            <rect x="8" y="14" width="48" height="36" fill="#D52B1E" />
            <rect x="28.5" y="21" width="7" height="22" fill="#FFFFFF" />
            <rect x="21" y="28.5" width="22" height="7" fill="#FFFFFF" />
          </>
        )}
        {item === 7 && ( // UK
          <>
            <rect x="8" y="14" width="48" height="36" fill="#012169" />
            <path d="M8 14l48 36M56 14L8 50" stroke="#FFFFFF" strokeWidth="7" />
            <path d="M8 14l48 36M56 14L8 50" stroke="#C8102E" strokeWidth="3" />
            <rect x="27" y="14" width="10" height="36" fill="#FFFFFF" />
            <rect x="8" y="27" width="48" height="10" fill="#FFFFFF" />
            <rect x="29" y="14" width="6" height="36" fill="#C8102E" />
            <rect x="8" y="29" width="48" height="6" fill="#C8102E" />
          </>
        )}
        {item === 8 && ( // Germany
          <>
            <rect x="8" y="14" width="48" height="12" fill="#111111" />
            <rect x="8" y="26" width="48" height="12" fill="#DD0000" />
            <rect x="8" y="38" width="48" height="12" fill="#FFCE00" />
          </>
        )}
      </g>
      <rect x="8" y="14" width="48" height="36" rx="4" fill="none" stroke={stroke} strokeWidth="2.4" />
    </g>
  );
}
