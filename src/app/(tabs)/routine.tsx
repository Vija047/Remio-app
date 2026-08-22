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
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3, History, Sparkles } from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { HistoryItem } from '../../components/tasks/HistoryItem';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

const FILTER_TABS: Array<'All' | 'Completed' | 'Overdue' | 'Upcoming'> = [
  'All',
  'Completed',
  'Overdue',
];

export default function RoutineHistoryScreen() {
  const theme = useTheme();
  const haptics = useHaptics();
  const historyLogs = useTaskStore((s) => s.historyLogs);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const activeFilter = useTaskStore((s) => s.activeFilter);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const setActiveFilter = useTaskStore((s) => s.setActiveFilter);
  const fetchHistory = useTaskStore((s) => s.fetchHistory);

  const [refreshing, setRefreshing] = useState(false);
  const [onTimeRate, setOnTimeRate] = useState<number | null>(null);

  const loadSummary = async () => {
    try {
      const { api } = await import('../../services/api');
      const insights = await api.getInsights().catch(() => null);
      if (insights && insights.onTimeCompletionPercentage !== null && insights.onTimeCompletionPercentage !== undefined) {
        setOnTimeRate(Math.round(insights.onTimeCompletionPercentage));
      } else if (historyLogs.length > 0) {
        setOnTimeRate(100);
      } else {
        setOnTimeRate(null);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchHistory().catch(() => {});
    loadSummary();
  }, [historyLogs.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    haptics.light();
    await Promise.all([fetchHistory().catch(() => {}), loadSummary()]);
    setRefreshing(false);
  };

  const filteredLogs = historyLogs.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const todayLogs = filteredLogs.filter((l) => l.section === 'Today');
  const yesterdayLogs = filteredLogs.filter((l) => l.section === 'Yesterday');
  const lastWeekLogs = filteredLogs.filter((l) => l.section === 'Last Week');
  const earlierLogs = filteredLogs.filter((l) => l.section === 'Earlier');

  const totalCompletions = historyLogs.length;

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
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Activity History</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Activity logs and completion patterns over time.
          </Text>
        </View>

        {/* Search Input */}
        <Input
          placeholder="Search task completions..."
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
                  {
                    backgroundColor: isActive ? theme.primary : theme.pillBackground,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isActive
                        ? theme.isDark
                          ? '#0B0C10'
                          : '#FFFFFF'
                        : theme.text,
                    },
                  ]}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Empty state when no history */}
        {filteredLogs.length === 0 && (
          <View
            style={[
              styles.emptyHistoryCard,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <History size={32} color={theme.mutedText} />
            <Text style={[styles.emptyHistoryTitle, { color: theme.text }]}>
              No Activity Logged Yet
            </Text>
            <Text style={[styles.emptyHistorySubtitle, { color: theme.secondaryText }]}>
              Complete your recurring routines to build your habit history.
            </Text>
          </View>
        )}

        {/* Grouped Logs: Today */}
        {todayLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Today</Text>
            {todayLogs.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Grouped Logs: Yesterday */}
        {yesterdayLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Yesterday</Text>
            {yesterdayLogs.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Grouped Logs: Last Week */}
        {lastWeekLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Last Week</Text>
            {lastWeekLogs.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Grouped Logs: Earlier */}
        {earlierLogs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Earlier</Text>
            {earlierLogs.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* Monthly Summary Card */}
        <View
          style={[
            styles.monthlySummaryCard,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <BarChart3 size={18} color={theme.text} />
            <Text style={[styles.summaryTitle, { color: theme.text }]}>Activity Summary</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View
              style={[
                styles.summaryTile,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
            >
              <Text style={[styles.microLabel, { color: theme.mutedText }]}>
                TOTAL LOGS
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                {totalCompletions}
              </Text>
            </View>

            <View
              style={[
                styles.summaryTile,
                { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
            >
              <Text style={[styles.microLabel, { color: theme.mutedText }]}>
                ON-TIME RATE
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                {onTimeRate !== null ? `${onTimeRate}%` : '—'}
              </Text>
            </View>
          </View>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
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
  filterText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyHistoryCard: {
    borderRadius: radii['3xl'],
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    marginBottom: 24,
  },
  emptyHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyHistorySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  monthlySummaryCard: {
    borderRadius: radii['4xl'],
    padding: 22,
    marginTop: 12,
    borderWidth: 1,
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
    letterSpacing: -0.3,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryTile: {
    flex: 1,
    borderRadius: radii['2xl'],
    padding: 16,
    borderWidth: 1,
  },
  microLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  delayValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  accuracyTile: {
    borderRadius: radii['2xl'],
    padding: 16,
    borderWidth: 1,
  },
  accuracyValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});
