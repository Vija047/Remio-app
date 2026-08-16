import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';

export interface BadgeProps {
  label: string;
  variant?: 'ai' | 'confidence' | 'status' | 'dark' | 'coral' | 'outline' | 'top';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'ai',
  icon,
  style,
  textStyle,
}) => {
  const getBadgeStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'ai':
        return {
          container: {
            backgroundColor: '#E5E7EB',
            paddingHorizontal: 10,
            paddingVertical: 4,
          },
          text: {
            color: '#374151',
            fontSize: 12,
            fontWeight: '600',
          },
        };
      case 'confidence':
        return {
          container: {
            backgroundColor: colors.coralLight,
            borderColor: colors.coralBorder,
            borderWidth: 1,
            paddingHorizontal: 12,
            paddingVertical: 5,
          },
          text: {
            color: colors.coral,
            fontSize: 13,
            fontWeight: '600',
          },
        };
      case 'top':
        return {
          container: {
            backgroundColor: '#E5E7EB',
            paddingHorizontal: 12,
            paddingVertical: 4,
          },
          text: {
            color: '#374151',
            fontSize: 12,
            fontWeight: '600',
          },
        };
      case 'coral':
        return {
          container: {
            backgroundColor: colors.coral,
            paddingHorizontal: 12,
            paddingVertical: 4,
          },
          text: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '700',
          },
        };
      case 'dark':
        return {
          container: {
            backgroundColor: colors.primary,
            paddingHorizontal: 10,
            paddingVertical: 4,
          },
          text: {
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.5,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: colors.border,
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 4,
          },
          text: {
            color: colors.secondaryText,
            fontSize: 12,
            fontWeight: '500',
          },
        };
      case 'status':
      default:
        return {
          container: {
            backgroundColor: colors.cardMuted,
            paddingHorizontal: 10,
            paddingVertical: 4,
          },
          text: {
            color: colors.primaryText,
            fontSize: 12,
            fontWeight: '500',
          },
        };
    }
  };

  const vStyles = getBadgeStyle();

  return (
    <View style={[styles.baseContainer, vStyles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.baseText, vStyles.text, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  baseText: {
    letterSpacing: -0.2,
  },
});
