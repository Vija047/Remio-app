import {
  Task,
  Category,
  HistoryLogItem,
  InsightsData,
  PredictionDetail,
  UserProfile,
  SubscriptionPlan,
} from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Vijay',
  email: 'vijay@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isPremium: true,
  premiumTier: 'yearly',
  ageGroup: '25–34',
  lifestyle: 'Working Professional',
  selectedCategories: ['haircuts', 'medicines', 'car_service', 'water_filters', 'bills', 'plants'],
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'home', name: 'Home', emoji: '🏠', iconName: 'Home', order: 1 },
  { id: 'car', name: 'Car', emoji: '🚗', iconName: 'Car', order: 2 },
  { id: 'health', name: 'Health', emoji: '💊', iconName: 'Pill', order: 3 },
  { id: 'plants', name: 'Plants', emoji: '🌱', iconName: 'Sprout', order: 4 },
  { id: 'pets', name: 'Pets', emoji: '🐶', iconName: 'PawPrint', order: 5 },
  { id: 'personal', name: 'Personal', emoji: '✂️', iconName: 'Scissors', order: 6 },
  { id: 'docs', name: 'Documents', emoji: '📄', iconName: 'FileText', order: 7 },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Water Plant',
    emoji: '🌱',
    category: 'plants',
    intervalDays: 7,
    lastCompletedDate: '2026-05-10',
    nextDueDate: '2026-05-17',
    dueLabel: 'Today',
    smartWindowStatus: 'Open',
    confidence: 92,
    isAiSuggested: true,
    completed: false,
    reminderType: 'ai',
    notes: 'Indoor fiddle leaf fig needs moderate watering.',
    history: [
      { id: 'h-1', date: '2026-05-10', formattedDate: 'May 10' },
      { id: 'h-2', date: '2026-05-03', formattedDate: 'May 3' },
      { id: 'h-3', date: '2026-04-26', formattedDate: 'Apr 26' },
    ],
  },
  {
    id: 'task-2',
    title: 'Medicine Refill',
    emoji: '💊',
    category: 'health',
    intervalDays: 30,
    lastCompletedDate: '2026-04-18',
    nextDueDate: '2026-05-18',
    dueLabel: 'Tomorrow',
    smartWindowStatus: 'Upcoming',
    confidence: 96,
    completed: false,
    reminderType: 'ai',
    notes: 'Prescription refill at local pharmacy.',
    history: [
      { id: 'h-4', date: '2026-04-18', formattedDate: 'Apr 18' },
      { id: 'h-5', date: '2026-03-19', formattedDate: 'Mar 19' },
    ],
  },
  {
    id: 'task-3',
    title: 'Car Service',
    emoji: '🚗',
    category: 'car',
    intervalDays: 180,
    lastCompletedDate: '2025-11-15',
    nextDueDate: '2026-05-24',
    dueLabel: 'Next Week',
    smartWindowStatus: 'Upcoming',
    confidence: 88,
    actionCta: 'Prepare Now →',
    completed: false,
    reminderType: 'ai',
    notes: 'Oil change and tire rotation.',
    history: [
      { id: 'h-6', date: '2025-11-15', formattedDate: 'Nov 15' },
      { id: 'h-7', date: '2025-05-12', formattedDate: 'May 12' },
    ],
  },
  {
    id: 'task-4',
    title: 'Haircut',
    emoji: '✂️',
    category: 'personal',
    intervalDays: 34,
    lastCompletedDate: '2026-04-11',
    nextDueDate: '2026-05-15',
    dueLabel: 'Tomorrow',
    smartWindowStatus: 'Open',
    confidence: 94,
    completed: false,
    reminderType: 'ai',
    notes: 'Barber shop appointment with Alex.',
    history: [
      { id: 'h-8', date: '2026-04-11', formattedDate: 'Apr 11' },
      { id: 'h-9', date: '2026-03-08', formattedDate: 'Mar 8' },
      { id: 'h-10', date: '2026-02-05', formattedDate: 'Feb 5' },
      { id: 'h-11', date: '2026-01-02', formattedDate: 'Jan 2' },
    ],
  },
  {
    id: 'task-5',
    title: 'Dental Checkup',
    emoji: '🦷',
    category: 'health',
    intervalDays: 180,
    lastCompletedDate: '2025-11-01',
    nextDueDate: '2026-05-01',
    dueLabel: 'Overdue',
    smartWindowStatus: 'Overdue',
    confidence: 98,
    completed: false,
    reminderType: 'manual',
    notes: 'Bi-annual routine teeth cleaning and exam.',
    history: [
      { id: 'h-12', date: '2025-11-01', formattedDate: 'Nov 1' },
      { id: 'h-13', date: '2025-05-04', formattedDate: 'May 4' },
    ],
  },
];

export const INITIAL_HISTORY_LOGS: HistoryLogItem[] = [
  {
    id: 'hist-1',
    taskId: 'task-1',
    title: 'Water Plant',
    emoji: '🌱',
    completedDate: '2026-05-15',
    timeString: 'Completed Today, 9:45 AM',
    section: 'Today',
    aiAccuracyBadge: 'AI Prediction Accuracy 95%',
  },
  {
    id: 'hist-2',
    taskId: 'task-2',
    title: 'Medicine Refill',
    emoji: '💊',
    completedDate: '2026-05-14',
    timeString: 'Completed Yesterday, 2:15 PM',
    section: 'Yesterday',
    nextPredictionDays: 28,
  },
  {
    id: 'hist-3',
    taskId: 'task-3',
    title: 'Car Service',
    emoji: '🚗',
    completedDate: '2025-10-12',
    timeString: 'Completed Oct 12, 10:00 AM',
    section: 'Last Week',
    nextReminderDays: 180,
  },
];

export const INITIAL_INSIGHTS: InsightsData = {
  overallConsistency: 94,
  topPercentage: 5,
  currentStreak: 45,
  tasksCompleted: 142,
  avgCompletionDays: 31,
  aiAccuracy: 96,
  monthlyCompleted: 28,
  monthlyAvgDelay: 1.2,
  suggestion: {
    title: 'RoutineAI Suggestion',
    description:
      'You tend to delay home maintenance tasks. Would you like smarter, context-aware reminders based on weather and your free time blocks?',
    cta: 'Enable Smart Mode',
  },
};

export const HAIRCUT_PREDICTION_DETAIL: PredictionDetail = {
  taskId: 'task-4',
  title: 'Haircut',
  emoji: '✂️',
  confidence: 96,
  avgIntervalDays: 34,
  startDay: 31,
  bestDay: 34,
  deadlineDay: 38,
  idealWindowText: 'May 14 – 18',
  insightsText:
    'RoutineAI learned your last 4 completions. Average interval: 34 days. We recommend completing this task between Day 31 and Day 38.',
  learningLogicText:
    'Each time you log a completion, RoutineAI updates its regression model. If you adjust predicted scheduling dates often, we automatically tweak prediction thresholds to match your natural flow.',
  lastPrediction: 33,
  newPrediction: 34,
};

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
  { id: 'es', name: 'Spanish', isSelected: false },
  { id: 'fr', name: 'French', isSelected: false },
  { id: 'de', name: 'German', isSelected: false },
  { id: 'ja', name: 'Japanese', isSelected: false },
  { id: 'hi', name: 'Hindi', isSelected: false },
  { id: 'pt', name: 'Portuguese', isSelected: false },
];
