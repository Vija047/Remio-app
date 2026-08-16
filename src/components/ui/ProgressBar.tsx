import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  color = colors.primary,
  backgroundColor = '#E5E7EB',
  style,
  animate = true,
}) => {
  const animatedProgress = useSharedValue(animate ? 0 : progress);

  useEffect(() => {
    if (animate) {
      animatedProgress.value = withTiming(progress, {
        duration: 650,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(Math.max(animatedProgress.value, 0), 100)}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { height, backgroundColor: color, borderRadius: height / 2 },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
