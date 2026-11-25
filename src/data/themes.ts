import { ThemeRowMeta, TileRef } from '../types/sherlock';

export const ROW_THEMES: ThemeRowMeta[] = [
  {
    id: 'people',
    title: 'People',
    items: [
      { name: 'Young Girl', shortLabel: 'Girl' },
      { name: 'White-Haired Woman', shortLabel: 'Woman' },
      { name: 'Detective', shortLabel: 'Detective' },
      { name: 'Chef', shortLabel: 'Chef' },
      { name: 'Artist', shortLabel: 'Artist' },
      { name: 'Cyclist', shortLabel: 'Cyclist' },
      { name: 'Gentleman', shortLabel: 'Elder' },
      { name: 'Schoolboy', shortLabel: 'Boy' },
      { name: 'Scientist', shortLabel: 'Scientist' },
    ],
  },
  {
    id: 'houses',
    title: 'Houses',
    items: [
      { name: 'Green House', shortLabel: 'Green' },
      { name: 'Red House', shortLabel: 'Red' },
      { name: 'Orange House', shortLabel: 'Orange' },
      { name: 'Blue House', shortLabel: 'Blue' },
      { name: 'Yellow House', shortLabel: 'Yellow' },
      { name: 'Purple House', shortLabel: 'Purple' },
      { name: 'Teal House', shortLabel: 'Teal' },
      { name: 'Cream Villa', shortLabel: 'Villa' },
      { name: 'Slate Manor', shortLabel: 'Manor' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers',
    items: [
      { name: 'House Number 1', shortLabel: '#1' },
      { name: 'House Number 2', shortLabel: '#2' },
      { name: 'House Number 3', shortLabel: '#3' },
      { name: 'House Number 4', shortLabel: '#4' },
      { name: 'House Number 5', shortLabel: '#5' },
      { name: 'House Number 6', shortLabel: '#6' },
      { name: 'House Number 7', shortLabel: '#7' },
      { name: 'House Number 8', shortLabel: '#8' },
      { name: 'House Number 9', shortLabel: '#9' },
    ],
  },
  {
    id: 'signs',
    title: 'Signs',
    items: [
      { name: 'Stop Sign', shortLabel: 'Stop' },
      { name: 'Yield Sign', shortLabel: 'Yield' },
      { name: 'One Way Sign', shortLabel: 'One Way' },
      { name: 'Crosswalk Sign', shortLabel: 'Crosswalk' },
      { name: 'Speed 30 Sign', shortLabel: '30 Zone' },
      { name: 'No Entry Sign', shortLabel: 'No Entry' },
      { name: 'Parking Sign', shortLabel: 'Parking' },
      { name: 'Roundabout Sign', shortLabel: 'Roundabout' },
      { name: 'Bicycle Sign', shortLabel: 'Bike Lane' },
    ],
  },
  {
    id: 'pets',
    title: 'Pets',
    items: [
      { name: 'Cat', shortLabel: 'Cat' },
      { name: 'Dog', shortLabel: 'Dog' },
      { name: 'Rabbit', shortLabel: 'Rabbit' },
      { name: 'Parrot', shortLabel: 'Parrot' },
      { name: 'Turtle', shortLabel: 'Turtle' },
      { name: 'Goldfish', shortLabel: 'Fish' },
      { name: 'Fox', shortLabel: 'Fox' },
      { name: 'Owl', shortLabel: 'Owl' },
      { name: 'Hedgehog', shortLabel: 'Hedgehog' },
    ],
  },
  {
    id: 'flags',
    title: 'Flags',
    items: [
      { name: 'Dutch Flag', shortLabel: 'NL' },
      { name: 'Japanese Flag', shortLabel: 'JP' },
      { name: 'Brazilian Flag', shortLabel: 'BR' },
      { name: 'French Flag', shortLabel: 'FR' },
      { name: 'Canadian Flag', shortLabel: 'CA' },
      { name: 'Swedish Flag', shortLabel: 'SE' },
      { name: 'Swiss Flag', shortLabel: 'CH' },
      { name: 'British Flag', shortLabel: 'UK' },
      { name: 'German Flag', shortLabel: 'DE' },
    ],
  },
];

export function getTileName(ref: TileRef): string {
  const row = ROW_THEMES[ref.row];
  if (!row) return `Row ${ref.row + 1} Item ${ref.item + 1}`;
  return row.items[ref.item]?.name ?? `${row.title} ${ref.item + 1}`;
}

export function getTileShortLabel(ref: TileRef): string {
  const row = ROW_THEMES[ref.row];
  if (!row) return `${ref.item + 1}`;
  return row.items[ref.item]?.shortLabel ?? `${ref.item + 1}`;
}
