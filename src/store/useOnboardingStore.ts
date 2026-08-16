import { create } from 'zustand';

interface OnboardingState {
  currentStep: number;
  name: string;
  ageGroup: string;
  lifestyle: string;
  selectedCategories: string[];
  notificationsEnabled: boolean;
  isOnboardingCompleted: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setName: (name: string) => void;
  setAgeGroup: (age: string) => void;
  setLifestyle: (lifestyle: string) => void;
  toggleCategory: (categoryId: string) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 0,
  name: 'Vijay',
  ageGroup: '25–34',
  lifestyle: 'Working Professional',
  selectedCategories: ['haircuts', 'medicines', 'bills', 'plants'],
  notificationsEnabled: false,
  isOnboardingCompleted: true, // default to true so users can explore immediately, but can test onboarding anytime

  setCurrentStep: (currentStep) => set({ currentStep }),
  setName: (name) => set({ name }),
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
  completeOnboarding: () => set({ isOnboardingCompleted: true }),
  resetOnboarding: () =>
    set({
      currentStep: 0,
      name: '',
      ageGroup: '',
      lifestyle: '',
      selectedCategories: [],
      notificationsEnabled: false,
      isOnboardingCompleted: false,
    }),
}));
