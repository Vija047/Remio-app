import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { useHaptics } from '../../hooks/useHaptics';

export interface CheckboxProps {
  checked: boolean;
  onToggle?: () => void;
  size?: number;
  shape?: 'circle' | 'square';
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  size = 24,
  shape = 'circle',
  style,
}) => {
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handlePress = () => {
    haptics.light();
    scale.value = withSpring(1.2, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onToggle?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isCircle = shape === 'circle';

  return (
    <Pressable onPress={handlePress} style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: isCircle ? radii.full : radii.sm,
            backgroundColor: checked ? colors.primary : 'transparent',
            borderColor: checked ? colors.primary : colors.subtleText,
          },
          animatedStyle,
        ]}
      >
        {checked && (
          <Check size={size * 0.6} color="#FFFFFF" strokeWidth={3.5} />
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
