import { create } from 'zustand';
import { api } from '../services/api';
import { useUserStore } from './useUserStore';
import { useTaskStore } from './useTaskStore';
import { notificationService } from '../services/notificationService';
import { toLocalDateString } from '../utils/dateUtils';

interface OnboardingState {
  currentStep: number;
  name: string;
  email: string;
  password: string;
  ageGroup: string;
  lifestyle: string;
  selectedCategories: string[];
  notificationsEnabled: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setAgeGroup: (age: string) => void;
  setLifestyle: (lifestyle: string) => void;
  toggleCategory: (categoryId: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  completeRegistration: () => Promise<boolean>;
  resetOnboarding: () => void;
}

const STARTER_TASKS: Record<string, { title: string; category: string; description: string }> = {
  haircuts: { title: 'Haircut & Styling', category: 'personal', description: 'Regular barber appointment' },
  medicines: { title: 'Medicine & Vitamins Refill', category: 'health', description: 'Monthly prescription refill' },
  car_service: { title: 'Car Maintenance & Oil Check', category: 'car', description: 'Periodic car checkup' },
  water_filters: { title: 'Replace Water Filter', category: 'home', description: 'Kitchen filter replacement' },
  bills: { title: 'Monthly Utility Bills', category: 'docs', description: 'Electricity and internet bills' },
  plant_watering: { title: 'Water Houseplants', category: 'plants', description: 'Thorough watering routine' },
  pet_care: { title: 'Pet Grooming & Vet Exam', category: 'pets', description: 'Routine pet care' },
  exercise: { title: 'Gym Workout Routine', category: 'personal', description: 'Strength training & cardio' },
  cleaning: { title: 'Deep Clean Apartment', category: 'home', description: 'Comprehensive home clean' },
  documents: { title: 'Renew Passport & ID Documents', category: 'docs', description: 'Verify expiry dates' },
  home_maintenance: { title: 'Inspect Smoke Detectors', category: 'home', description: 'Battery & safety check' },
  dental_checkups: { title: 'Dental Cleaning & Exam', category: 'health', description: 'Bi-annual checkup' },
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 0,
  name: '',
  email: '',
  password: '',
  ageGroup: '25–34',
  lifestyle: 'working_pro',
  selectedCategories: ['haircuts', 'medicines', 'plant_watering', 'bills'],
  notificationsEnabled: true,
  isLoading: false,
  error: null,

  setCurrentStep: (currentStep) => set({ currentStep }),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setAgeGroup: (ageGroup) => set({ ageGroup }),
  setLifestyle: (lifestyle) => set({ lifestyle }),
  toggleCategory: (categoryId) =>
    set((state) => {
      const exists = state.selectedCategories.includes(categoryId);
      return {
        selectedCategories: exists
          ? state.selectedCategories.filter((id) => id !== categoryId)
          : [...state.selectedCategories, categoryId],
      };
    }),
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),

  completeRegistration: async () => {
    const { name, email, password, selectedCategories, notificationsEnabled, ageGroup, lifestyle } = get();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      const err = 'Please enter your name.';
      set({ isLoading: false, error: err });
      throw new Error(err);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      const err = 'Please enter a valid email address.';
      set({ isLoading: false, error: err });
      throw new Error(err);
    }

    if (!trimmedPassword || trimmedPassword.length < 8) {
      const err = 'Password must be at least 8 characters long.';
      set({ isLoading: false, error: err });
      throw new Error(err);
    }

    try {
      set({ isLoading: true, error: null });

      // 1. Register with backend
      const res = await api.register({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // 2. Set user in store
      useUserStore.setState({
        token: res.accessToken,
        isAuthenticated: true,
        user: {
          ...useUserStore.getState().user,
          name: trimmedName,
          email: trimmedEmail,
          ageGroup,
          lifestyle,
          selectedCategories,
        },
      });

      // 3. Save settings
      await api.updateSettings({
        notificationsEnabled,
        smartPredictionsEnabled: true,
      }).catch(() => {});

      // 4. Seed 2-3 starter tasks based on selected categories
      const chosenCategories = selectedCategories.length > 0 ? selectedCategories : ['haircuts', 'medicines', 'plant_watering'];
      const tasksToCreate = chosenCategories.slice(0, 3);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 14);
      const pastDateStr = toLocalDateString(yesterday);

      for (const catKey of tasksToCreate) {
        const template = STARTER_TASKS[catKey] || {
          title: catKey.charAt(0).toUpperCase() + catKey.slice(1),
          category: 'personal',
          description: 'Routine maintenance task',
        };

        await api.createTask({
          title: template.title,
          category: template.category,
          description: template.description,
          reminderEnabled: notificationsEnabled,
          lastCompletedDate: pastDateStr,
        }).catch(() => {});
      }

      // 5. Fetch tasks & history safely
      await Promise.all([
        useTaskStore.getState().fetchTasks().catch(() => {}),
        useTaskStore.getState().fetchHistory().catch(() => {}),
      ]);

      // 6. Request notification permissions and send welcome reminder safely
      try {
        await notificationService.requestPermissions().catch(() => {});
        await notificationService.sendWelcomeNotification(trimmedName).catch(() => {});

        // 7. Evaluate seeded routines and trigger smart initial reminder
        setTimeout(() => {
          const loadedTasks = useTaskStore.getState().tasks;
          notificationService.evaluateAndSendSmartReminders(loadedTasks).catch(() => {});
        }, 2500);
      } catch {
        // Notification setup errors should never block user registration
      }

      set({ isLoading: false });
      return true;
    } catch (err: any) {
      let friendlyMessage = err.message || 'Failed to complete registration';
      if (friendlyMessage.toLowerCase().includes('already registered') || friendlyMessage.toLowerCase().includes('conflict')) {
        friendlyMessage = 'This email is already registered. Please sign in instead.';
      }
      const finalError = new Error(friendlyMessage);
      set({ isLoading: false, error: friendlyMessage });
      throw finalError;
    }
  },

  resetOnboarding: () =>
    set({
      currentStep: 0,
      name: '',
      email: '',
      password: '',
      ageGroup: '25–34',
      lifestyle: 'working_pro',
      selectedCategories: ['haircuts', 'medicines', 'plant_watering'],
      notificationsEnabled: true,
      isLoading: false,
      error: null,
    }),
}));
