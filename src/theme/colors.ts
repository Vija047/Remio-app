export const colors = {
  // Primary brand & text (Black & White Monochrome)
  primary: '#111111',
  primaryText: '#111111',
  secondaryText: '#6B6B73',
  mutedText: '#A1A1AA',
  subtleText: '#D4D4D8',

  // Backgrounds & Surfaces
  background: '#FFFFFF',
  backgroundMuted: '#F7F7F8',
  backgroundSoft: '#F4F4F6',
  card: '#FFFFFF',
  cardBorder: '#E5E5E7',
  cardMuted: '#F7F7F8',
  border: '#E5E5E7',
  divider: '#E5E5E7',

  // Remio Neutral & Core Accents
  coral: '#111111',
  coralDark: '#000000',
  coralLight: '#F4F4F5',
  coralSoft: '#F4F4F5',
  coralBorder: '#E5E5E7',

  // AI & Metric Accents (Monochrome & subtle slate)
  teal: '#111111',
  tealLight: '#F4F4F5',
  tealDark: '#000000',
  purple: '#111111',
  purpleLight: '#F4F4F5',
  green: '#111111',
  greenLight: '#F4F4F5',
  amber: '#111111',
  amberLight: '#F4F4F5',
  red: '#EF4444',
  redLight: '#FEE2E2',

  // Dark Mode Support
  dark: {
    background: '#0B0C10',
    card: '#16181F',
    cardBorder: '#232733',
    cardMuted: '#1E212B',
    primaryText: '#F9FAFB',
    secondaryText: '#9CA3AF',
    mutedText: '#6B7280',
  },
} as const;

export type Colors = typeof colors;
