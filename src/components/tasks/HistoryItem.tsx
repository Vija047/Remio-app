import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Check, Sparkles, Calendar, RotateCcw } from 'lucide-react-native';
import { HistoryLogItem } from '../../types';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';

export interface HistoryItemProps {
  item: HistoryLogItem;
  onPress?: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.emojiText}>{item.emoji}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.timeString}>{item.timeString}</Text>
        </View>

        <View style={styles.checkCircle}>
          <Check size={14} color="#FFFFFF" strokeWidth={3} />
        </View>
      </View>

      {/* Badges / Prediction metrics */}
      <View style={styles.badgeRow}>
        {item.aiAccuracyBadge && (
          <View style={styles.badge}>
            <Sparkles size={12} color="#374151" />
            <Text style={styles.badgeText}>{item.aiAccuracyBadge}</Text>
          </View>
        )}

        {item.nextPredictionDays !== undefined && (
          <View style={styles.badge}>
            <Calendar size={12} color="#374151" />
            <Text style={styles.badgeText}>
              Next Prediction {item.nextPredictionDays} Days
            </Text>
          </View>
        )}

        {item.nextReminderDays !== undefined && (
          <View style={styles.badge}>
            <RotateCcw size={12} color="#374151" />
            <Text style={styles.badgeText}>
              Next Reminder {item.nextReminderDays} Days
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['3xl'],
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F2',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: colors.primaryText,
  },
  timeString: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    marginTop: 12,
    paddingLeft: 52,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAECEF',
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
