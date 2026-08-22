import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category, HistoryLogItem } from '../types';
import { api } from '../services/api';
import { notificationService } from '../services/notificationService';
import { toLocalDateString } from '../utils/dateUtils';

const CATEGORIES_STORAGE_KEY = 'routine_ai_user_categories';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  historyLogs: HistoryLogItem[];
  searchQuery: string;
  activeFilter: 'All' | 'Completed' | 'Overdue' | 'Upcoming';
  completingTaskIds: string[];
  lastToggleTimes: Record<string, number>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: 'All' | 'Completed' | 'Overdue' | 'Upcoming') => void;
  fetchTasks: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  createTask: (data: {
    title: string;
    category: string;
    description?: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
    lastCompletedDate?: string;
  }) => Promise<void>;
  toggleTaskCompleted: (taskId: string, notes?: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, dto: any) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
  reorderCategories: (categories: Category[]) => void;
  deleteCategory: (categoryId: string) => void;
  clearHistory: () => void;
  resetTaskStore: () => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  home: '🏠',
  car: '🚗',
  health: '💊',
  plants: '🌱',
  pets: '🐶',
  personal: '✂️',
  docs: '📄',
  documents: '📄',
  custom: '✨',
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'home', name: 'Home', emoji: '🏠', iconName: 'Home', order: 1 },
  { id: 'car', name: 'Car', emoji: '🚗', iconName: 'Car', order: 2 },
  { id: 'health', name: 'Health', emoji: '💊', iconName: 'Pill', order: 3 },
  { id: 'plants', name: 'Plants', emoji: '🌱', iconName: 'Sprout', order: 4 },
  { id: 'pets', name: 'Pets', emoji: '🐶', iconName: 'PawPrint', order: 5 },
  { id: 'personal', name: 'Personal', emoji: '✂️', iconName: 'Scissors', order: 6 },
  { id: 'docs', name: 'Documents', emoji: '📄', iconName: 'FileText', order: 7 },
];

function calculateDueLabel(
  predictedDateStr?: string
): {
  dueLabel: 'Today' | 'Tomorrow' | 'Next Week' | 'In 2 Weeks' | 'Overdue';
  smartWindowStatus: 'Open' | 'Upcoming' | 'Overdue' | 'Optimal';
} {
  if (!predictedDateStr) {
    return { dueLabel: 'Today', smartWindowStatus: 'Optimal' };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const parts = predictedDateStr.split('-');
  let due: Date;
  if (parts.length === 3) {
    due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    due = new Date(predictedDateStr);
  }
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { dueLabel: 'Overdue', smartWindowStatus: 'Overdue' };
  } else if (diffDays === 0) {
    return { dueLabel: 'Today', smartWindowStatus: 'Open' };
  } else if (diffDays === 1) {
    return { dueLabel: 'Tomorrow', smartWindowStatus: 'Open' };
  } else if (diffDays <= 7) {
    return { dueLabel: 'Next Week', smartWindowStatus: 'Upcoming' };
  } else {
    return { dueLabel: 'In 2 Weeks', smartWindowStatus: 'Upcoming' };
  }
}

function formatTaskDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  categories: DEFAULT_CATEGORIES,
  historyLogs: [],
  searchQuery: '',
  activeFilter: 'All',
  completingTaskIds: [],
  lastToggleTimes: {},
  isLoading: false,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const rawTasks = await api.getTasks();

      const mappedTasks: Task[] = rawTasks.map((t) => {
        const lastCompletion = t.completions && t.completions[0];
        const lastCompletedDate = lastCompletion
          ? toLocalDateString(lastCompletion.completedAt)
          : toLocalDateString(t.createdAt);

        const predictedDateStr = t.prediction?.predictedDate
          ? toLocalDateString(t.prediction.predictedDate)
          : undefined;

        const { dueLabel, smartWindowStatus } = calculateDueLabel(predictedDateStr);

        const confidenceVal = t.prediction?.confidenceScore
          ? Math.round(Number(t.prediction.confidenceScore) * 100)
          : 0;

        const intervalDays = t.prediction?.averageIntervalDays
          ? Math.round(Number(t.prediction.averageIntervalDays))
          : 0;

        const historyItems = (t.completions || []).map((c) => ({
          id: c.id,
          date: toLocalDateString(c.completedAt),
          formattedDate: formatTaskDate(c.completedAt),
          notes: c.notes,
        }));

        // Check if completed today
        const todayStr = toLocalDateString(new Date());
        const isCompletedToday = lastCompletion
          ? toLocalDateString(lastCompletion.completedAt) === todayStr
          : false;

        return {
          id: t.id,
          title: t.title,
          emoji: CATEGORY_EMOJIS[t.category.toLowerCase()] || '✨',
          category: t.category,
          intervalDays,
          lastCompletedDate,
          nextDueDate: predictedDateStr || todayStr,
          dueLabel,
          smartWindowStatus,
          confidence: confidenceVal,
          isAiSuggested: !!t.prediction,
          completed: false, // Active routines are not crossed out
          reminderType: t.reminderEnabled ? 'ai' : 'manual',
          notes: t.description,
          history: historyItems,
        };
      });

      set({ tasks: mappedTasks, isLoading: false });
      notificationService.syncAllTaskReminders(mappedTasks).catch(() => {});
      notificationService.evaluateAndSendSmartReminders(mappedTasks).catch(() => {});
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  createTask: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await api.createTask({
        title: data.title,
        category: data.category,
        description: data.description,
        reminderEnabled: data.reminderEnabled,
        reminderTime: data.reminderTime,
        lastCompletedDate: data.lastCompletedDate,
      });

      await get().fetchTasks();
      await get().fetchHistory();
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  toggleTaskCompleted: async (taskId, notes) => {
    const lastTime = get().lastToggleTimes[taskId] || 0;
    const nowMs = Date.now();
    if (get().completingTaskIds.includes(taskId) || nowMs - lastTime < 500) {
      return;
    }

    const targetTask = get().tasks.find((t) => t.id === taskId);
    const isCurrentlyCompleted = targetTask?.completed;

    try {
      set((state) => ({
        lastToggleTimes: { ...state.lastToggleTimes, [taskId]: nowMs },
        completingTaskIds: [...state.completingTaskIds, taskId],
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      }));

      if (isCurrentlyCompleted) {
        // User is uncompleting / undoing completion
        await api.uncompleteTask(taskId);
      } else {
        // User is marking task complete
        const now = new Date();
        await api.completeTask(taskId, {
          notes: notes || 'Completed via Remio',
          completedAt: now.toISOString(),
        });
      }

      await get().fetchTasks();
      await get().fetchHistory();
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set((state) => ({
        completingTaskIds: state.completingTaskIds.filter((id) => id !== taskId),
      }));
    }
  },

  deleteTask: async (taskId) => {
    try {
      notificationService.cancelTaskReminder(taskId).catch(() => {});
      await api.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        historyLogs: state.historyLogs.filter((h) => h.taskId !== taskId),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateTask: async (taskId, dto) => {
    try {
      await api.updateTask(taskId, dto);
      await get().fetchTasks();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchHistory: async () => {
    try {
      const logs = await api.getAllHistory();
      const now = new Date();
      const todayStr = toLocalDateString(now);

      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = toLocalDateString(yesterday);

      // Deduplicate history logs with same taskId and matching minute timestamp
      const seen = new Set<string>();
      const deduplicatedLogs = [];
      for (const log of logs) {
        const minuteKey = `${log.taskId}_${log.completedAt ? log.completedAt.substring(0, 16) : log.id}`;
        if (!seen.has(minuteKey)) {
          seen.add(minuteKey);
          deduplicatedLogs.push(log);
        }
      }

      const mappedLogs: HistoryLogItem[] = deduplicatedLogs.map((log) => {
        const dateStr = toLocalDateString(log.completedAt);
        const dateObj = new Date(log.completedAt);
        const timeFormatted = isNaN(dateObj.getTime())
          ? ''
          : dateObj.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });

        let section: 'Today' | 'Yesterday' | 'Last Week' | 'Earlier' = 'Earlier';
        let timeString = `${formatTaskDate(log.completedAt)}, ${timeFormatted}`;

        if (dateStr === todayStr) {
          section = 'Today';
          timeString = `Completed Today, ${timeFormatted}`;
        } else if (dateStr === yesterdayStr) {
          section = 'Yesterday';
          timeString = `Completed Yesterday, ${timeFormatted}`;
        } else {
          const daysDiff = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff <= 7) {
            section = 'Last Week';
          }
        }

        const taskTitle = log.task?.title || 'Task';
        const taskCategory = log.task?.category || 'personal';
        const emoji = CATEGORY_EMOJIS[taskCategory.toLowerCase()] || '✨';

        return {
          id: log.id,
          taskId: log.taskId,
          title: taskTitle,
          emoji,
          completedDate: dateStr,
          timeString,
          section,
          aiAccuracyBadge: log.task?.prediction?.confidenceScore
            ? `AI confidence · ${Math.round(Number(log.task.prediction.confidenceScore) * 100)}%`
            : undefined,
        };
      });

      set({ historyLogs: mappedLogs });
    } catch {
      // ignore
    }
  },

  addCategory: (cat) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      order: get().categories.length + 1,
      isCustom: true,
    };
    const updated = [...get().categories, newCat];
    set({ categories: updated });
    AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  reorderCategories: (categories) => {
    set({ categories });
    AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories)).catch(() => {});
  },

  deleteCategory: (categoryId) => {
    const updated = get().categories.filter((c) => c.id !== categoryId);
    set({ categories: updated });
    AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  clearHistory: () => set({ historyLogs: [] }),
  resetTaskStore: () =>
    set({
      tasks: [],
      historyLogs: [],
      searchQuery: '',
      activeFilter: 'All',
      completingTaskIds: [],
      isLoading: false,
      error: null,
    }),
}));

// Initialize categories from local storage if previously saved
AsyncStorage.getItem(CATEGORIES_STORAGE_KEY)
  .then((saved) => {
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          useTaskStore.setState({ categories: parsed });
        }
      } catch {
        // ignore JSON parse errors
      }
    }
  })
  .catch(() => {});

