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

  const handleCardPress = () => {
    haptics.light();
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  const handleToggle = () => {
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
          size={26}
          style={styles.checkbox}
        />

        <View style={styles.titleArea}>
          <View style={styles.titleRow}>
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
            {task.isAiSuggested && (
              <Badge
                label="AI Predicted"
                variant="ai"
                icon={<Sparkles size={11} color="#374151" />}
              />
            )}
          </View>
          <Text style={[styles.dueLabel, { color: theme.secondaryText }]}>
            {task.dueLabel}
          </Text>
        </View>
      </View>

      {/* Task card metadata & extra pills */}
      <View style={styles.bottomContent}>
        <View style={styles.metaRow}>
          {task.smartWindowStatus && (
            <View
              style={[
                styles.smartWindowPill,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <LayoutGrid size={13} color={theme.text} />
              <Text style={[styles.smartWindowText, { color: theme.text }]}>
                Window: {task.smartWindowStatus}
              </Text>
            </View>
          )}

          {task.confidence > 0 && (
            <View style={styles.confidenceRow}>
              <View style={styles.progressBarWrapper}>
                <ProgressBar
                  progress={task.confidence}
                  height={5}
                  color={theme.teal}
                  backgroundColor={theme.border}
                />
              </View>
              <Text
                style={[
                  styles.confidenceText,
                  { color: theme.secondaryText },
                ]}
              >
                {task.confidence}% Conf.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii['3xl'],
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  completedContainer: {
    opacity: 0.65,
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
    marginRight: 14,
  },
  titleArea: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  dueLabel: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '400',
  },
  bottomContent: {
    marginTop: 10,
    paddingLeft: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  smartWindowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 5,
    borderWidth: 1,
  },
  smartWindowText: {
    fontSize: 11,
    fontWeight: '600',
  },
  confidenceRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  progressBarWrapper: {
    flex: 1,
    maxWidth: 70,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
