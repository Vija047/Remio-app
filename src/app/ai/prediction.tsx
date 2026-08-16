import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Scissors,
  Sparkles,
  History,
  Calendar,
  Brain,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Button } from '../../components/ui/Button';
import { IntervalSpread } from '../../components/insights/IntervalSpread';
import { HAIRCUT_PREDICTION_DETAIL } from '../../data/mock';
import { useHaptics } from '../../hooks/useHaptics';

export default function AIPredictionDetailsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const detail = HAIRCUT_PREDICTION_DETAIL;

  const handleBookAppointment = () => {
    haptics.success();
    Alert.alert(
      'Appointment Reminder Set',
      'RoutineAI set an optimal heads-up alert for tomorrow at 10:00 AM.'
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={colors.primaryText} />
        </Pressable>
        <Text style={styles.headerTitle}>AI Prediction</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Card */}
        <View style={styles.topCard}>
          <View style={styles.iconCircle}>
            <Scissors size={28} color={colors.primaryText} />
          </View>

          <Text style={styles.taskTitle}>{detail.title}</Text>

          <View style={styles.confidenceBadge}>
            <Sparkles size={12} color={colors.primaryText} />
            <Text style={styles.confidenceBadgeText}>
              Confidence: {detail.confidence}%
            </Text>
          </View>

          <View style={styles.intervalStatsRow}>
            <View style={styles.intervalStatCol}>
              <Text style={styles.microLabel}>AVERAGE INTERVAL</Text>
              <Text style={styles.intervalBigValue}>
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
        <View style={styles.insightsCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.brainIconCircle}>
              <Brain size={18} color={colors.primaryText} />
            </View>
            <Text style={styles.insightsTitle}>AI Insights</Text>
          </View>

          <Text style={styles.insightsBodyText}>{detail.insightsText}</Text>
        </View>

        {/* Model Learning Progress Card */}
        <Text style={styles.sectionHeader}>MODEL LEARNING PROGRESS</Text>
        <View style={styles.learningProgressCard}>
          <View style={styles.learningProgressRow}>
            <View style={styles.leftProgress}>
              <History size={18} color={colors.primaryText} />
              <Text style={styles.learningLabel}>Last Prediction</Text>
            </View>
            <View style={styles.progressValuesRow}>
              <Text style={styles.oldValueText}>{detail.lastPrediction} Days</Text>
              <Text style={styles.arrowText}>→</Text>
              <Text style={styles.newValueText}>{detail.newPrediction} Days</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Book Appointment Tomorrow"
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
    backgroundColor: '#FFFFFF',
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
    color: colors.primaryText,
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
    backgroundColor: '#FFFFFF',
    borderRadius: radii['4xl'],
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  taskTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    gap: 6,
    marginBottom: 16,
  },
  confidenceBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryText,
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
    color: '#8E8E93',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  intervalBigValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryText,
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primaryText,
  },
  insightsBodyText: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
    marginLeft: 4,
  },
  learningProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: colors.primaryText,
  },
  progressValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oldValueText: {
    fontSize: 15,
    color: colors.mutedText,
    textDecorationLine: 'line-through',
  },
  arrowText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  newValueText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryText,
  },
  buttonWrapper: {
    marginTop: 8,
  },
});
