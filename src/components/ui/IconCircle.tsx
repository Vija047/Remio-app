import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';

export interface IconCircleProps {
  children: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  style?: ViewStyle;
}

export const IconCircle: React.FC<IconCircleProps> = ({
  children,
  size = 48,
  backgroundColor = colors.cardMuted,
  borderColor,
  style,
}) => {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor: borderColor || 'transparent',
          borderWidth: borderColor ? 1.5 : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
