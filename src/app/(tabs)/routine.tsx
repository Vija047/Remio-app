import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3 } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { HistoryItem } from '../../components/tasks/HistoryItem';
import { useTaskStore } from '../../store/useTaskStore';
import { useHaptics } from '../../hooks/useHaptics';

const FILTER_TABS: Array<'All' | 'Completed' | 'Overdue' | 'Upcoming'> = [
  'All',
  'Completed',
  'Overdue',
];

export default function RoutineHistoryScreen() {
  const haptics = useHaptics();
  const historyLogs = useTaskStore((s) => s.historyLogs);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const activeFilter = useTaskStore((s) => s.activeFilter);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const setActiveFilter = useTaskStore((s) => s.setActiveFilter);

  const filteredLogs = historyLogs.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const todayLogs = filteredLogs.filter((l) => l.section === 'Today');
  const yesterdayLogs = filteredLogs.filter((l) => l.section === 'Yesterday');
  const lastWeekLogs = filteredLogs.filter((l) => l.section === 'Last Week');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>
            See your recurring task activity over time.
          </Text>
        </View>

        {/* Search Input */}
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          isSearch
          containerStyle={styles.searchWrapper}
        />

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => {
                  haptics.light();
                  setActiveFilter(tab);
                }}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : styles.filterTextInactive,
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Grouped Logs: Today */}
        {todayLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today</Text>
            {todayLogs.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Grouped Logs: Yesterday */}
        {yesterdayLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yesterday</Text>
            {yesterdayLogs.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Grouped Logs: Last Week */}
        {lastWeekLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Last Week</Text>
            {lastWeekLogs.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Monthly Summary Card */}
        <View style={styles.monthlySummaryCard}>
          <View style={styles.summaryHeader}>
            <BarChart3 size={20} color={colors.primaryText} />
            <Text style={styles.summaryTitle}>Monthly Summary</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryTile}>
              <Text style={styles.microLabel}>TASKS COMPLETED</Text>
              <Text style={styles.summaryValue}>28</Text>
            </View>

            <View style={styles.summaryTile}>
              <Text style={styles.microLabel}>AVERAGE DELAY</Text>
              <View style={styles.delayValueRow}>
                <Text style={styles.summaryValue}>1.2</Text>
                <Text style={styles.unitText}>Days</Text>
              </View>
            </View>
          </View>

          <View style={styles.accuracyTile}>
            <Text style={styles.microLabel}>AI ACCURACY</Text>
            <Text style={styles.accuracyValue}>94%</Text>
          </View>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: radii.full,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterTextInactive: {
    color: colors.primaryText,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondaryText,
    marginBottom: 12,
  },
  monthlySummaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['4xl'],
    padding: 22,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F0F0F2',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.3,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  microLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  delayValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  accuracyTile: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  accuracyValue: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
});
