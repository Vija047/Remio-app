export type SmartWindowStatus = 'Open' | 'Upcoming' | 'Overdue' | 'Optimal';

export type ReminderType = 'ai' | 'manual';

export interface TaskHistoryItem {
  id: string;
  date: string;
  formattedDate: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  emoji: string;
  category: string;
  intervalDays: number;
  lastCompletedDate: string;
  nextDueDate: string;
  dueLabel: 'Today' | 'Tomorrow' | 'Next Week' | 'In 2 Weeks' | 'Overdue';
  smartWindowStatus: SmartWindowStatus;
  confidence: number; // 0 to 100
  isAiSuggested?: boolean;
  actionCta?: string;
  completed: boolean;
  reminderType: ReminderType;
  notes?: string;
  history: TaskHistoryItem[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  iconName: string;
  isCustom?: boolean;
  order: number;
}

export interface HistoryLogItem {
  id: string;
  taskId: string;
  title: string;
  emoji: string;
  completedDate: string;
  timeString: string;
  section: 'Today' | 'Yesterday' | 'Last Week' | 'Earlier';
  aiAccuracyBadge?: string;
  nextPredictionDays?: number;
  nextReminderDays?: number;
}

export interface InsightsData {
  overallConsistency: number; // e.g. 94
  topPercentage: number; // e.g. 5
  currentStreak: number; // e.g. 45
  tasksCompleted: number; // e.g. 142
  avgCompletionDays: number; // e.g. 31
  aiAccuracy: number; // e.g. 96
  monthlyCompleted: number; // e.g. 28
  monthlyAvgDelay: number; // e.g. 1.2
  suggestion: {
    title: string;
    description: string;
    cta: string;
  };
}

export type ConfidenceLevel = 'precise' | 'high' | 'balanced' | 'experimental';

export interface PredictionDetail {
  taskId: string;
  title: string;
  emoji: string;
  confidence: number;
  avgIntervalDays: number;
  startDay: number;
  bestDay: number;
  deadlineDay: number;
  idealWindowText: string;
  insightsText: string;
  learningLogicText: string;
  lastPrediction: number;
  newPrediction: number;
}

export interface LearningSettings {
  continuousLearning: boolean;
  activeLearning: boolean;
  patternDepth: number; // 0 to 1 (Shallow to Deep)
  manualCompletions: boolean;
  calendarSync: boolean;
  locationHabits: boolean;
}

export interface NotificationSettings {
  allowNotifications: boolean;
  smartReminders: boolean;
  taskDeadlines: boolean;
  achievementAlerts: boolean;
  weeklyReports: boolean;
  soundName: string;
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isPremium: boolean;
  subscriptionStatus?: string;
  subscriptionTier?: string;
  currentPeriodEnd?: string | null;
  stripeCustomerId?: string | null;
  premiumTier?: 'monthly' | 'yearly' | 'lifetime';
  ageGroup?: string;
  lifestyle?: string;
  selectedCategories: string[];
}

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly' | 'lifetime';
  name: string;
  price: string;
  period: string;
  savings?: string;
  isRecommended?: boolean;
}
