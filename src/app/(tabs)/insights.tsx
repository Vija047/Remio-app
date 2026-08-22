import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  RotateCw,
  Brain,
  Lightbulb,
  TrendingUp,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function InsightsScreen() {
  const theme = useTheme();
  const haptics = useHaptics();
  const tasks = useTaskStore((s) => s.tasks);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [insightsData, setInsightsData] = useState<{
    overallConsistency: number;
    tasksCompleted: number;
    currentStreak: number;
    avgCompletionDays: number;
    aiAccuracy: number;
    suggestionTitle: string;
    suggestionDesc: string;
  }>({
    overallConsistency: 0,
    tasksCompleted: 0,
    currentStreak: 0,
    avgCompletionDays: 0,
    aiAccuracy: 0,
    suggestionTitle: 'Remio Intelligence',
    suggestionDesc:
      'Log your routine completions consistently so our predictive model can pinpoint your ideal scheduling windows.',
  });

  const loadInsights = async () => {
    try {
      setLoading(true);
      const [insights, coach] = await Promise.all([
        api.getInsights().catch(() => null),
        api.getRoutineCoach().catch(() => null),
      ]);

      const completedCount = insights?.completedTasks ?? 0;
      const consistencyScore =
        insights?.onTimeCompletionPercentage !== null && insights?.onTimeCompletionPercentage !== undefined
          ? Math.round(insights.onTimeCompletionPercentage)
          : completedCount > 0
          ? 100
          : 0;

      const avgInterval =
        insights?.averageCompletionInterval !== null && insights?.averageCompletionInterval !== undefined
          ? Math.round(insights.averageCompletionInterval)
          : 0;

      const activeTasksWithPred = tasks.filter((t) => t.confidence > 0);
      const avgConfidence =
        activeTasksWithPred.length > 0
          ? Math.round(
              activeTasksWithPred.reduce((sum, t) => sum + t.confidence, 0) / activeTasksWithPred.length
            )
          : 0;

      const coachSummary =
        coach?.summary ||
        (insights?.mostConsistentTask
          ? `Your most consistent habit is ${insights.mostConsistentTask.title}. Keep it up!`
          : completedCount < 2
          ? 'Complete your routines at least twice so Remio can calculate accurate intervals and predictions.'
          : 'Great progress! Your routine habits are actively training the predictive model.');

      setInsightsData({
        overallConsistency: consistencyScore,
        tasksCompleted: completedCount,
        currentStreak: completedCount > 0 ? Math.min(completedCount, 30) : 0,
        avgCompletionDays: avgInterval,
        aiAccuracy: avgConfidence,
        suggestionTitle: 'Remio Insight',
        suggestionDesc: coachSummary,
      });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [tasks.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    haptics.light();
    await loadInsights();
    setRefreshing(false);
  };

  const handleEnableSmartMode = () => {
    haptics.success();
    Alert.alert(
      'Insight Acknowledged',
      'Remio will keep analyzing your completion patterns to optimize your routine intervals.'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={[styles.brandTitle, { color: theme.text }]}>Remio</Text>
          <Sparkles size={22} color={theme.text} />
        </View>

        {/* Title Area */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Insights</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Understand your recurring habits and optimize your routine schedule.
          </Text>
        </View>

        {/* Top Routine Health Card */}
        <View
          style={[
            styles.consistencyCard,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.topBadgeRow}>
            <View
              style={[
                styles.topPercentageBadge,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <TrendingUp size={13} color={theme.text} />
              <Text style={[styles.topBadgeText, { color: theme.text }]}>
                ROUTINE HEALTH
              </Text>
            </View>
          </View>

          <Text style={[styles.consistencyTitle, { color: theme.text }]}>
            Overall Consistency
          </Text>
          <Text style={[styles.consistencyDesc, { color: theme.secondaryText }]}>
            You're consistently completing your recurring routines.
          </Text>

          <View style={styles.ringWrapper}>
            <ProgressRing
              progress={insightsData.overallConsistency}
              size={160}
              strokeWidth={16}
              color={theme.primary}
              backgroundColor={theme.border}
            />
          </View>
        </View>

        {/* 4 Metric Cards */}
        <View style={styles.metricsContainer}>
          {/* Current Streak */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View>
              <Text style={[styles.microLabel, { color: theme.mutedText }]}>
                CURRENT STREAK
              </Text>
              <View style={styles.valueRow}>
                <Text style={[styles.metricNumber, { color: theme.text }]}>
                  {insightsData.currentStreak}
                </Text>
                <Text style={[styles.metricUnit, { color: theme.secondaryText }]}>
                  Days
                </Text>
              </View>
            </View>
            <View style={[styles.metricIconCircle, { backgroundColor: theme.card }]}>
              <Flame size={20} color={theme.text} />
            </View>
          </View>

          {/* Tasks Completed */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View>
              <Text style={[styles.microLabel, { color: theme.mutedText }]}>
                TASKS COMPLETED
              </Text>
              <Text style={[styles.metricNumber, { color: theme.text }]}>
                {insightsData.tasksCompleted}
              </Text>
            </View>
            <View style={[styles.metricIconCircle, { backgroundColor: theme.card }]}>
              <CheckCircle2 size={20} color={theme.text} />
            </View>
          </View>

          {/* Avg Interval */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View>
              <Text style={[styles.microLabel, { color: theme.mutedText }]}>
                AVERAGE INTERVAL
              </Text>
              <View style={styles.valueRow}>
                <Text style={[styles.metricNumber, { color: theme.text }]}>
                  {insightsData.avgCompletionDays}
                </Text>
                <Text style={[styles.metricUnit, { color: theme.secondaryText }]}>
                  Days
                </Text>
              </View>
            </View>
            <View style={[styles.metricIconCircle, { backgroundColor: theme.card }]}>
              <RotateCw size={20} color={theme.text} />
            </View>
          </View>

          {/* Prediction Confidence */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View>
              <Text style={[styles.microLabel, { color: theme.mutedText }]}>
                PREDICTION CONFIDENCE
              </Text>
              <Text style={[styles.metricNumber, { color: theme.text }]}>
                {insightsData.aiAccuracy}%
              </Text>
            </View>
            <View style={[styles.metricIconCircle, { backgroundColor: theme.card }]}>
              <Brain size={20} color={theme.text} />
            </View>
          </View>
        </View>

        {/* Suggestion Card */}
        <View
          style={[
            styles.suggestionCard,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.suggestionHeader}>
            <Lightbulb size={18} color={theme.text} />
            <Text style={[styles.suggestionTitle, { color: theme.text }]}>
              {insightsData.suggestionTitle}
            </Text>
          </View>

          <Text style={[styles.suggestionDesc, { color: theme.secondaryText }]}>
            {insightsData.suggestionDesc}
          </Text>

          <Button
            title="Acknowledge Insight"
            onPress={handleEnableSmartMode}
            size="md"
            variant="primary"
            style={styles.suggestionBtn}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  consistencyCard: {
    borderRadius: radii['4xl'],
    padding: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  topBadgeRow: {
    marginBottom: 12,
  },
  topPercentageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 6,
    borderWidth: 1,
  },
  topBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  consistencyTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  consistencyDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  metricsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  microLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  metricUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  suggestionCard: {
    borderRadius: radii['4xl'],
    padding: 24,
    borderWidth: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  suggestionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  suggestionDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  suggestionBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
});
