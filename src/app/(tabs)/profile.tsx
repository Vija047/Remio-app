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
  Bell,
  Moon,
  Globe,
  LayoutGrid,
  Brain,
  Share2,
  GraduationCap,
  History,
  Trash2,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Avatar } from '../../components/ui/Avatar';
import { Switch } from '../../components/ui/Switch';
import { useUserStore } from '../../store/useUserStore';
import { useAIStore } from '../../store/useAIStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const user = useUserStore((s) => s.user);
  const darkMode = useUserStore((s) => s.darkMode);
  const selectedLanguage = useUserStore((s) => s.selectedLanguage);
  const smartPredictionEnabled = useUserStore((s) => s.smartPredictionEnabled);
  const toggleDarkMode = useUserStore((s) => s.toggleDarkMode);
  const setSmartPrediction = useUserStore((s) => s.setSmartPrediction);
  const logout = useUserStore((s) => s.logout);
  const deleteAccount = useUserStore((s) => s.deleteAccount);
  const confidenceLevel = useAIStore((s) => s.confidenceLevel);

  const confidenceDisplay =
    confidenceLevel === 'precise'
      ? 'Precise (98%)'
      : confidenceLevel === 'balanced'
      ? 'Balanced (75%)'
      : confidenceLevel === 'experimental'
      ? 'Experimental (50%)'
      : 'High (90%)';

  const handleLogout = () => {
    haptics.light();
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(onboarding)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    haptics.error();
    Alert.alert(
      'Delete Account',
      'This will permanently erase all your routines, tasks, and learned AI prediction history from the database.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
            router.replace('/(onboarding)/splash');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={[styles.screenTitle, { color: theme.text }]}>Settings</Text>

        {/* Profile Card */}
        <Pressable
          onPress={() => router.push('/settings/premium')}
          style={({ pressed }) => [
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.profileLeft}>
            <Avatar url={user.avatarUrl} size={56} />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {user.name || 'Vijay'}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.secondaryText }]}>
                {user.email || 'user@routineai.com'}
              </Text>
              <View style={styles.premiumBadge}>
                <Sparkles size={12} color={theme.coral} />
                <Text style={[styles.premiumText, { color: theme.coral }]}>
                  {user.isPremium ? 'Premium Active' : 'Free Plan'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/settings/premium')}
            style={({ pressed }) => [
              styles.editProfileBtn,
              { backgroundColor: theme.cardMuted },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.editProfileText, { color: theme.text }]}>
              {user.isPremium ? 'Manage' : 'Upgrade'}
            </Text>
          </Pressable>
        </Pressable>

        {/* General Section */}
        <Text style={[styles.sectionHeader, { color: theme.secondaryText }]}>General</Text>
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {/* Notifications */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/settings/notifications');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <Bell size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Notifications
              </Text>
            </View>
            <ChevronRight size={18} color={theme.mutedText} />
          </Pressable>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Moon size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={() => {
                haptics.light();
                toggleDarkMode();
              }}
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Language */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/settings/language');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <Globe size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Language
              </Text>
            </View>
            <View style={styles.settingItemRight}>
              <Text style={[styles.settingSubtext, { color: theme.secondaryText }]}>
                {selectedLanguage.split(' ')[0]}
              </Text>
              <ChevronRight size={18} color={theme.mutedText} />
            </View>
          </Pressable>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Categories */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/settings/categories');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <LayoutGrid size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Categories
              </Text>
            </View>
            <ChevronRight size={18} color={theme.mutedText} />
          </Pressable>
        </View>

        {/* AI Features Section */}
        <Text style={[styles.sectionHeader, { color: theme.secondaryText }]}>
          AI Predictions & Intelligence
        </Text>
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {/* Smart Prediction */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Brain size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Smart Predictions
              </Text>
            </View>
            <Switch
              value={smartPredictionEnabled}
              onValueChange={(val) => {
                haptics.light();
                setSmartPrediction(val);
              }}
              showCheckmark
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Prediction Confidence */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/ai/confidence');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <Share2 size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Confidence Threshold
              </Text>
            </View>
            <View style={styles.settingItemRight}>
              <Text style={[styles.settingSubtext, { color: theme.secondaryText }]}>
                {confidenceDisplay}
              </Text>
              <ChevronRight size={18} color={theme.mutedText} />
            </View>
          </Pressable>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Learning Mode */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/ai/learning');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <GraduationCap size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Learning Parameters
              </Text>
            </View>
            <ChevronRight size={18} color={theme.mutedText} />
          </Pressable>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Reset AI History */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/ai/reset');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <History size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>
                Reset AI History
              </Text>
            </View>
            <ChevronRight size={18} color={theme.mutedText} />
          </Pressable>
        </View>

        {/* Account Section */}
        <View
          style={[
            styles.sectionCard,
            styles.accountCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {/* Logout */}
          <Pressable onPress={handleLogout} style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <LogOut size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]}>Logout</Text>
            </View>
          </Pressable>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Delete Account */}
          <Pressable onPress={handleDeleteAccount} style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Trash2 size={20} color={theme.red} />
              <Text style={[styles.settingItemTitle, { color: theme.red }]}>
                Delete Account
              </Text>
            </View>
          </Pressable>
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
    paddingTop: 12,
    paddingBottom: 110,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 20,
  },
  profileCard: {
    borderRadius: radii['3xl'],
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  cardPressed: {
    opacity: 0.9,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  profileInfo: {
    gap: 2,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 13,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '700',
  },
  editProfileBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  btnPressed: {
    opacity: 0.6,
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    paddingVertical: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  accountCard: {
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    marginRight: 8,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtext: {
    fontSize: 14,
  },
  itemDivider: {
    height: 1,
    marginLeft: 52,
  },
});
