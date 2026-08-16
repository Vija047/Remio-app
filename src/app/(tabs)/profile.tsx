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
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Avatar } from '../../components/ui/Avatar';
import { Switch } from '../../components/ui/Switch';
import { useUserStore } from '../../store/useUserStore';
import { useAIStore } from '../../store/useAIStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const user = useUserStore((s) => s.user);
  const darkMode = useUserStore((s) => s.darkMode);
  const selectedLanguage = useUserStore((s) => s.selectedLanguage);
  const smartPredictionEnabled = useUserStore((s) => s.smartPredictionEnabled);
  const toggleDarkMode = useUserStore((s) => s.toggleDarkMode);
  const setSmartPrediction = useUserStore((s) => s.setSmartPrediction);
  const confidenceLevel = useAIStore((s) => s.confidenceLevel);

  const confidenceDisplay =
    confidenceLevel === 'precise'
      ? 'Precise'
      : confidenceLevel === 'balanced'
      ? 'Balanced'
      : confidenceLevel === 'experimental'
      ? 'Experimental'
      : 'High';

  const handleLogout = () => {
    haptics.light();
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => router.replace('/(onboarding)/login'),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    haptics.error();
    Alert.alert(
      'Delete Account',
      'This will permanently erase all your routines, tasks, and learned AI models.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => router.replace('/(onboarding)/splash'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.screenTitle}>Settings</Text>

        {/* Profile Card */}
        <Pressable
          onPress={() => router.push('/settings/premium')}
          style={({ pressed }) => [styles.profileCard, pressed && styles.cardPressed]}
        >
          <View style={styles.profileLeft}>
            <Avatar url={user.avatarUrl} size={56} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name || 'Vijay'}</Text>
              <View style={styles.premiumBadge}>
                <Sparkles size={12} color="#D97706" />
                <Text style={styles.premiumText}>Premium Member</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/settings/premium')}
            style={({ pressed }) => [styles.editProfileBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </Pressable>

        {/* General Section */}
        <Text style={styles.sectionHeader}>General</Text>
        <View style={styles.sectionCard}>
          {/* Notifications */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/settings/notifications');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <Bell size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Notifications</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Moon size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Dark Mode</Text>
            </View>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>

          <View style={styles.itemDivider} />

          {/* Language */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/settings/language');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <Globe size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Language</Text>
            </View>
            <View style={styles.settingItemRight}>
              <Text style={styles.settingSubtext}>{selectedLanguage.split(' ')[0]}</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </View>
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Categories */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/settings/categories');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <LayoutGrid size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Categories</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* AI Features Section */}
        <Text style={styles.sectionHeader}>AI Features</Text>
        <View style={styles.sectionCard}>
          {/* Smart Prediction */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Brain size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Smart Prediction</Text>
            </View>
            <Switch
              value={smartPredictionEnabled}
              onValueChange={setSmartPrediction}
              showCheckmark
            />
          </View>

          <View style={styles.itemDivider} />

          {/* Prediction Confidence */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/ai/confidence');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <Share2 size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Prediction Confidence</Text>
            </View>
            <View style={styles.settingItemRight}>
              <Text style={styles.settingSubtext}>{confidenceDisplay}</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </View>
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Learning Mode */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/ai/learning');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <GraduationCap size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Learning Mode</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Reset AI History */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/ai/reset');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <History size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Reset AI History</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Account Section */}
        <View style={[styles.sectionCard, styles.accountCard]}>
          {/* Delete Account */}
          <Pressable onPress={handleDeleteAccount} style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Trash2 size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Delete Account</Text>
            </View>
          </Pressable>

          <View style={styles.itemDivider} />

          {/* Logout */}
          <Pressable onPress={handleLogout} style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <LogOut size={20} color={colors.primaryText} />
              <Text style={styles.settingItemTitle}>Logout</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    gap: 3,
  },
  profileName: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.primaryText,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  editProfileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: radii.full,
  },
  btnPressed: {
    opacity: 0.6,
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryText,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondaryText,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: colors.primaryText,
  },
  settingSubtext: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 52,
  },
});
