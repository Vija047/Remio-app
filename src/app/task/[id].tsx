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
  ChevronLeft,
  Edit2,
  Sparkles,
  Scissors,
  CheckCircle,
  Calendar,
  Trash2,
  History,
  Check,
  Sprout,
  Car,
  Pill,
  Home,
  FileText,
  PawPrint,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();

  const tasks = useTaskStore((s) => s.tasks);
  const toggleTaskCompleted = useTaskStore((s) => s.toggleTaskCompleted);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [loadingAction, setLoadingAction] = useState(false);

  const task = tasks.find((t) => t.id === id);

  const getTaskIcon = () => {
    if (!task) return <FileText size={26} color={theme.text} />;
    const titleLower = (task.title + ' ' + task.category).toLowerCase();
    if (titleLower.includes('haircut') || titleLower.includes('scissors') || titleLower.includes('personal')) {
      return <Scissors size={26} color={theme.text} />;
    }
    if (titleLower.includes('plant') || titleLower.includes('water')) {
      return <Sprout size={26} color="#10B981" />;
    }
    if (titleLower.includes('car') || titleLower.includes('oil')) {
      return <Car size={26} color="#3B82F6" />;
    }
    if (titleLower.includes('medicine') || titleLower.includes('pill') || titleLower.includes('health')) {
      return <Pill size={26} color="#EF4444" />;
    }
    if (titleLower.includes('filter') || titleLower.includes('home')) {
      return <Home size={26} color="#F59E0B" />;
    }
    if (titleLower.includes('pet') || titleLower.includes('dog') || titleLower.includes('cat')) {
      return <PawPrint size={26} color="#8B5CF6" />;
    }
    return <FileText size={26} color={theme.text} />;
  };

  const handleCompleteToday = async () => {
    if (!task) return;
    try {
      setLoadingAction(true);
      haptics.success();
      await toggleTaskCompleted(task.id);
    } catch {
      Alert.alert('Error', 'Could not record completion.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = () => {
    if (!task) return;
    haptics.error();
    Alert.alert('Delete Task', `Are you sure you want to delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(task.id);
          router.back();
        },
      },
    ]);
  };

  const handleReschedule = () => {
    if (!task) return;
    haptics.light();
    Alert.alert('Reschedule Routine', 'Select a reminder adjustment:', [
      {
        text: 'Remind in 1 Week',
        onPress: async () => {
          await updateTask(task.id, { reminderEnabled: true, reminderTime: '09:00' });
          Alert.alert('Updated', 'Reminder set for next week.');
        },
      },
      {
        text: 'Turn Off Reminders',
        onPress: async () => {
          await updateTask(task.id, { reminderEnabled: false });
          Alert.alert('Updated', 'Reminders paused.');
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleViewAIPrediction = () => {
    if (!task) return;
    haptics.light();
    router.push({
      pathname: '/ai/prediction',
      params: { id: task.id, title: task.title, emoji: task.emoji },
    });
  };

  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={26} color={theme.text} />
          </Pressable>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: theme.text }]}>Routine not found</Text>
          <Button title="Go Back" onPress={() => router.back()} size="md" variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ChevronLeft size={26} color={theme.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {task.title}
        </Text>

        <Pressable
          onPress={handleViewAIPrediction}
          style={({ pressed }) => [styles.editBtn, pressed && styles.btnPressed]}
        >
          <Sparkles size={20} color={theme.coral} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Status Card */}
        <Pressable
          onPress={handleViewAIPrediction}
          style={({ pressed }) => [
            styles.statusCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.statusCardTop}>
            <View style={styles.statusTitleRow}>
              <View style={[styles.sparkleCircle, { backgroundColor: theme.cardMuted }]}>
                <Sparkles size={16} color={theme.coral} />
              </View>
              <Text style={[styles.statusLabel, { color: theme.text }]}>
                AI Routine Status
              </Text>
            </View>

            <View
              style={[
                styles.aiPredictionBadge,
                { backgroundColor: theme.cardMuted, borderColor: theme.border },
              ]}
            >
              <View style={[styles.badgeDot, { backgroundColor: theme.teal }]} />
              <Text style={[styles.aiPredictionText, { color: theme.text }]}>
                AI PREDICTION
              </Text>
            </View>
          </View>

          <View style={[styles.smartWindowRow, { borderBottomColor: theme.divider }]}>
            <View>
              <Text style={[styles.subtext, { color: theme.secondaryText }]}>
                Smart Window
              </Text>
              <Text style={[styles.windowStatusText, { color: theme.text }]}>
                {task.smartWindowStatus}
              </Text>
            </View>
            <View
              style={[
                styles.categoryIconCircle,
                { backgroundColor: theme.cardMuted },
              ]}
            >
              {getTaskIcon()}
            </View>
          </View>

          <View style={styles.confidenceSection}>
            <View style={styles.confidenceLabelsRow}>
              <View>
                <Text style={[styles.confidenceSubtext, { color: theme.secondaryText }]}>
                  Best Target Day
                </Text>
                <Text style={[styles.bestDayValue, { color: theme.text }]}>
                  {task.dueLabel}
                </Text>
              </View>

              <View style={styles.confidenceRightCol}>
                <Text style={[styles.confidenceSubtext, { color: theme.secondaryText }]}>
                  Confidence
                </Text>
                <Text style={[styles.confidenceValueText, { color: theme.teal }]}>
                  {task.confidence}%
                </Text>
              </View>
            </View>

            <ProgressBar
              progress={task.confidence}
              height={6}
              color={theme.teal}
              backgroundColor={theme.border}
              style={styles.confidenceBar}
            />
          </View>
        </Pressable>

        {/* Quick Action Buttons (Mark Complete, Reschedule, Delete) */}
        <View style={styles.quickActionsRow}>
          <Pressable
            onPress={handleCompleteToday}
            style={({ pressed }) => [
              styles.actionPill,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
              pressed && styles.actionPressed,
            ]}
          >
            <View style={styles.actionIconCircle}>
              <CheckCircle size={20} color={task.completed ? theme.green : theme.text} />
            </View>
            <Text style={[styles.actionPillText, { color: theme.text }]}>
              {task.completed ? 'Completed' : 'Mark Complete'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleReschedule}
            style={({ pressed }) => [
              styles.actionPill,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
              pressed && styles.actionPressed,
            ]}
          >
            <View style={styles.actionIconCircle}>
              <Calendar size={20} color={theme.text} />
            </View>
            <Text style={[styles.actionPillText, { color: theme.text }]}>
              Reschedule
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.actionPill,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
              pressed && styles.actionPressed,
            ]}
          >
            <View style={styles.actionIconCircle}>
              <Trash2 size={20} color={theme.red} />
            </View>
            <Text style={[styles.actionPillText, { color: theme.red }]}>
              Delete
            </Text>
          </Pressable>
        </View>

        {/* History Timeline */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <History size={20} color={theme.text} />
            <Text style={[styles.historyTitle, { color: theme.text }]}>
              Completion History
            </Text>
          </View>

          <View style={styles.timelineWrapper}>
            <View
              style={[
                styles.verticalTimelineLine,
                { backgroundColor: theme.border },
              ]}
            />

            {task.history.length === 0 ? (
              <Text style={[styles.noHistoryText, { color: theme.secondaryText }]}>
                No completion logs recorded yet. Tap "Completed Today" below!
              </Text>
            ) : (
              task.history.map((hist, index) => {
                const isFirst = index === 0;
                return (
                  <View key={hist.id} style={styles.timelineRow}>
                    <View
                      style={[
                        styles.timelineNode,
                        {
                          backgroundColor: theme.card,
                          borderColor: isFirst ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      {isFirst && (
                        <View
                          style={[
                            styles.nodeInnerDot,
                            { backgroundColor: theme.primary },
                          ]}
                        />
                      )}
                    </View>

                    <View
                      style={[
                        styles.historyTile,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.cardBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.historyCompletedText, { color: theme.text }]}>
                        {hist.notes || 'Completed'}
                      </Text>
                      <Text style={[styles.historyDateText, { color: theme.secondaryText }]}>
                        {hist.formattedDate}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Button */}
      <View
        style={[
          styles.bottomFooter,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.divider,
          },
        ]}
      >
        <Button
          title={
            loadingAction
              ? 'Updating...'
              : task.completed
              ? 'Completed Today ✓'
              : 'Completed Today'
          }
          onPress={handleCompleteToday}
          variant="primary"
          size="lg"
          disabled={loadingAction}
          icon={<Check size={20} color="#FFFFFF" strokeWidth={3} />}
        />
      </View>
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
  editBtn: {
    padding: 6,
  },
  btnPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  statusCard: {
    borderRadius: radii['3xl'],
    padding: 22,
    borderWidth: 1,
    marginBottom: 24,
  },
  cardPressed: {
    opacity: 0.95,
  },
  statusCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  aiPredictionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 6,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  aiPredictionText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  smartWindowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 18,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  subtext: {
    fontSize: 13,
    marginBottom: 4,
  },
  windowStatusText: {
    fontSize: 26,
    fontWeight: '800',
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confidenceSection: {},
  confidenceLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  confidenceSubtext: {
    fontSize: 13,
    marginBottom: 2,
  },
  bestDayValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  confidenceRightCol: {
    alignItems: 'flex-end',
  },
  confidenceValueText: {
    fontSize: 18,
    fontWeight: '800',
  },
  confidenceBar: {
    marginTop: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 32,
  },
  actionPill: {
    flex: 1,
    borderRadius: radii['2xl'],
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionIconCircle: {
    marginBottom: 2,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  historySection: {
    marginTop: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  timelineWrapper: {
    position: 'relative',
    paddingLeft: 36,
    gap: 12,
  },
  verticalTimelineLine: {
    position: 'absolute',
    left: 9,
    top: 24,
    bottom: 24,
    width: 2,
  },
  timelineRow: {
    position: 'relative',
  },
  timelineNode: {
    position: 'absolute',
    left: -36,
    top: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyTile: {
    borderRadius: radii['2xl'],
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyCompletedText: {
    fontSize: 15,
    fontWeight: '600',
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noHistoryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
