import { TextStyle } from 'react-native';

export const typography = {
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
    '4xl': 38,
  },
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '800' as TextStyle['fontWeight'],
  },
  lineHeights: {
    tight: 1.15,
    normal: 1.35,
    relaxed: 1.5,
  },
  microLabel: {
    fontSize: 11,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 1.1,
    textTransform: 'uppercase' as TextStyle['textTransform'],
    color: '#8E8E93',
  },
  titleLarge: {
    fontSize: 30,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#111118',
    letterSpacing: -0.5,
  },
  titleMedium: {
    fontSize: 22,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: '#111118',
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: '#6B7280',
    lineHeight: 22,
  },
} as const;
