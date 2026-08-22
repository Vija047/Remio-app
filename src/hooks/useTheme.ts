import { useUserStore } from '../store/useUserStore';
import { colors as baseColors } from '../theme/colors';

export function useTheme() {
  const darkMode = useUserStore((s) => s.darkMode);

  const theme = {
    isDark: darkMode,
    background: darkMode ? '#0B0C10' : '#FFFFFF',
    backgroundMuted: darkMode ? '#16181F' : '#F7F7F8',
    backgroundSoft: darkMode ? '#1E212B' : '#F4F4F6',
    card: darkMode ? '#16181F' : '#FFFFFF',
    cardBorder: darkMode ? '#232733' : '#E5E5E7',
    cardMuted: darkMode ? '#1E212B' : '#F7F7F8',
    text: darkMode ? '#F9FAFB' : '#111111',
    secondaryText: darkMode ? '#9CA3AF' : '#6B6B73',
    mutedText: darkMode ? '#6B7280' : '#A1A1AA',
    border: darkMode ? '#232733' : '#E5E5E7',
    divider: darkMode ? '#232733' : '#E5E5E7',
    inputBackground: darkMode ? '#16181F' : '#FFFFFF',
    inputBorder: darkMode ? '#2A2E3D' : '#E5E5E7',
    pillBackground: darkMode ? '#1E212B' : '#F4F4F5',
    pillActive: darkMode ? '#F9FAFB' : '#111111',
    pillActiveText: darkMode ? '#0B0C10' : '#FFFFFF',
    // Accent colors (Remio Monochrome)
    coral: darkMode ? '#F9FAFB' : '#111111',
    coralLight: darkMode ? '#232733' : '#F4F4F5',
    coralDark: '#000000',
    teal: darkMode ? '#F9FAFB' : '#111111',
    tealLight: darkMode ? '#232733' : '#F4F4F5',
    green: darkMode ? '#F9FAFB' : '#111111',
    greenLight: darkMode ? '#232733' : '#F4F4F5',
    red: '#EF4444',
    redLight: darkMode ? '#2B1212' : '#FEE2E2',
    primary: darkMode ? '#F9FAFB' : '#111111',
    primaryTextOnDark: '#0B0C10',
  };

  return theme;
}
