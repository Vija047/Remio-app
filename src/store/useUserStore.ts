import { create } from 'zustand';
import { UserProfile, NotificationSettings } from '../types';
import { api } from '../services/api';
import { notificationService } from '../services/notificationService';
import { useTaskStore } from './useTaskStore';
import { useAIStore } from './useAIStore';

interface UserState {
  user: UserProfile;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  darkMode: boolean;
  selectedLanguage: string;
  smartPredictionEnabled: boolean;
  notificationSettings: NotificationSettings;

  // Actions
  initAuth: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  googleLogin: (dto: { email: string; name?: string; idToken?: string; photoUrl?: string }) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  fetchSubscriptionStatus: () => Promise<void>;
  createCheckoutSession: (dto: { priceId?: string; tier?: 'pro' | 'pro_family'; interval?: 'monthly' | 'yearly'; successUrl?: string; cancelUrl?: string }) => Promise<{ url: string }>;
  openCustomerPortal: () => Promise<{ url: string }>;
  setUserName: (name: string) => void;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  setAgeGroup: (ageGroup: string) => void;
  setLifestyle: (lifestyle: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleDarkMode: () => Promise<void>;
  setLanguage: (lang: string) => void;
  setSmartPrediction: (enabled: boolean) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  upgradeToPremium: (tier: 'monthly' | 'yearly' | 'lifetime') => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  name: 'Vijay',
  email: 'vijay@example.com',
  avatarUrl: '',
  isPremium: false,
  ageGroup: '25–34',
  lifestyle: 'Working Professional',
  selectedCategories: ['home', 'health', 'plants', 'car'],
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  allowNotifications: true,
  smartReminders: true,
  taskDeadlines: true,
  achievementAlerts: true,
  weeklyReports: false,
  soundName: 'Crystal',
  quietHours: true,
  quietHoursStart: '10:00 PM',
  quietHoursEnd: '7:00 AM',
};

export const useUserStore = create<UserState>((set, get) => ({
  user: DEFAULT_USER,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  darkMode: false,
  selectedLanguage: 'English (US)',
  smartPredictionEnabled: true,
  notificationSettings: DEFAULT_NOTIFICATIONS,

  initAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await api.initToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return false;
      }

      const me = await api.me();
      if (me && me.id) {
        const isDark = me.settings?.darkMode ?? false;
        const smartPred = me.settings?.smartPredictionsEnabled ?? true;
        const notifEnabled = me.settings?.notificationsEnabled ?? true;

        set({
          token,
          isAuthenticated: true,
          isLoading: false,
          user: {
            ...get().user,
            name: me.name || get().user.name,
            email: me.email || get().user.email,
            avatarUrl: (me as any).avatarUrl || get().user.avatarUrl || '',
            isPremium: me.subscription?.status === 'active',
          },
          darkMode: isDark,
          smartPredictionEnabled: smartPred,
          notificationSettings: {
            ...get().notificationSettings,
            allowNotifications: notifEnabled,
          },
        });
        return true;
      }
      set({ isAuthenticated: false, isLoading: false });
      return false;
    } catch {
      set({ isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.login({ email, password });
      if (res && res.accessToken) {
        set({
          token: res.accessToken,
          isAuthenticated: true,
          isLoading: false,
          user: {
            ...get().user,
            name: res.user.name,
            email: res.user.email,
            avatarUrl: (res.user as any).avatarUrl || '',
          },
        });
        // Refresh full profile in background
        get().fetchProfile().catch(() => {});
        return true;
      }
      set({ isLoading: false, error: 'Login failed' });
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Invalid email or password' });
      throw err;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.register({ name, email, password });
      if (res && res.accessToken) {
        set({
          token: res.accessToken,
          isAuthenticated: true,
          isLoading: false,
          user: {
            ...get().user,
            name: res.user.name,
            email: res.user.email,
            avatarUrl: (res.user as any).avatarUrl || '',
          },
        });
        // Request permissions and send welcome reminder
        notificationService.requestPermissions().catch(() => {});
        notificationService.sendWelcomeNotification(res.user.name).catch(() => {});
        return true;
      }
      set({ isLoading: false, error: 'Registration failed' });
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Registration error' });
      throw err;
    }
  },

  googleLogin: async (dto: { email: string; name?: string; idToken?: string; photoUrl?: string }) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.googleAuth(dto);
      if (res && res.accessToken) {
        set({
          token: res.accessToken,
          isAuthenticated: true,
          isLoading: false,
          user: {
            ...get().user,
            name: res.user.name || dto.name || 'Google User',
            email: res.user.email || dto.email,
            avatarUrl: (res.user as any).avatarUrl || dto.photoUrl || '',
          },
        });
        get().fetchProfile().catch(() => {});
        return true;
      }
      set({ isLoading: false, error: 'Google authentication failed' });
      return false;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Google authentication error' });
      throw err;
    }
  },

  fetchProfile: async () => {
    try {
      const profile = await api.getProfile();
      if (profile) {
        const subStatus = profile.subscriptionStatus || profile.subscription?.status || 'free';
        const subTier = profile.subscriptionTier || profile.subscription?.plan || 'free';
        const isPrem = subStatus === 'active' || subStatus === 'trialing';

        set((state) => ({
          user: {
            ...state.user,
            name: profile.name || state.user.name,
            email: profile.email || state.user.email,
            avatarUrl: profile.avatarUrl !== undefined ? profile.avatarUrl : state.user.avatarUrl,
            isPremium: isPrem,
            subscriptionStatus: subStatus,
            subscriptionTier: subTier,
            currentPeriodEnd: profile.currentPeriodEnd,
            stripeCustomerId: profile.stripeCustomerId,
          },
          darkMode: profile.settings?.darkMode ?? state.darkMode,
          smartPredictionEnabled:
            profile.settings?.smartPredictionsEnabled ?? state.smartPredictionEnabled,
        }));
      }
    } catch {
      // ignore
    }
  },

  fetchSubscriptionStatus: async () => {
    try {
      const sub = await api.getSubscriptionStatus();
      if (sub) {
        set((state) => ({
          user: {
            ...state.user,
            isPremium: sub.isPremium,
            subscriptionStatus: sub.status,
            subscriptionTier: sub.tier,
            currentPeriodEnd: sub.currentPeriodEnd,
            stripeCustomerId: sub.stripeCustomerId,
          },
        }));
      }
    } catch {
      // ignore
    }
  },

  createCheckoutSession: async (dto) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.createCheckoutSession(dto);
      return res;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create checkout session' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  openCustomerPortal: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.createCustomerPortalSession();
      return res;
    } catch (err: any) {
      set({ error: err.message || 'Failed to open billing portal' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  setUserName: (name) => {
    set((state) => ({ user: { ...state.user, name } }));
    api.updateProfile({ name }).catch(() => {});
  },

  updateAvatar: async (avatarUrl: string) => {
    set((state) => ({ user: { ...state.user, avatarUrl } }));
    try {
      await api.updateProfile({ avatarUrl });
    } catch {
      // ignore
    }
  },

  setAgeGroup: (ageGroup) =>
    set((state) => ({ user: { ...state.user, ageGroup } })),

  setLifestyle: (lifestyle) =>
    set((state) => ({ user: { ...state.user, lifestyle } })),

  setSelectedCategories: (selectedCategories) =>
    set((state) => ({ user: { ...state.user, selectedCategories } })),

  toggleDarkMode: async () => {
    const newDarkMode = !get().darkMode;
    set({ darkMode: newDarkMode });
    try {
      await api.updateSettings({ darkMode: newDarkMode });
    } catch {
      // ignore
    }
  },

  setLanguage: (lang) =>
    set({ selectedLanguage: lang }),

  setSmartPrediction: async (enabled) => {
    set({ smartPredictionEnabled: enabled });
    try {
      await api.updateSettings({ smartPredictionsEnabled: enabled });
    } catch {
      // ignore
    }
  },

  updateNotificationSettings: async (settings) => {
    const updated = { ...get().notificationSettings, ...settings };
    set({ notificationSettings: updated });
    try {
      await api.updateSettings({
        notificationsEnabled: updated.allowNotifications,
        smartPredictionsEnabled: updated.smartReminders,
      });
    } catch {
      // ignore
    }
  },

  upgradeToPremium: async (tier) => {
    try {
      set({ isLoading: true, error: null });
      await api.upgradeSubscription(tier);
      await get().fetchProfile();
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Subscription failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await api.setToken(null);
    useTaskStore.getState().resetTaskStore();
    useAIStore.getState().resetAIStore();
    set({
      token: null,
      isAuthenticated: false,
      user: DEFAULT_USER,
    });
  },

  deleteAccount: async () => {
    try {
      await api.deleteAccount();
    } finally {
      await api.setToken(null);
      useTaskStore.getState().resetTaskStore();
      useAIStore.getState().resetAIStore();
      set({
        token: null,
        isAuthenticated: false,
        user: DEFAULT_USER,
      });
    }
  },
}));
