import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  History,
  Calendar,
  Brain,
  FileText,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Button } from '../../components/ui/Button';
import { IntervalSpread } from '../../components/insights/IntervalSpread';
import { useAIStore } from '../../store/useAIStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function AIPredictionDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const params = useLocalSearchParams<{ id?: string; title?: string; emoji?: string }>();

  const tasks = useTaskStore((s) => s.tasks);
  const activePrediction = useAIStore((s) => s.activePrediction);
  const fetchTaskPrediction = useAIStore((s) => s.fetchTaskPrediction);
  const isLoading = useAIStore((s) => s.isLoading);

  const targetTask = params.id
    ? tasks.find((t) => t.id === params.id)
    : tasks[0];

  useEffect(() => {
    if (targetTask) {
      fetchTaskPrediction(targetTask.id, targetTask.title, targetTask.emoji);
    }
  }, [targetTask?.id]);

  const handleBookAppointment = () => {
    haptics.success();
    Alert.alert(
      'Optimal Reminder Scheduled',
      `Remio set a notification for your predicted optimal day: Day ${activePrediction?.bestDay || 30}.`
    );
  };

  const detail = activePrediction || {
    taskId: targetTask?.id || 'task-default',
    title: targetTask?.title || 'Routine Task',
    emoji: targetTask?.emoji || '✨',
    confidence: targetTask?.confidence || 0,
    avgIntervalDays: targetTask?.intervalDays || 0,
    startDay: Math.max(1, (targetTask?.intervalDays || 0) - 2),
    bestDay: targetTask?.intervalDays || 0,
    deadlineDay: (targetTask?.intervalDays || 0) + 2,
    idealWindowText: (targetTask?.confidence && targetTask.confidence > 0)
      ? `Around every ${targetTask.intervalDays} days`
      : 'Learning Schedule (Need ≥ 2 completions)',
    insightsText:
      (targetTask?.confidence && targetTask.confidence > 0)
        ? 'Remio computed this schedule based on your completion history to keep you consistent without stress.'
        : 'Remio is analyzing your routine. Complete this task at least twice to establish predictive intelligence.',
    learningLogicText:
      'Each time you log a task completion, Remio refines its predictive model using EWMA and median interval regression.',
    lastPrediction: targetTask?.intervalDays || 0,
    newPrediction: targetTask?.intervalDays || 0,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>AI Prediction</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Card */}
        <View
          style={[
            styles.topCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.cardMuted }]}>
            <Text style={styles.emojiIcon}>{detail.emoji}</Text>
          </View>

          <Text style={[styles.taskTitle, { color: theme.text }]}>{detail.title}</Text>

          <View
            style={[
              styles.confidenceBadge,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.border,
              },
            ]}
          >
            <Sparkles size={13} color={theme.teal} />
            <Text style={[styles.confidenceBadgeText, { color: theme.text }]}>
              Confidence: {detail.confidence}%
            </Text>
          </View>

          <View style={styles.intervalStatsRow}>
            <View style={styles.intervalStatCol}>
              <Text style={[styles.microLabel, { color: theme.mutedText }]}>
                AVERAGE INTERVAL
              </Text>
              <Text style={[styles.intervalBigValue, { color: theme.text }]}>
                {detail.avgIntervalDays} Days
              </Text>
            </View>
          </View>
        </View>

        {/* Prediction Window / Interval Spread */}
        <IntervalSpread
          startDay={detail.startDay}
          bestDay={detail.bestDay}
          deadlineDay={detail.deadlineDay}
        />

        {/* AI Insights Card */}
        <View
          style={[
            styles.insightsCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={[styles.brainIconCircle, { backgroundColor: theme.cardMuted }]}>
              <Brain size={18} color={theme.coral} />
            </View>
            <Text style={[styles.insightsTitle, { color: theme.text }]}>
              Remio Insights
            </Text>
          </View>

          <Text style={[styles.insightsBodyText, { color: theme.secondaryText }]}>
            {detail.insightsText}
          </Text>
        </View>

        {/* Model Learning Progress Card */}
        <Text style={[styles.sectionHeader, { color: theme.mutedText }]}>
          MODEL LEARNING PROGRESS
        </Text>
        <View
          style={[
            styles.learningProgressCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.learningProgressRow}>
            <View style={styles.leftProgress}>
              <History size={18} color={theme.text} />
              <Text style={[styles.learningLabel, { color: theme.text }]}>
                Calculated Interval
              </Text>
            </View>
            <View style={styles.progressValuesRow}>
              <Text style={[styles.oldValueText, { color: theme.mutedText }]}>
                {detail.lastPrediction}d
              </Text>
              <Text style={[styles.arrowText, { color: theme.coral }]}>→</Text>
              <Text style={[styles.newValueText, { color: theme.text }]}>
                {detail.newPrediction} Days
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Set Smart Reminder For Best Day"
            onPress={handleBookAppointment}
            variant="primary"
            size="lg"
            icon={<Calendar size={20} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    padding: 6,
  },
  btnPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topCard: {
    borderRadius: radii['4xl'],
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emojiIcon: {
    fontSize: 28,
  },
  taskTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    gap: 6,
    marginBottom: 16,
  },
  confidenceBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  intervalStatsRow: {
    alignItems: 'center',
  },
  intervalStatCol: {
    alignItems: 'center',
  },
  microLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  intervalBigValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  insightsCard: {
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    marginVertical: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  brainIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  insightsBodyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 4,
  },
  learningProgressCard: {
    borderRadius: radii['3xl'],
    padding: 18,
    borderWidth: 1,
    marginBottom: 24,
  },
  learningProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  learningLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  progressValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oldValueText: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '700',
  },
  newValueText: {
    fontSize: 16,
    fontWeight: '800',
  },
  buttonWrapper: {
    marginTop: 8,
  },
});
