import React from 'react';
import { View, Image, StyleSheet, ViewStyle, Text, Pressable } from 'react-native';
import { User as UserIcon, Camera } from 'lucide-react-native';
import { radii } from '../../theme/radii';

export interface AvatarProps {
  url?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
  onPress?: () => void;
  showEditBadge?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  name,
  size = 48,
  style,
  onPress,
  showEditBadge = false,
}) => {
  const getInitials = (n?: string): string => {
    if (!n || !n.trim()) return '';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const fontSize = Math.max(12, Math.round(size * 0.38));
  const editBadgeSize = Math.max(18, Math.round(size * 0.36));
  const editIconSize = Math.max(10, Math.round(editBadgeSize * 0.55));

  const hasValidImage = url && typeof url === 'string' && url.trim().length > 0;

  const content = (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {hasValidImage ? (
        <Image
          source={{ uri: url.trim() }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View style={[styles.fallbackContainer, { width: size, height: size, borderRadius: size / 2 }]}>
          {initials ? (
            <Text style={[styles.initialsText, { fontSize }]}>{initials}</Text>
          ) : (
            <UserIcon size={Math.round(size * 0.52)} color="#FF5A36" strokeWidth={2} />
          )}
        </View>
      )}

      {showEditBadge && (
        <View
          style={[
            styles.editBadge,
            {
              width: editBadgeSize,
              height: editBadgeSize,
              borderRadius: editBadgeSize / 2,
            },
          ]}
        >
          <Camera size={editIconSize} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.full,
    overflow: 'visible',
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  fallbackContainer: {
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD6CE',
  },
  initialsText: {
    fontWeight: '800',
    color: '#FF5A36',
    letterSpacing: 0.5,
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF5A36',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  pressed: {
    opacity: 0.8,
  },
});

