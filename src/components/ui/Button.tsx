import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { useHaptics } from '../../hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'coral' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    haptics.light();
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'coral':
        return {
          button: { backgroundColor: colors.coral },
          text: { color: '#FFFFFF' },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: colors.cardMuted,
          },
          text: { color: colors.primary },
        };
      case 'destructive':
        return {
          button: { backgroundColor: colors.primary },
          text: { color: '#FFFFFF' },
        };
      case 'ghost':
        return {
          button: { backgroundColor: 'transparent' },
          text: { color: colors.secondaryText },
        };
      case 'primary':
      default:
        return {
          button: { backgroundColor: colors.primary },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          button: { height: 42, paddingHorizontal: 16 },
          text: { fontSize: 14, fontWeight: '600' },
        };
      case 'md':
        return {
          button: { height: 50, paddingHorizontal: 22 },
          text: { fontSize: 16, fontWeight: '600' },
        };
      case 'lg':
      default:
        return {
          button: { height: 56, paddingHorizontal: 24 },
          text: { fontSize: 16, fontWeight: '700' },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        vStyles.button,
        sStyles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vStyles.text.color} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.baseText, vStyles.text, sStyles.text, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  baseText: {
    letterSpacing: -0.2,
  },
  disabled: {
    opacity: 0.4,
    backgroundColor: '#9CA3AF',
  },
});
