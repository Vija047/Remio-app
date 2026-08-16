import { create } from 'zustand';
import { ConfidenceLevel, LearningSettings, PredictionDetail } from '../types';
import { HAIRCUT_PREDICTION_DETAIL } from '../data/mock';

interface AIState {
  confidenceLevel: ConfidenceLevel;
  learningSettings: LearningSettings;
  activePrediction: PredictionDetail;

  // Actions
  setConfidenceLevel: (level: ConfidenceLevel) => void;
  updateLearningSettings: (settings: Partial<LearningSettings>) => void;
  resetAIData: (options: { resetPatterns: boolean; resetConfidence: boolean; clearHistory: boolean }) => void;
}

export const useAIStore = create<AIState>((set) => ({
  confidenceLevel: 'high',
  learningSettings: {
    continuousLearning: true,
    activeLearning: true,
    patternDepth: 0.6,
    manualCompletions: true,
    calendarSync: true,
    locationHabits: false,
  },
  activePrediction: HAIRCUT_PREDICTION_DETAIL,

  setConfidenceLevel: (confidenceLevel) => set({ confidenceLevel }),

  updateLearningSettings: (newSettings) =>
    set((state) => ({
      learningSettings: { ...state.learningSettings, ...newSettings },
    })),

  resetAIData: (options) => {
    // Reset AI intelligence models
    set((state) => ({
      confidenceLevel: options.resetConfidence ? 'high' : state.confidenceLevel,
      learningSettings: {
        ...state.learningSettings,
        patternDepth: options.resetPatterns ? 0.5 : state.learningSettings.patternDepth,
      },
    }));
  },
}));
