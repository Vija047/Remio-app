import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
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
  User,
  PawPrint,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { useTaskStore } from '../../store/useTaskStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const haptics = useHaptics();

  const tasks = useTaskStore((s) => s.tasks);
  const toggleTaskCompleted = useTaskStore((s) => s.toggleTaskCompleted);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const task = tasks.find((t) => t.id === id) || tasks[3] || tasks[0];

  const getTaskIcon = () => {
    const titleLower = task.title.toLowerCase();
    if (titleLower.includes('haircut') || titleLower.includes('scissors')) {
      return <Scissors size={26} color={colors.primaryText} />;
    }
    if (titleLower.includes('plant') || titleLower.includes('water')) {
      return <Sprout size={26} color="#10B981" />;
    }
    if (titleLower.includes('car') || titleLower.includes('oil')) {
      return <Car size={26} color="#3B82F6" />;
    }
    if (titleLower.includes('medicine') || titleLower.includes('pill')) {
      return <Pill size={26} color="#EF4444" />;
    }
    if (titleLower.includes('filter') || titleLower.includes('home')) {
      return <Home size={26} color="#F59E0B" />;
    }
    if (titleLower.includes('pet') || titleLower.includes('dog') || titleLower.includes('cat')) {
      return <PawPrint size={26} color="#8B5CF6" />;
    }
    return <FileText size={26} color={colors.primaryText} />;
  };

  const handleCompleteToday = () => {
    haptics.success();
    toggleTaskCompleted(task.id);
  };

  const handleDelete = () => {
    haptics.error();
    Alert.alert('Delete Task', `Are you sure you want to delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          router.back();
        },
      },
    ]);
  };

  const handleReschedule = () => {
    haptics.light();
    Alert.alert('Reschedule Task', 'Select next target window:', [
      { text: 'Next Week' },
      { text: 'In 2 Weeks' },
      { text: 'Custom Date' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleViewAIPrediction = () => {
    haptics.light();
    router.push('/ai/prediction');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ChevronLeft size={26} color={colors.primaryText} />
        </Pressable>

        <Text style={styles.headerTitle}>{task.title}</Text>

        <Pressable
          onPress={handleViewAIPrediction}
          style={({ pressed }) => [styles.editBtn, pressed && styles.btnPressed]}
        >
          <Edit2 size={20} color={colors.primaryText} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Status Card */}
        <Pressable
          onPress={handleViewAIPrediction}
          style={({ pressed }) => [styles.statusCard, pressed && styles.cardPressed]}
        >
          <View style={styles.statusCardTop}>
            <View style={styles.statusTitleRow}>
              <View style={styles.sparkleCircle}>
                <Sparkles size={16} color={colors.primaryText} />
              </View>
              <View>
                <Text style={styles.statusLabel}>Current Status</Text>
              </View>
            </View>

            <View style={styles.aiPredictionBadge}>
              <View style={styles.badgeDot} />
              <Text style={styles.aiPredictionText}>AI PREDICTION</Text>
            </View>
          </View>

          <View style={styles.smartWindowRow}>
            <View>
              <Text style={styles.subtext}>Smart Window</Text>
              <Text style={styles.windowStatusText}>{task.smartWindowStatus}</Text>
            </View>
            <View style={styles.categoryIconCircle}>
              {getTaskIcon()}
            </View>
          </View>

          <View style={styles.confidenceSection}>
            <View style={styles.confidenceLabelsRow}>
              <View>
                <Text style={styles.confidenceSubtext}>Best Day</Text>
                <Text style={styles.bestDayValue}>{task.dueLabel}</Text>
              </View>

              <View style={styles.confidenceRightCol}>
                <Text style={styles.confidenceSubtext}>Confidence</Text>
                <Text style={styles.confidenceValueText}>{task.confidence}%</Text>
              </View>
            </View>

            <ProgressBar
              progress={task.confidence}
              height={6}
              color="#00B8D9"
              backgroundColor="#E5E7EB"
              style={styles.confidenceBar}
            />
          </View>
        </Pressable>

        {/* Quick Action Buttons (Mark Complete, Reschedule, Delete) */}
        <View style={styles.quickActionsRow}>
          <Pressable
            onPress={handleCompleteToday}
            style={({ pressed }) => [styles.actionPill, pressed && styles.actionPressed]}
          >
            <View style={styles.actionIconCircle}>
              <CheckCircle size={20} color={colors.primaryText} />
            </View>
            <Text style={styles.actionPillText}>
              {task.completed ? 'Completed' : 'Mark Complete'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleReschedule}
            style={({ pressed }) => [styles.actionPill, pressed && styles.actionPressed]}
          >
            <View style={styles.actionIconCircle}>
              <Calendar size={20} color={colors.primaryText} />
            </View>
            <Text style={styles.actionPillText}>Reschedule</Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [styles.actionPill, pressed && styles.actionPressed]}
          >
            <View style={styles.actionIconCircle}>
              <Trash2 size={20} color={colors.red} />
            </View>
            <Text style={[styles.actionPillText, { color: colors.red }]}>Delete</Text>
          </Pressable>
        </View>

        {/* History Timeline */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <History size={20} color={colors.primaryText} />
            <Text style={styles.historyTitle}>History</Text>
          </View>

          <View style={styles.timelineWrapper}>
            {/* Vertical timeline line */}
            <View style={styles.verticalTimelineLine} />

            {task.history.map((hist, index) => {
              const isFirst = index === 0;
              return (
                <View key={hist.id} style={styles.timelineRow}>
                  {/* Node Circle */}
                  <View style={[styles.timelineNode, isFirst && styles.timelineNodeActive]}>
                    {isFirst && <View style={styles.nodeInnerDot} />}
                  </View>

                  {/* Tile */}
                  <View style={[styles.historyTile, isFirst && styles.historyTileActive]}>
                    <Text style={styles.historyCompletedText}>Completed</Text>
                    <Text style={styles.historyDateText}>{hist.formattedDate}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Action Button */}
      <View style={styles.bottomFooter}>
        <Button
          title={task.completed ? 'Task Completed' : 'Completed Today'}
          onPress={handleCompleteToday}
          variant="primary"
          size="lg"
          icon={<Check size={20} color="#FFFFFF" strokeWidth={3} />}
        />
      </View>
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
  editBtn: {
    padding: 6,
  },
  btnPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    padding: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryText,
  },
  aiPredictionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    gap: 6,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B8D9',
  },
  aiPredictionText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: 0.6,
  },
  smartWindowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  windowStatusText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryText,
  },
  categoryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
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
    color: colors.secondaryText,
    marginBottom: 2,
  },
  bestDayValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
  },
  confidenceRightCol: {
    alignItems: 'flex-end',
  },
  confidenceValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00B8D9',
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
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionPressed: {
    backgroundColor: '#F3F4F6',
  },
  actionIconCircle: {
    marginBottom: 2,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryText,
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
    color: colors.primaryText,
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
    backgroundColor: '#E5E7EB',
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
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNodeActive: {
    borderColor: colors.primary,
  },
  nodeInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  historyTile: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTileActive: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E7EB',
  },
  historyCompletedText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryText,
  },
  historyDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
});
