export const colors = {
  // Primary brand & text
  primary: '#111118',
  primaryText: '#111118',
  secondaryText: '#6B7280',
  mutedText: '#9CA3AF',
  subtleText: '#D1D5DB',

  // Backgrounds & Surfaces
  background: '#FFFFFF',
  backgroundMuted: '#F8F9FA',
  backgroundSoft: '#F4F5F7',
  card: '#FFFFFF',
  cardBorder: '#F0F0F2',
  cardMuted: '#F6F7F9',
  border: '#E5E7EB',
  divider: '#F3F4F6',

  // RoutineAI Coral Brand Accent
  coral: '#FF5A36',
  coralDark: '#E04826',
  coralLight: '#FFF0ED',
  coralSoft: '#FFECE7',
  coralBorder: '#FFD5CC',

  // AI & Metric Accents
  teal: '#00B8D9',
  tealLight: '#E6F9FC',
  tealDark: '#0097B2',
  purple: '#7C3AED',
  purpleLight: '#F5F3FF',
  green: '#10B981',
  greenLight: '#ECFDF5',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
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
