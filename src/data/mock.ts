import {
  Category,
  SubscriptionPlan,
} from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'home', name: 'Home', emoji: '🏠', iconName: 'Home', order: 1 },
  { id: 'car', name: 'Car', emoji: '🚗', iconName: 'Car', order: 2 },
  { id: 'health', name: 'Health', emoji: '💊', iconName: 'Pill', order: 3 },
  { id: 'plants', name: 'Plants', emoji: '🌱', iconName: 'Sprout', order: 4 },
  { id: 'pets', name: 'Pets', emoji: '🐶', iconName: 'PawPrint', order: 5 },
  { id: 'personal', name: 'Personal', emoji: '✂️', iconName: 'Scissors', order: 6 },
  { id: 'docs', name: 'Documents', emoji: '📄', iconName: 'FileText', order: 7 },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: '/mo',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$79.99',
    period: '/yr',
    savings: 'Save 33% ($6.66/mo)',
    isRecommended: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$249',
    period: 'one-time payment',
  },
];

export const SUPPORTED_LANGUAGES = [
  { id: 'en', name: 'English (US)', isSelected: true },
  { id: 'es', name: 'Spanish (Español)', isSelected: false },
  { id: 'fr', name: 'French (Français)', isSelected: false },
  { id: 'de', name: 'German (Deutsch)', isSelected: false },
  { id: 'ja', name: 'Japanese (日本語)', isSelected: false },
  { id: 'hi', name: 'Hindi (हिन्दी)', isSelected: false },
  { id: 'pt', name: 'Portuguese (Português)', isSelected: false },
];
