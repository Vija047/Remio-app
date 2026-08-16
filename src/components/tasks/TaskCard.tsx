import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, LayoutGrid, ArrowRight } from 'lucide-react-native';
import { Task } from '../../types';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Badge } from '../ui/Badge';
import { Checkbox } from '../ui/Checkbox';
import { ProgressBar } from '../ui/ProgressBar';
import { useTaskStore } from '../../store/useTaskStore';

export interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const router = useRouter();
  const toggleTaskCompleted = useTaskStore((s) => s.toggleTaskCompleted);

  const handleCardPress = () => {
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.container,
        task.completed && styles.completedContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Checkbox
          checked={task.completed}
          onToggle={() => toggleTaskCompleted(task.id)}
          size={26}
          style={styles.checkbox}
        />

        <View style={styles.titleArea}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, task.completed && styles.strikethrough]}
              numberOfLines={1}
            >
              {`${task.emoji} ${task.title}`}
            </Text>
            {task.isAiSuggested && (
              <Badge
                label="AI Suggested"
                variant="ai"
                icon={<Sparkles size={11} color="#374151" />}
              />
            )}
          </View>
          <Text style={styles.dueLabel}>{task.dueLabel}</Text>
        </View>
      </View>

      {/* Task card metadata & extra pills */}
      <View style={styles.bottomContent}>
        {task.smartWindowStatus === 'Open' && (
          <View style={styles.smartWindowPill}>
            <LayoutGrid size={14} color={colors.primaryText} />
            <Text style={styles.smartWindowText}>Smart Window: Open</Text>
          </View>
        )}

        {task.title === 'Medicine Refill' && (
          <View style={styles.confidenceRow}>
            <View style={styles.progressBarWrapper}>
              <ProgressBar progress={task.confidence} height={5} color={colors.primary} />
            </View>
            <Text style={styles.confidenceText}>
              Confidence: {task.confidence}%
            </Text>
          </View>
        )}

        {task.actionCta && (
          <Pressable
            onPress={handleCardPress}
            style={({ pressed }) => [styles.actionButton, pressed && styles.btnPressed]}
          >
            <Text style={styles.actionBtnText}>{task.actionCta}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['3xl'],
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F2',
  },
  completedContainer: {
    opacity: 0.65,
    backgroundColor: '#FAFAFA',
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
    color: colors.primaryText,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: colors.mutedText,
  },
  dueLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 2,
    fontWeight: '400',
  },
  bottomContent: {
    marginTop: 10,
    paddingLeft: 40,
  },
  smartWindowPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  smartWindowText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryText,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressBarWrapper: {
    flex: 1,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnPressed: {
    opacity: 0.85,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
