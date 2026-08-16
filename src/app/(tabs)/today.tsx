import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  AlertTriangle,
  Check,
  Plus,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Avatar } from '../../components/ui/Avatar';
import { TaskCard } from '../../components/tasks/TaskCard';
import { useTaskStore } from '../../store/useTaskStore';
import { useUserStore } from '../../store/useUserStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function TodayScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const user = useUserStore((s) => s.user);
  const tasks = useTaskStore((s) => s.tasks);

  const todayTasksCount = tasks.filter((t) => !t.completed).length;
  const upcomingCount = tasks.filter((t) => t.dueLabel === 'Next Week' || t.dueLabel === 'Tomorrow').length;
  const overdueCount = tasks.filter((t) => t.dueLabel === 'Overdue').length;

  const handleAddTask = () => {
    haptics.light();
    router.push('/task/add');
  };

  const handleAvatarPress = () => {
    haptics.light();
    router.push('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Greeting & Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Good Morning 👋</Text>
            <Text style={styles.userName}>{user.name || 'Vijay'}</Text>
          </View>

          <Pressable onPress={handleAvatarPress}>
            <Avatar url={user.avatarUrl} size={50} />
          </Pressable>
        </View>

        {/* Today's Tasks Banner Card */}
        <View style={styles.todayCard}>
          <View style={styles.todayCardTop}>
            <View style={styles.checkIconCircle}>
              <Check size={18} color={colors.primaryText} strokeWidth={2.5} />
            </View>
            <Text style={styles.todayBigNumber}>{todayTasksCount}</Text>
          </View>

          <View style={styles.todayCardBottom}>
            <Text style={styles.todayCardTitle}>Today's Tasks</Text>
            <View style={styles.todayUnderline} />
          </View>

          {/* Watermark circle graphic */}
          <View style={styles.watermarkCircle}>
            <Check size={54} color="#E5E7EB" strokeWidth={3} />
          </View>
        </View>

        {/* 2-Column Stat Cards (Upcoming / Overdue) */}
        <View style={styles.statsRow}>
          {/* Upcoming Card */}
          <View style={styles.statCardLeft}>
            <Calendar size={22} color={colors.primaryText} />
            <Text style={styles.statNumber}>{upcomingCount || 5}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>

          {/* Overdue Card (Black Border Highlight) */}
          <View style={styles.statCardRight}>
            <AlertTriangle size={22} color={colors.primaryText} />
            <Text style={styles.statNumber}>{overdueCount || 1}</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>

        {/* Active Agenda Section */}
        <View style={styles.agendaSection}>
          <Text style={styles.sectionTitle}>Active Agenda</Text>

          <View style={styles.tasksList}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button (+ Add Task) */}
      <Pressable
        onPress={handleAddTask}
        style={({ pressed }) => [styles.fabButton, pressed && styles.fabPressed]}
      >
        <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.fabText}>Add Task</Text>
      </Pressable>
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
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 15,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  todayCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['4xl'],
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F2',
    position: 'relative',
    overflow: 'hidden',
  },
  todayCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  checkIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  todayBigNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -1,
  },
  todayCardBottom: {
    marginTop: 24,
  },
  todayCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryText,
    letterSpacing: -0.3,
  },
  todayUnderline: {
    width: 140,
    height: 3.5,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 8,
  },
  watermarkCircle: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    borderColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCardLeft: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: radii['3xl'],
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0F0F2',
    justifyContent: 'space-between',
    minHeight: 120,
  },
  statCardRight: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: radii['3xl'],
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  statNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  agendaSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  tasksList: {
    gap: 4,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingHorizontal: 22,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
