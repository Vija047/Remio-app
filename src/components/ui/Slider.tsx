import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { colors } from '../../theme/colors';

export interface SliderProps {
  value: number; // 0 to 1
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
}) => {
  const percentage = Math.min(Math.max(value, 0), 1) * 100;

  const handleTrackPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    // Assume container width approx, or calculate ratio
    const width = 280; // approximate width
    const newValue = Math.min(Math.max(locationX / width, 0), 1);
    onValueChange(newValue);
  };

  return (
    <Pressable onPress={handleTrackPress} style={styles.container}>
      <View style={styles.trackBackground}>
        <View style={[styles.activeTrack, { width: `${percentage}%` }]} />
      </View>
      <View style={[styles.thumb, { left: `${percentage}%` }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    width: '100%',
  },
  trackBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    width: '100%',
  },
  activeTrack: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primary,
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
