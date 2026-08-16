import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ArrowLeft, X } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { useHaptics } from '../../hooks/useHaptics';

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backVariant?: 'arrow' | 'chevron' | 'close' | 'circle';
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
  titleColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  backVariant = 'arrow',
  onBackPress,
  rightElement,
  style,
  titleColor = colors.primaryText,
}) => {
  const router = useRouter();
  const haptics = useHaptics();

  const handleBack = () => {
    haptics.light();
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const renderBackIcon = () => {
    if (backVariant === 'close') {
      return (
        <View style={styles.circleBtn}>
          <X size={20} color={colors.primary} />
        </View>
      );
    }
    if (backVariant === 'circle') {
      return (
        <View style={styles.circleBtn}>
          <ArrowLeft size={18} color={colors.primary} />
        </View>
      );
    }
    if (backVariant === 'chevron') {
      return <ChevronLeft size={26} color={colors.primary} />;
    }
    return <ArrowLeft size={24} color={colors.primary} />;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <Pressable
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            {renderBackIcon()}
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      <View style={styles.titleContainer}>
        {title && (
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightElement ? rightElement : <View style={styles.spacer} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: {
    opacity: 0.6,
  },
  spacer: {
    width: 40,
  },
});
