import React, { useEffect } from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

export interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  showCheckmark?: boolean;
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  showCheckmark = false,
  style,
}) => {
  const haptics = useHaptics();
  const offset = useSharedValue(value ? 22 : 2);
  const colorProgress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    offset.value = withSpring(value ? 22 : 2, {
      damping: 18,
      stiffness: 250,
    });
    colorProgress.value = withSpring(value ? 1 : 0, {
      damping: 18,
      stiffness: 250,
    });
  }, [value]);

  const handlePress = () => {
    if (disabled) return;
    haptics.light();
    onValueChange(!value);
  };

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#D1D5DB', colors.primary]
    );
    return {
      backgroundColor,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={style}>
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
          {showCheckmark && value && (
            <Check size={12} color={colors.primary} strokeWidth={3.5} />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
