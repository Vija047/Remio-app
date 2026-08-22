import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
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
  Camera,
  Image as ImageIcon,
  X,
  CreditCard,
  ExternalLink,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Avatar } from '../../components/ui/Avatar';
import { Switch } from '../../components/ui/Switch';
import { useUserStore } from '../../store/useUserStore';
import { useAIStore } from '../../store/useAIStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&auto=format&fit=crop&q=80',
];

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
  const updateAvatar = useUserStore((s) => s.updateAvatar);
  const logout = useUserStore((s) => s.logout);
  const deleteAccount = useUserStore((s) => s.deleteAccount);
  const openCustomerPortal = useUserStore((s) => s.openCustomerPortal);
  const confidenceLevel = useAIStore((s) => s.confidenceLevel);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  const handleManageSubscription = async () => {
    haptics.light();
    if (user.isPremium || user.stripeCustomerId) {
      try {
        setOpeningPortal(true);
        const res = await openCustomerPortal();
        if (res && res.url) {
          const supported = await WebBrowser.openBrowserAsync(res.url);
          if (supported.type !== 'opened' && supported.type !== 'dismiss') {
            await Linking.openURL(res.url);
          }
        }
      } catch (err: any) {
        Alert.alert('Billing Portal Error', err.message || 'Could not open billing portal.');
      } finally {
        setOpeningPortal(false);
      }
    } else {
      router.push('/settings/premium');
    }
  };

  const confidenceDisplay =
    confidenceLevel === 'precise'
      ? 'Precise (98%)'
      : confidenceLevel === 'balanced'
      ? 'Balanced (75%)'
      : confidenceLevel === 'experimental'
      ? 'Experimental (50%)'
      : 'High (90%)';

  const handlePickFromGallery = async () => {
    try {
      haptics.light();
      setIsUploading(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Please allow Remio to access your phone photos to choose a profile picture.'
        );
        setIsUploading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newAvatarUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;

        await updateAvatar(newAvatarUri);
        haptics.success();
        setIsAvatarModalOpen(false);
      }
    } catch (err: any) {
      Alert.alert('Gallery Error', err?.message || 'Could not select photo from gallery.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      haptics.light();
      setIsUploading(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Please allow Remio to use your camera to take a profile photo.'
        );
        setIsUploading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newAvatarUri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;

        await updateAvatar(newAvatarUri);
        haptics.success();
        setIsAvatarModalOpen(false);
      }
    } catch (err: any) {
      Alert.alert('Camera Error', err?.message || 'Could not capture photo with camera.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectPreset = async (url: string) => {
    haptics.success();
    await updateAvatar(url);
    setIsAvatarModalOpen(false);
  };

  const handleRemoveAvatar = async () => {
    haptics.light();
    await updateAvatar('');
    setIsAvatarModalOpen(false);
  };

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
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.profileLeft}>
            <Avatar
              url={user.avatarUrl}
              name={user.name}
              size={60}
              showEditBadge
              onPress={() => {
                haptics.light();
                setIsAvatarModalOpen(true);
              }}
            />
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
                  {user.isPremium
                    ? user.subscriptionTier === 'pro_family'
                      ? 'Pro + Family'
                      : 'Pro Active'
                    : 'Free Plan'}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleManageSubscription}
            style={({ pressed }) => [
              styles.editProfileBtn,
              { backgroundColor: theme.cardMuted },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.editProfileText, { color: theme.text }]}>
              {user.isPremium || user.stripeCustomerId ? 'Manage' : 'Upgrade'}
            </Text>
          </Pressable>
        </View>

        {/* Subscription & Billing Section */}
        <Text style={[styles.sectionHeader, { color: theme.secondaryText }]}>Subscription & Billing</Text>
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Pressable
            onPress={handleManageSubscription}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <CreditCard size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
                {user.isPremium || user.stripeCustomerId
                  ? 'Manage Subscription (Stripe Portal)'
                  : 'Upgrade to Pro'}
              </Text>
            </View>
            <View style={styles.settingItemRight}>
              <Text style={[styles.settingSubtext, { color: theme.coral }]}>
                {user.isPremium
                  ? user.subscriptionTier === 'pro_family'
                    ? 'Pro + Family'
                    : 'Pro'
                  : 'Free'}
              </Text>
              <ExternalLink size={18} color={theme.mutedText} />
            </View>
          </Pressable>
        </View>

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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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

          {/* Prediction Confidence - Non-overlapping layout */}
          <Pressable
            onPress={() => {
              haptics.light();
              router.push('/ai/confidence');
            }}
            style={styles.settingItem}
          >
            <View style={styles.settingItemLeft}>
              <Share2 size={20} color={theme.text} />
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
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
              <Text style={[styles.settingItemTitle, { color: theme.text }]} numberOfLines={1}>
                Logout
              </Text>
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

      {/* Avatar Management Modal */}
      <Modal
        visible={isAvatarModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAvatarModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setIsAvatarModalOpen(false)} />

          <View style={[styles.modalSheet, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Change Profile Photo</Text>
              <Pressable
                onPress={() => setIsAvatarModalOpen(false)}
                style={styles.closeBtn}
                hitSlop={8}
              >
                <X size={20} color={theme.secondaryText} />
              </Pressable>
            </View>

            {/* Current Avatar Preview */}
            <View style={styles.avatarPreviewCenter}>
              <Avatar
                url={user.avatarUrl}
                name={user.name}
                size={84}
              />
              <Text style={[styles.previewName, { color: theme.text }]}>
                {user.name || 'Vijay Kumar'}
              </Text>
              <Text style={[styles.previewHint, { color: theme.secondaryText }]}>
                {user.avatarUrl ? 'Custom photo active' : 'Initial letters avatar'}
              </Text>
            </View>

            {/* Direct Upload Options: Gallery & Camera */}
            <View style={styles.actionButtonsStack}>
              {/* Choose from Phone Gallery */}
              <Pressable
                onPress={handlePickFromGallery}
                disabled={isUploading}
                style={({ pressed }) => [
                  styles.directActionCard,
                  { backgroundColor: theme.cardMuted, borderColor: theme.border },
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: '#FFF0ED' }]}>
                  <ImageIcon size={24} color={theme.coral} />
                </View>
                <View style={styles.actionTextGroup}>
                  <Text style={[styles.actionMainTitle, { color: theme.text }]}>
                    Choose from Gallery
                  </Text>
                  <Text style={[styles.actionSubTitle, { color: theme.secondaryText }]}>
                    Select a photo directly from your device
                  </Text>
                </View>
                {isUploading ? (
                  <ActivityIndicator size="small" color={theme.coral} />
                ) : (
                  <ChevronRight size={18} color={theme.mutedText} />
                )}
              </Pressable>

              {/* Take Photo with Camera */}
              <Pressable
                onPress={handleTakePhoto}
                disabled={isUploading}
                style={({ pressed }) => [
                  styles.directActionCard,
                  { backgroundColor: theme.cardMuted, borderColor: theme.border },
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <Camera size={24} color="#6366F1" />
                </View>
                <View style={styles.actionTextGroup}>
                  <Text style={[styles.actionMainTitle, { color: theme.text }]}>
                    Take a Photo
                  </Text>
                  <Text style={[styles.actionSubTitle, { color: theme.secondaryText }]}>
                    Open camera and capture a new picture
                  </Text>
                </View>
                {isUploading ? (
                  <ActivityIndicator size="small" color="#6366F1" />
                ) : (
                  <ChevronRight size={18} color={theme.mutedText} />
                )}
              </Pressable>
            </View>

            {/* Preset Avatars */}
            <Text style={[styles.inputLabel, { color: theme.secondaryText, marginTop: 18 }]}>
              Or Choose Preset Avatar
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsRow}
            >
              {AVATAR_PRESETS.map((presetUrl, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSelectPreset(presetUrl)}
                  style={({ pressed }) => [styles.presetItem, pressed && styles.btnPressed]}
                >
                  <Avatar url={presetUrl} size={48} />
                </Pressable>
              ))}
            </ScrollView>

            {/* Remove photo option if custom avatar is set */}
            {Boolean(user.avatarUrl) && (
              <Pressable
                onPress={handleRemoveAvatar}
                style={[styles.removeAvatarBtn, { borderColor: theme.red }]}
              >
                <Trash2 size={16} color={theme.red} />
                <Text style={[styles.removeAvatarText, { color: theme.red }]}>
                  Remove Photo (Use Initials)
                </Text>
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
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
  cardPressed: {
    opacity: 0.8,
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
    gap: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    flexShrink: 1,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  settingItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  settingSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },
  itemDivider: {
    height: 1,
    marginLeft: 52,
  },
  // Avatar Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    borderWidth: 1,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  avatarPreviewCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 4,
  },
  previewName: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
  },
  previewHint: {
    fontSize: 13,
  },
  actionButtonsStack: {
    gap: 10,
    marginTop: 14,
  },
  directActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii['2xl'],
    borderWidth: 1,
    padding: 14,
    gap: 14,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextGroup: {
    flex: 1,
    gap: 2,
  },
  actionMainTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionSubTitle: {
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetsRow: {
    gap: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  presetItem: {
    borderRadius: radii.full,
  },
  removeAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: radii.full,
    paddingVertical: 12,
    marginTop: 4,
  },
  removeAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
