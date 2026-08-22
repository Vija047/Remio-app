import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Check, Sparkles, Calendar, RotateCcw } from 'lucide-react-native';
import { HistoryLogItem } from '../../types';
import { radii } from '../../theme/radii';
import { useTheme } from '../../hooks/useTheme';

export interface HistoryItemProps {
  item: HistoryLogItem;
  onPress?: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.cardMuted,
          borderColor: theme.cardBorder,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={styles.emojiText}>{item.emoji}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.timeString, { color: theme.secondaryText }]}>
            {item.timeString}
          </Text>
        </View>

        <View
          style={[
            styles.checkCircle,
            { backgroundColor: theme.primary },
          ]}
        >
          <Check
            size={13}
            color={theme.isDark ? '#0B0C10' : '#FFFFFF'}
            strokeWidth={3}
          />
        </View>
      </View>

      {/* Small Outlined AI Confidence Pill */}
      {item.aiAccuracyBadge && (
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.secondaryText }]}>
              {item.aiAccuracyBadge}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii['2xl'],
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  emojiText: {
    fontSize: 16,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  timeString: {
    fontSize: 12.5,
    marginTop: 2,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    marginTop: 8,
    paddingLeft: 50,
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
