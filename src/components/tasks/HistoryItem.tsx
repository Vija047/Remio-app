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
            size={14}
            color={theme.isDark ? '#0B0C10' : '#FFFFFF'}
            strokeWidth={3}
          />
        </View>
      </View>

      {/* Badges / Prediction metrics */}
      <View style={styles.badgeRow}>
        {item.aiAccuracyBadge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Sparkles size={12} color={theme.teal} />
            <Text style={[styles.badgeText, { color: theme.text }]}>
              {item.aiAccuracyBadge}
            </Text>
          </View>
        )}

        {item.nextPredictionDays !== undefined && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Calendar size={12} color={theme.coral} />
            <Text style={[styles.badgeText, { color: theme.text }]}>
              Next Prediction {item.nextPredictionDays} Days
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii['3xl'],
    padding: 16,
    marginBottom: 12,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  emojiText: {
    fontSize: 18,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  timeString: {
    fontSize: 13,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    marginTop: 10,
    paddingLeft: 52,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
