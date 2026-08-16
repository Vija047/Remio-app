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
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { useUserStore } from '../../store/useUserStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function NotificationSettingsScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            Manage how RoutineAI communicates with you.
          </Text>
        </View>

        {/* Master Toggle Card */}
        <View style={styles.masterCard}>
          <View style={styles.masterLeft}>
            <View style={styles.bellIconCircle}>
              <Bell size={20} color={colors.primaryText} />
            </View>
            <View>
              <Text style={styles.itemTitle}>Allow Notifications</Text>
              <Text style={styles.itemSubtitle}>Enable all push alerts</Text>
            </View>
          </View>
          <Switch
            value={notif.allowNotifications}
            onValueChange={(val) => updateSettings({ allowNotifications: val })}
            showCheckmark
          />
        </View>

        {/* Grouped Switches Card */}
        <View style={styles.groupedCard}>
          {/* Smart Reminders */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <View style={styles.labelWithBadge}>
                <Text style={styles.itemTitle}>Smart Reminders</Text>
                <Badge
                  label="AI"
                  variant="ai"
                  icon={<Sparkles size={10} color="#374151" />}
                />
              </View>
              <Text style={styles.itemSubtitle}>
                Contextual suggestions based on your routine
              </Text>
            </View>
            <Switch
              value={notif.smartReminders}
              onValueChange={(val) => updateSettings({ smartReminders: val })}
              showCheckmark
            />
          </View>

          <View style={styles.divider} />

          {/* Task Deadlines */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.itemTitle}>Task Deadlines</Text>
              <Text style={styles.itemSubtitle}>Alerts for upcoming due dates</Text>
            </View>
            <Switch
              value={notif.taskDeadlines}
              onValueChange={(val) => updateSettings({ taskDeadlines: val })}
              showCheckmark
            />
          </View>

          <View style={styles.divider} />

          {/* Achievement Alerts */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.itemTitle}>Achievement Alerts</Text>
              <Text style={styles.itemSubtitle}>Celebrate milestones and streaks</Text>
            </View>
            <Switch
              value={notif.achievementAlerts}
              onValueChange={(val) => updateSettings({ achievementAlerts: val })}
              showCheckmark
            />
          </View>

          <View style={styles.divider} />

          {/* Weekly Reports */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.itemTitle}>Weekly Reports</Text>
              <Text style={styles.itemSubtitle}>Summary of your productivity trends</Text>
            </View>
            <Switch
              value={notif.weeklyReports}
              onValueChange={(val) => updateSettings({ weeklyReports: val })}
              showCheckmark
            />
          </View>
        </View>

        {/* Notification Sound Card */}
        <Pressable onPress={handleSelectSound} style={styles.soundCard}>
          <View style={styles.soundLeft}>
            <View style={styles.soundIconCircle}>
              <Music size={20} color={colors.primaryText} />
            </View>
            <View>
              <Text style={styles.itemTitle}>Notification Sound</Text>
              <Text style={styles.itemSubtitle}>{notif.soundName || 'Crystal'}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </Pressable>

        {/* Quiet Hours Card */}
        <View style={styles.quietHoursCard}>
          <View style={styles.quietTopRow}>
            <View style={styles.quietLeft}>
              <Moon size={22} color={colors.primaryText} />
              <Text style={styles.quietTitle}>Quiet Hours</Text>
            </View>
            <Switch
              value={notif.quietHours}
              onValueChange={(val) => updateSettings({ quietHours: val })}
              showCheckmark
            />
          </View>

          <Text style={styles.quietSubtitle}>
            Mute all non-critical notifications during this time.
          </Text>

          <View style={styles.timeRangeRow}>
            <View style={styles.timePill}>
              <Text style={styles.timeLabel}>From</Text>
              <Text style={styles.timeValue}>{notif.quietHoursStart}</Text>
            </View>

            <ArrowRight size={18} color={colors.secondaryText} />

            <View style={styles.timePill}>
              <Text style={styles.timeLabel}>To</Text>
              <Text style={styles.timeValue}>{notif.quietHoursEnd}</Text>
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
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
    color: colors.primaryText,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
  },
  masterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  groupedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
  },
  soundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quietHoursCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: colors.primaryText,
  },
  quietSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radii['2xl'],
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
});
