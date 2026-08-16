import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Button } from '../../components/ui/Button';
import { INITIAL_INSIGHTS } from '../../data/mock';
import { useHaptics } from '../../hooks/useHaptics';

export default function InsightsScreen() {
  const haptics = useHaptics();
  const insights = INITIAL_INSIGHTS;

  const handleEnableSmartMode = () => {
    haptics.success();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>RoutineAI</Text>
          <Sparkles size={24} color={colors.primary} />
        </View>

        {/* Title Area */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>
            Understand your recurring habits and let RoutineAI optimize your schedule for frictionless productivity.
          </Text>
        </View>

        {/* Top Overall Consistency Card with SVG Ring */}
        <View style={styles.consistencyCard}>
          <View style={styles.topBadgeRow}>
            <View style={styles.topPercentageBadge}>
              <TrendingUp size={13} color="#374151" />
              <Text style={styles.topBadgeText}>Top 5% of users</Text>
            </View>
          </View>

          <Text style={styles.consistencyTitle}>Overall Consistency</Text>
          <Text style={styles.consistencyDesc}>
            Your habit formation is incredibly stable this month. You're maintaining a high completion rate across all categories.
          </Text>

          <View style={styles.ringWrapper}>
            <ProgressRing
              progress={insights.overallConsistency}
              size={170}
              strokeWidth={18}
              color={colors.primary}
              backgroundColor="#E5E7EB"
            />
          </View>
        </View>

        {/* 4 Metric Cards */}
        <View style={styles.metricsContainer}>
          {/* Current Streak */}
          <View style={styles.metricCard}>
            <View>
              <Text style={styles.microLabel}>CURRENT STREAK</Text>
              <View style={styles.valueRow}>
                <Text style={styles.metricNumber}>{insights.currentStreak}</Text>
                <Text style={styles.metricUnit}>Days</Text>
              </View>
            </View>
            <View style={styles.metricIconCircle}>
              <Flame size={20} color={colors.primary} />
            </View>
          </View>

          {/* Tasks Completed */}
          <View style={styles.metricCard}>
            <View>
              <Text style={styles.microLabel}>TASKS COMPLETED</Text>
              <Text style={styles.metricNumber}>{insights.tasksCompleted}</Text>
            </View>
            <View style={styles.metricIconCircle}>
              <CheckCircle2 size={20} color={colors.primary} />
            </View>
          </View>

          {/* Avg Completion */}
          <View style={styles.metricCard}>
            <View>
              <Text style={styles.microLabel}>AVG. COMPLETION</Text>
              <View style={styles.valueRow}>
                <Text style={styles.metricNumber}>{insights.avgCompletionDays}</Text>
                <Text style={styles.metricUnit}>Days</Text>
              </View>
            </View>
            <View style={styles.metricIconCircle}>
              <RotateCw size={20} color={colors.primary} />
            </View>
          </View>

          {/* AI Accuracy */}
          <View style={styles.metricCard}>
            <View>
              <Text style={styles.microLabel}>AI ACCURACY</Text>
              <Text style={styles.metricNumber}>{insights.aiAccuracy}%</Text>
            </View>
            <View style={styles.metricIconCircle}>
              <Brain size={20} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* RoutineAI Suggestion Card */}
        <View style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <Lightbulb size={18} color={colors.primaryText} />
            <Text style={styles.suggestionTitle}>RoutineAI Suggestion</Text>
          </View>

          <Text style={styles.suggestionDesc}>
            {insights.suggestion.description}
          </Text>

          <Button
            title={insights.suggestion.cta}
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
    backgroundColor: '#FFFFFF',
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
    color: colors.primaryText,
    letterSpacing: -0.4,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
  },
  consistencyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['4xl'],
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0F0F2',
    marginBottom: 20,
  },
  topBadgeRow: {
    marginBottom: 12,
  },
  topPercentageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 6,
  },
  topBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  consistencyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  consistencyDesc: {
    fontSize: 14,
    color: colors.secondaryText,
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
    backgroundColor: '#F8F9FA',
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  microLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
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
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  metricUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  metricIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['4xl'],
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0F0F2',
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
    color: colors.primaryText,
  },
  suggestionDesc: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 20,
  },
  suggestionBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
});
