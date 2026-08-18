import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  AlertTriangle,
  Check,
  Plus,
  Sparkles,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Avatar } from '../../components/ui/Avatar';
import { TaskCard } from '../../components/tasks/TaskCard';
import { Button } from '../../components/ui/Button';
import { useTaskStore } from '../../store/useTaskStore';
import { useUserStore } from '../../store/useUserStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function TodayScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const theme = useTheme();
  const user = useUserStore((s) => s.user);
  const tasks = useTaskStore((s) => s.tasks);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const isLoading = useTaskStore((s) => s.isLoading);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks().catch(() => {});
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    haptics.light();
    await fetchTasks().catch(() => {});
    setRefreshing(false);
  };

  const todayTasksCount = tasks.filter((t) => !t.completed).length;
  const upcomingCount = tasks.filter((t) => t.dueLabel === 'Next Week' || t.dueLabel === 'Tomorrow' || t.dueLabel === 'In 2 Weeks').length;
  const overdueCount = tasks.filter((t) => t.dueLabel === 'Overdue').length;

  const handleAddTask = () => {
    haptics.light();
    router.push('/task/add');
  };

  const handleAvatarPress = () => {
    haptics.light();
    router.push('/(tabs)/profile');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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
            colors={[theme.coral]}
          />
        }
      >
        {/* Header with Greeting & Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greetingText, { color: theme.secondaryText }]}>
              {getGreeting()} 👋
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user.name || 'Vijay'}
            </Text>
          </View>

          <Pressable onPress={handleAvatarPress}>
            <Avatar url={user.avatarUrl} size={50} />
          </Pressable>
        </View>

        {/* Today's Tasks Banner Card */}
        <View
          style={[
            styles.todayCard,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.todayCardTop}>
            <View
              style={[
                styles.checkIconCircle,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Check size={18} color={theme.text} strokeWidth={2.5} />
            </View>
            <Text style={[styles.todayBigNumber, { color: theme.text }]}>
              {todayTasksCount}
            </Text>
          </View>

          <View style={styles.todayCardBottom}>
            <Text style={[styles.todayCardTitle, { color: theme.text }]}>
              Pending Routine Tasks
            </Text>
            <View
              style={[styles.todayUnderline, { backgroundColor: theme.primary }]}
            />
          </View>

          {/* Watermark circle graphic */}
          <View style={styles.watermarkCircle}>
            <Check size={54} color={theme.isDark ? '#232733' : '#E5E7EB'} strokeWidth={3} />
          </View>
        </View>

        {/* 2-Column Stat Cards (Upcoming / Overdue) */}
        <View style={styles.statsRow}>
          {/* Upcoming Card */}
          <View
            style={[
              styles.statCardLeft,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Calendar size={22} color={theme.text} />
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {upcomingCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Upcoming
            </Text>
          </View>

          {/* Overdue Card */}
          <View
            style={[
              styles.statCardRight,
              {
                backgroundColor: theme.cardMuted,
                borderColor: overdueCount > 0 ? theme.red : theme.cardBorder,
              },
            ]}
          >
            <AlertTriangle
              size={22}
              color={overdueCount > 0 ? theme.red : theme.text}
            />
            <Text
              style={[
                styles.statNumber,
                { color: overdueCount > 0 ? theme.red : theme.text },
              ]}
            >
              {overdueCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              Overdue
            </Text>
          </View>
        </View>

        {/* Active Agenda Section */}
        <View style={styles.agendaSection}>
          <View style={styles.agendaTitleRow}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Active Routines
            </Text>
            {isLoading && !refreshing && (
              <ActivityIndicator size="small" color={theme.coral} />
            )}
          </View>

          {tasks.length === 0 && !isLoading ? (
            <View
              style={[
                styles.emptyStateCard,
                {
                  backgroundColor: theme.cardMuted,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.emptyIconCircle}>
                <Sparkles size={26} color={theme.coral} />
              </View>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Routines Yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.secondaryText }]}>
                Add your recurring tasks like haircuts, plants, filters, or medicines to get smart AI predictions.
              </Text>
              <Button
                title="+ Add Your First Routine"
                onPress={handleAddTask}
                variant="coral"
                size="md"
                style={styles.emptyAddBtn}
              />
            </View>
          ) : (
            <View style={styles.tasksList}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button (+ Add Task) */}
      <Pressable
        onPress={handleAddTask}
        style={({ pressed }) => [
          styles.fabButton,
          { backgroundColor: theme.primary },
          pressed && styles.fabPressed,
        ]}
      >
        <Plus
          size={20}
          color={theme.isDark ? '#0B0C10' : '#FFFFFF'}
          strokeWidth={2.5}
        />
        <Text
          style={[
            styles.fabText,
            { color: theme.isDark ? '#0B0C10' : '#FFFFFF' },
          ]}
        >
          Add Task
        </Text>
      </Pressable>
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
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  todayCard: {
    borderRadius: radii['4xl'],
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  todayBigNumber: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  todayCardBottom: {
    marginTop: 24,
  },
  todayCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  todayUnderline: {
    width: 140,
    height: 3.5,
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
    borderColor: 'transparent',
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
    borderRadius: radii['3xl'],
    padding: 18,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  statCardRight: {
    flex: 1,
    borderRadius: radii['3xl'],
    padding: 18,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  statNumber: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  agendaSection: {
    marginTop: 4,
  },
  agendaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  tasksList: {
    gap: 4,
  },
  emptyStateCard: {
    borderRadius: radii['3xl'],
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  emptyAddBtn: {
    marginTop: 8,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
