import { create } from 'zustand';
import { Task, Category, HistoryLogItem } from '../types';
import { INITIAL_TASKS, INITIAL_CATEGORIES, INITIAL_HISTORY_LOGS } from '../data/mock';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  historyLogs: HistoryLogItem[];
  searchQuery: string;
  activeFilter: 'All' | 'Completed' | 'Overdue' | 'Upcoming';

  // Actions
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: 'All' | 'Completed' | 'Overdue' | 'Upcoming') => void;
  toggleTaskCompleted: (taskId: string) => void;
  addTask: (newTask: Omit<Task, 'id' | 'history' | 'completed'>) => void;
  deleteTask: (taskId: string) => void;
  rescheduleTask: (taskId: string, newDate: string, newLabel: Task['dueLabel']) => void;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
  reorderCategories: (categories: Category[]) => void;
  deleteCategory: (categoryId: string) => void;
  clearHistory: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: INITIAL_TASKS,
  categories: INITIAL_CATEGORIES,
  historyLogs: INITIAL_HISTORY_LOGS,
  searchQuery: '',
  activeFilter: 'All',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  toggleTaskCompleted: (taskId) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    const now = new Date();
    const todayFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    let updatedHistoryLogs = [...state.historyLogs];
    if (newCompleted) {
      const newLog: HistoryLogItem = {
        id: `hist-${Date.now()}`,
        taskId: task.id,
        title: task.title,
        emoji: task.emoji,
        completedDate: now.toISOString().split('T')[0],
        timeString: `Completed Today, ${timeFormatted}`,
        section: 'Today',
        aiAccuracyBadge: `AI Prediction Accuracy ${task.confidence}%`,
      };
      updatedHistoryLogs = [newLog, ...updatedHistoryLogs];
    }

    const updatedTasks = state.tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: newCompleted,
          lastCompletedDate: newCompleted ? now.toISOString().split('T')[0] : t.lastCompletedDate,
          history: newCompleted
            ? [{ id: `h-${Date.now()}`, date: now.toISOString().split('T')[0], formattedDate: todayFormatted }, ...t.history]
            : t.history,
        };
      }
      return t;
    });

    set({ tasks: updatedTasks, historyLogs: updatedHistoryLogs });
  },

  addTask: (newTask) => {
    const id = `task-${Date.now()}`;
    const task: Task = {
      ...newTask,
      id,
      completed: false,
      history: [
        {
          id: `h-${Date.now()}`,
          date: newTask.lastCompletedDate,
          formattedDate: new Date(newTask.lastCompletedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        },
      ],
    };
    set((state) => ({ tasks: [task, ...state.tasks] }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
      historyLogs: state.historyLogs.filter((h) => h.taskId !== taskId),
    }));
  },

  rescheduleTask: (taskId, newDate, newLabel) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, nextDueDate: newDate, dueLabel: newLabel } : t
      ),
    }));
  },

  addCategory: (cat) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      order: get().categories.length + 1,
      isCustom: true,
    };
    set((state) => ({ categories: [...state.categories, newCat] }));
  },

  reorderCategories: (categories) => set({ categories }),

  deleteCategory: (categoryId) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== categoryId),
    }));
  },

  clearHistory: () => set({ historyLogs: [] }),
}));
