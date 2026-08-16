import { create } from 'zustand';
import { UserProfile, NotificationSettings } from '../types';
import { INITIAL_USER } from '../data/mock';

interface UserState {
  user: UserProfile;
  darkMode: boolean;
  selectedLanguage: string;
  smartPredictionEnabled: boolean;
  notificationSettings: NotificationSettings;

  // Actions
  setUserName: (name: string) => void;
  setAgeGroup: (ageGroup: string) => void;
  setLifestyle: (lifestyle: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  setSmartPrediction: (enabled: boolean) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  upgradeToPremium: (tier: 'monthly' | 'yearly' | 'lifetime') => void;
  resetAccount: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: INITIAL_USER,
  darkMode: false,
  selectedLanguage: 'English (US)',
  smartPredictionEnabled: true,
  notificationSettings: {
    allowNotifications: true,
    smartReminders: true,
    taskDeadlines: true,
    achievementAlerts: true,
    weeklyReports: false,
    soundName: 'Crystal',
    quietHours: true,
    quietHoursStart: '10:00 PM',
    quietHoursEnd: '7:00 AM',
  },

  setUserName: (name) =>
    set((state) => ({ user: { ...state.user, name } })),

  setAgeGroup: (ageGroup) =>
    set((state) => ({ user: { ...state.user, ageGroup } })),

  setLifestyle: (lifestyle) =>
    set((state) => ({ user: { ...state.user, lifestyle } })),

  setSelectedCategories: (selectedCategories) =>
    set((state) => ({ user: { ...state.user, selectedCategories } })),

  toggleDarkMode: () =>
    set((state) => ({ darkMode: !state.darkMode })),

  setLanguage: (lang) =>
    set({ selectedLanguage: lang }),

  setSmartPrediction: (enabled) =>
    set({ smartPredictionEnabled: enabled }),

  updateNotificationSettings: (settings) =>
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, ...settings },
    })),

  upgradeToPremium: (tier) =>
    set((state) => ({
      user: { ...state.user, isPremium: true, premiumTier: tier },
    })),

  resetAccount: () =>
    set({ user: INITIAL_USER }),
}));
