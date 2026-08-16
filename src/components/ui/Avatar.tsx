import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { radii } from '../../theme/radii';

export interface AvatarProps {
  url?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  size = 48,
  style,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={{ uri: url }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.full,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  image: {
    resizeMode: 'cover',
  },
});
