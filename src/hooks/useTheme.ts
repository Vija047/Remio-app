import { useUserStore } from '../store/useUserStore';
import { colors as baseColors } from '../theme/colors';

export function useTheme() {
  const darkMode = useUserStore((s) => s.darkMode);

  const theme = {
    isDark: darkMode,
    background: darkMode ? '#0B0C10' : '#FFFFFF',
    backgroundMuted: darkMode ? '#16181F' : '#F8F9FA',
    backgroundSoft: darkMode ? '#1E212B' : '#F4F5F7',
    card: darkMode ? '#16181F' : '#FFFFFF',
    cardBorder: darkMode ? '#232733' : '#E5E7EB',
    cardMuted: darkMode ? '#1E212B' : '#F6F7F9',
    text: darkMode ? '#F9FAFB' : '#111118',
    secondaryText: darkMode ? '#9CA3AF' : '#6B7280',
    mutedText: darkMode ? '#6B7280' : '#9CA3AF',
    border: darkMode ? '#232733' : '#E5E7EB',
    divider: darkMode ? '#232733' : '#F3F4F6',
    inputBackground: darkMode ? '#16181F' : '#FFFFFF',
    inputBorder: darkMode ? '#2A2E3D' : '#E5E7EB',
    pillBackground: darkMode ? '#1E212B' : '#F3F4F6',
    pillActive: darkMode ? '#F9FAFB' : '#111118',
    pillActiveText: darkMode ? '#0B0C10' : '#FFFFFF',
    // Accent colors
    coral: baseColors.coral,
    coralLight: darkMode ? '#2A1815' : baseColors.coralLight,
    coralDark: baseColors.coralDark,
    teal: baseColors.teal,
    tealLight: darkMode ? '#0C2228' : baseColors.tealLight,
    green: baseColors.green,
    greenLight: darkMode ? '#0D261E' : baseColors.greenLight,
    red: baseColors.red,
    redLight: darkMode ? '#2B1212' : baseColors.redLight,
    primary: darkMode ? '#F9FAFB' : baseColors.primary,
    primaryTextOnDark: '#0B0C10',
  };

  return theme;
}
