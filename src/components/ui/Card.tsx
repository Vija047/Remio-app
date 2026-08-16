import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'muted' | 'bordered' | 'coralLight' | 'selected' | 'dark';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'muted':
        return {
          backgroundColor: colors.cardMuted,
          borderColor: 'transparent',
        };
      case 'bordered':
        return {
          backgroundColor: colors.card,
          borderColor: colors.primary,
          borderWidth: 1.5,
        };
      case 'selected':
        return {
          backgroundColor: colors.coralLight,
          borderColor: colors.coralBorder,
          borderWidth: 1.5,
        };
      case 'coralLight':
        return {
          backgroundColor: colors.coralLight,
          borderColor: colors.coralBorder,
        };
      case 'dark':
        return {
          backgroundColor: colors.primary,
          borderColor: 'transparent',
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.cardMuted,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        };
    }
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.baseCard,
          getVariantStyle(),
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.baseCard, getVariantStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: radii['3xl'],
    padding: 20,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
