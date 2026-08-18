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
  Bell,
  Sparkles,
  Music,
  Moon,
  ArrowRight,
  ChevronRight,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { useUserStore } from '../../store/useUserStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const notif = useUserStore((s) => s.notificationSettings);
  const updateSettings = useUserStore((s) => s.updateNotificationSettings);

  const handleSelectSound = () => {
    haptics.light();
    Alert.alert('Notification Sound', 'Choose reminder sound:', [
      { text: 'Crystal (Default)', onPress: () => updateSettings({ soundName: 'Crystal' }) },
      { text: 'Aurora', onPress: () => updateSettings({ soundName: 'Aurora' }) },
      { text: 'Chime', onPress: () => updateSettings({ soundName: 'Chime' }) },
      { text: 'Pulse', onPress: () => updateSettings({ soundName: 'Pulse' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Manage how Routine AI communicates with you.
          </Text>
        </View>

        {/* Master Toggle Card */}
        <View
          style={[
            styles.masterCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.masterLeft}>
            <View style={[styles.bellIconCircle, { backgroundColor: theme.cardMuted }]}>
              <Bell size={20} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Allow Notifications
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.secondaryText }]}>
                Enable predictive push alerts
              </Text>
            </View>
          </View>
          <Switch
            value={notif.allowNotifications}
            onValueChange={(val) => {
              haptics.light();
              updateSettings({ allowNotifications: val });
            }}
            showCheckmark
          />
        </View>

        {/* Grouped Switches Card */}
        <View
          style={[
            styles.groupedCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {/* Smart Reminders */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <View style={styles.labelWithBadge}>
                <Text style={[styles.itemTitle, { color: theme.text }]}>
                  Smart Predictions
                </Text>
                <Badge
                  label="AI"
                  variant="ai"
                  icon={<Sparkles size={10} color="#374151" />}
                />
              </View>
              <Text style={[styles.itemSubtitle, { color: theme.secondaryText }]}>
                Contextual suggestions based on your routine habits
              </Text>
            </View>
            <Switch
              value={notif.smartReminders}
              onValueChange={(val) => {
                haptics.light();
                updateSettings({ smartReminders: val });
              }}
              showCheckmark
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Task Deadlines */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Task Deadlines
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.secondaryText }]}>
                Alerts for upcoming due dates
              </Text>
            </View>
            <Switch
              value={notif.taskDeadlines}
              onValueChange={(val) => {
                haptics.light();
                updateSettings({ taskDeadlines: val });
              }}
              showCheckmark
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Achievement Alerts */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Achievement Alerts
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.secondaryText }]}>
                Celebrate consistency milestones and streaks
              </Text>
            </View>
            <Switch
              value={notif.achievementAlerts}
              onValueChange={(val) => {
                haptics.light();
                updateSettings({ achievementAlerts: val });
              }}
              showCheckmark
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Weekly Reports */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Weekly Reports
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.secondaryText }]}>
                Summary of your routine trends
              </Text>
            </View>
            <Switch
              value={notif.weeklyReports}
              onValueChange={(val) => {
                haptics.light();
                updateSettings({ weeklyReports: val });
              }}
              showCheckmark
            />
          </View>
        </View>

        {/* Notification Sound Card */}
        <Pressable
          onPress={handleSelectSound}
          style={[
            styles.soundCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.soundLeft}>
            <View style={[styles.soundIconCircle, { backgroundColor: theme.cardMuted }]}>
              <Music size={20} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.itemTitle, { color: theme.text }]}>
                Notification Sound
              </Text>
              <Text style={[styles.itemSubtitle, { color: theme.secondaryText }]}>
                {notif.soundName || 'Crystal'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={theme.mutedText} />
        </Pressable>

        {/* Quiet Hours Card */}
        <View
          style={[
            styles.quietHoursCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.quietTopRow}>
            <View style={styles.quietLeft}>
              <Moon size={22} color={theme.text} />
              <Text style={[styles.quietTitle, { color: theme.text }]}>Quiet Hours</Text>
            </View>
            <Switch
              value={notif.quietHours}
              onValueChange={(val) => {
                haptics.light();
                updateSettings({ quietHours: val });
              }}
              showCheckmark
            />
          </View>

          <Text style={[styles.quietSubtitle, { color: theme.secondaryText }]}>
            Mute all non-critical notifications during this time.
          </Text>

          <View style={styles.timeRangeRow}>
            <View
              style={[
                styles.timePill,
                {
                  backgroundColor: theme.cardMuted,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.timeLabel, { color: theme.mutedText }]}>From</Text>
              <Text style={[styles.timeValue, { color: theme.text }]}>
                {notif.quietHoursStart}
              </Text>
            </View>

            <ArrowRight size={18} color={theme.secondaryText} />

            <View
              style={[
                styles.timePill,
                {
                  backgroundColor: theme.cardMuted,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.timeLabel, { color: theme.mutedText }]}>To</Text>
              <Text style={[styles.timeValue, { color: theme.text }]}>
                {notif.quietHoursEnd}
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
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  masterCard: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  masterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bellIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  groupedCard: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  settingTextCol: {
    flex: 1,
    marginRight: 16,
  },
  labelWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  divider: {
    height: 1,
  },
  soundCard: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  soundLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  soundIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quietHoursCard: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  quietTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quietLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quietTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  quietSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  timeRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  timePill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii['2xl'],
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});
