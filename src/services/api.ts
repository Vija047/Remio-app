import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default API URL resolution
const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    // 10.0.2.2 points to host machine loopback in Android Emulator
    return 'http://10.0.2.2:3000/api';
  }
  // iOS simulator or Web
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getBaseUrl();
const TOKEN_STORAGE_KEY = 'routine_ai_auth_token';

class ApiService {
  private token: string | null = null;

  async initToken(): Promise<string | null> {
    try {
      const stored = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (stored) {
        this.token = stored;
      }
      return this.token;
    } catch {
      return null;
    }
  }

  async setToken(token: string | null): Promise<void> {
    this.token = token;
    try {
      if (token) {
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          (data && (data.message || data.error)) ||
          `Request failed with status ${response.status}`;
        const error = new Error(
          Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage
        );
        (error as any).status = response.status;
        (error as any).data = data;
        throw error;
      }

      return data as T;
    } catch (error: any) {
      if (!error.status) {
        // Network or offline error
        throw new Error(
          'Network connection error. Please ensure the backend server is running.'
        );
      }
      throw error;
    }
  }

  // --- AUTH ENDPOINTS ---
  async register(dto: { name: string; email: string; password: string }) {
    const res = await this.request<{
      accessToken: string;
      user: { id: string; name: string; email: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    if (res.accessToken) {
      await this.setToken(res.accessToken);
    }
    return res;
  }

  async login(dto: { email: string; password: string }) {
    const res = await this.request<{
      accessToken: string;
      user: { id: string; name: string; email: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    if (res.accessToken) {
      await this.setToken(res.accessToken);
    }
    return res;
  }

  async googleAuth(dto: {
    email: string;
    name?: string;
    googleId?: string;
    idToken?: string;
    photoUrl?: string;
  }) {
    const res = await this.request<{
      accessToken: string;
      user: { id: string; name: string; email: string };
    }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    if (res.accessToken) {
      await this.setToken(res.accessToken);
    }
    return res;
  }

  async me() {
    return this.request<{
      id: string;
      name: string;
      email: string;
      settings?: {
        notificationsEnabled: boolean;
        darkMode: boolean;
        smartPredictionsEnabled: boolean;
        timezone: string;
      };
      subscription?: {
        plan: string;
        status: string;
      };
    }>('/auth/me');
  }

  // --- USER PROFILE & SETTINGS ---
  async getProfile() {
    return this.request<any>('/users/profile');
  }

  async updateProfile(dto: { name?: string }) {
    return this.request<any>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  async updateSettings(dto: {
    notificationsEnabled?: boolean;
    darkMode?: boolean;
    smartPredictionsEnabled?: boolean;
    timezone?: string;
  }) {
    return this.request<any>('/users/settings', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  }

  async deleteAccount() {
    let res: any;
    try {
      res = await this.request<any>('/users/me', {
        method: 'DELETE',
      });
    } catch {
      res = await this.request<any>('/auth/me', {
        method: 'DELETE',
      }).catch(() => ({ success: true }));
    }
    await this.setToken(null);
    return res;
  }

  // --- TASKS ENDPOINTS ---
  async getTasks() {
    return this.request<
      Array<{
        id: string;
        title: string;
        description?: string;
        category: string;
        isActive: boolean;
        reminderEnabled: boolean;
        reminderTime?: string;
        createdAt: string;
        updatedAt: string;
        prediction?: {
          id: string;
          averageIntervalDays: number | string;
          minDays: number;
          bestDay: number;
          maxDays: number;
          confidenceScore: number | string;
          predictedDate: string;
        };
        completions?: Array<{
          id: string;
          completedAt: string;
          notes?: string;
        }>;
      }>
    >('/tasks');
  }

  async getTask(id: string) {
    return this.request<any>(`/tasks/${id}`);
  }

  async createTask(dto: {
    title: string;
    description?: string;
    category: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
    lastCompletedDate?: string;
  }) {
    return this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async updateTask(
    id: string,
    dto: {
      title?: string;
      description?: string;
      category?: string;
      isActive?: boolean;
      reminderEnabled?: boolean;
      reminderTime?: string;
    }
  ) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  }

  async deleteTask(id: string) {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // --- COMPLETIONS & PREDICTIONS ---
  async completeTask(id: string, dto: { notes?: string; completedAt?: string }) {
    return this.request<{
      completion: { id: string; completedAt: string; notes?: string };
      prediction: any;
    }>(`/tasks/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async getTaskHistory(id: string) {
    return this.request<
      Array<{
        id: string;
        taskId: string;
        completedAt: string;
        notes?: string;
      }>
    >(`/tasks/${id}/history`);
  }

  async getAllHistory() {
    return this.request<
      Array<{
        id: string;
        taskId: string;
        completedAt: string;
        notes?: string;
        task: {
          id: string;
          title: string;
          category: string;
          prediction?: any;
        };
      }>
    >('/tasks/history/all');
  }

  async getPrediction(id: string) {
    return this.request<{
      taskId?: string;
      status?: 'learning';
      message?: string;
      averageIntervalDays?: number;
      minDays?: number;
      bestDay?: number;
      maxDays?: number;
      confidenceScore?: number;
      predictedDate?: string;
      calculatedAt?: string;
    }>(`/tasks/${id}/prediction`);
  }

  async getPreparation(id: string) {
    return this.request<{
      taskId: string;
      title: string;
      preparationAdvice: string;
      suggestedItemsToOrder?: string[];
      estimatedLeadTimeDays?: number;
    }>(`/tasks/${id}/preparation`);
  }

  // --- AI ENDPOINTS ---
  async parseTask(text: string) {
    return this.request<{
      title: string;
      category: string;
      estimatedIntervalDays: number;
      reminderTime?: string;
      notes?: string;
    }>('/ai/parse-task', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async getRoutineCoach() {
    return this.request<{
      summary: string;
      recommendations: Array<{
        category: string;
        tip: string;
        priority: 'high' | 'medium' | 'low';
      }>;
    }>('/ai/routine-coach');
  }

  // --- INSIGHTS ---
  async getInsights() {
    return this.request<{
      totalActiveTasks: number;
      completedTasks: number;
      overdueTasks: number;
      upcomingTasks: number;
      onTimeCompletionPercentage: number | null;
      mostConsistentTask: {
        taskId: string;
        title: string;
        confidence: number;
        averageIntervalDays: number;
      } | null;
      leastConsistentTask: {
        taskId: string;
        title: string;
        confidence: number;
        averageIntervalDays: number;
      } | null;
      tasksCurrentlyLearning: number;
      averageCompletionInterval: number | null;
    }>('/insights');
  }

  // --- NOTIFICATIONS ---
  async getNotifications() {
    return this.request<
      Array<{
        id: string;
        taskId: string;
        notificationType: string;
        scheduledFor: string;
        sentAt?: string;
        status: string;
        task?: {
          title: string;
        };
      }>
    >('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  // --- SUBSCRIPTIONS ---
  async getSubscriptionStatus() {
    return this.request<any>('/subscription/status');
  }
}

export const api = new ApiService();
