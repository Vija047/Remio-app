import { create } from 'zustand';
import { ConfidenceLevel, LearningSettings, PredictionDetail } from '../types';
import { api } from '../services/api';

interface AIState {
  confidenceLevel: ConfidenceLevel;
  learningSettings: LearningSettings;
  activePrediction: PredictionDetail | null;
  aiCoachTip: string | null;
  isLoading: boolean;

  // Actions
  setConfidenceLevel: (level: ConfidenceLevel) => void;
  updateLearningSettings: (settings: Partial<LearningSettings>) => void;
  fetchTaskPrediction: (taskId: string, title?: string, emoji?: string) => Promise<PredictionDetail | null>;
  fetchRoutineCoach: () => Promise<void>;
  resetAIData: (options: { resetPatterns: boolean; resetConfidence: boolean; clearHistory: boolean }) => void;
  resetAIStore: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  confidenceLevel: 'high',
  learningSettings: {
    continuousLearning: true,
    activeLearning: true,
    patternDepth: 0.6,
    manualCompletions: true,
    calendarSync: true,
    locationHabits: false,
  },
  activePrediction: null,
  aiCoachTip: null,
  isLoading: false,

  setConfidenceLevel: (confidenceLevel) => set({ confidenceLevel }),

  updateLearningSettings: (newSettings) =>
    set((state) => ({
      learningSettings: { ...state.learningSettings, ...newSettings },
    })),

  fetchTaskPrediction: async (taskId, title, emoji) => {
    try {
      set({ isLoading: true });
      const [pred, prep] = await Promise.all([
        api.getPrediction(taskId).catch(() => null),
        api.getPreparation(taskId).catch(() => null),
      ]);

      const isLearning = !pred || pred.status === 'learning' || !pred.predictedDate;
      const avgDays = pred?.averageIntervalDays ? Math.round(Number(pred.averageIntervalDays)) : 0;
      const minDays = pred?.minDays ?? 0;
      const bestDay = pred?.bestDay ?? 0;
      const maxDays = pred?.maxDays ?? 0;
      const confidence = (!isLearning && pred?.confidenceScore)
        ? Math.round(Number(pred.confidenceScore) * 100)
        : 0;

      const idealWindowText = !isLearning && pred?.predictedDate
        ? `Target: ${new Date(pred.predictedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : isLearning
        ? 'Learning Phase (Need ≥ 2 completions)'
        : `Between Day ${minDays} – ${maxDays}`;

      const preparationText = prep?.suggestion || prep?.preparationAdvice;
      const insightsText = preparationText
        ? preparationText
        : isLearning
        ? 'Remio is currently analyzing your routine schedule. Complete this task at least twice to enable automated predictive intelligence.'
        : `Remio calculated your schedule from previous completions. Average interval: ${avgDays} days. Optimal window is between Day ${minDays} and Day ${maxDays}.`;

      const detail: PredictionDetail = {
        taskId,
        title: title || 'Routine Task',
        emoji: emoji || '✨',
        confidence,
        avgIntervalDays: avgDays,
        startDay: minDays,
        bestDay: bestDay || avgDays,
        deadlineDay: maxDays,
        idealWindowText,
        insightsText,
        learningLogicText:
          'Each time you log a task completion, Remio updates its predictive model using EWMA and median interval regression.',
        lastPrediction: avgDays,
        newPrediction: avgDays,
      };

      set({ activePrediction: detail, isLoading: false });
      return detail;
    } catch {
      set({ isLoading: false });
      return null;
    }
  },

  fetchRoutineCoach: async () => {
    try {
      const res = await api.getRoutineCoach();
      if (res && res.summary) {
        set({ aiCoachTip: res.summary });
      }
    } catch {
      // ignore
    }
  },

  resetAIData: (options) => {
    set((state) => ({
      confidenceLevel: options.resetConfidence ? 'high' : state.confidenceLevel,
      learningSettings: {
        ...state.learningSettings,
        patternDepth: options.resetPatterns ? 0.5 : state.learningSettings.patternDepth,
      },
      activePrediction: null,
    }));
  },

  resetAIStore: () =>
    set({
      confidenceLevel: 'high',
      activePrediction: null,
      aiCoachTip: null,
      isLoading: false,
    }),
}));
