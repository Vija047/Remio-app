import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, LayoutGrid } from 'lucide-react-native';
import { Task } from '../../types';
import { radii } from '../../theme/radii';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Checkbox';
import { ProgressBar } from '../ui/ProgressBar';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const toggleTaskCompleted = useTaskStore((s) => s.toggleTaskCompleted);
  const completingTaskIds = useTaskStore((s) => s.completingTaskIds);

  const isCompleting = completingTaskIds.includes(task.id);

  const handleCardPress = () => {
    haptics.light();
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  const handleToggle = () => {
    if (isCompleting) return;
    haptics.success();
    toggleTaskCompleted(task.id);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.cardMuted,
          borderColor: theme.cardBorder,
        },
        task.completed && styles.completedContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Checkbox
          checked={task.completed}
          onToggle={handleToggle}
          size={24}
          style={styles.checkbox}
        />

        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              { color: theme.text },
              task.completed && styles.strikethrough,
            ]}
            numberOfLines={1}
          >
            {`${task.emoji} ${task.title}`}
          </Text>
          <Text style={[styles.dueLabel, { color: theme.secondaryText }]}>
            {task.dueLabel}
          </Text>
        </View>
      </View>

      {/* Clean Bottom Row: AI badge + Confidence */}
      <View style={styles.bottomRow}>
        <View
          style={[
            styles.aiBadge,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Sparkles size={11} color={theme.text} />
          <Text style={[styles.aiBadgeText, { color: theme.text }]}>
            AI predicted
          </Text>
        </View>

        {task.confidence > 0 && (
          <View style={styles.confidenceRow}>
            <View style={styles.progressBarWrapper}>
              <ProgressBar
                progress={task.confidence}
                height={4}
                color={theme.primary}
                backgroundColor={theme.border}
              />
            </View>
            <Text style={[styles.confidenceText, { color: theme.secondaryText }]}>
              {task.confidence}% confidence
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii['2xl'],
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  completedContainer: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginTop: 2,
    marginRight: 12,
  },
  titleArea: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  dueLabel: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  bottomRow: {
    marginTop: 12,
    paddingLeft: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radii.full,
    gap: 4,
    borderWidth: 1,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarWrapper: {
    width: 48,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
