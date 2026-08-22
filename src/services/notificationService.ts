import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { Task } from '../types';

const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export interface InAppNotificationPayload {
  id?: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

type NotificationListener = (payload: InAppNotificationPayload) => void;
type ResponseTapListener = (response: any) => void;

// Configure global notification display behavior for system tray (Non-Expo Go / Native builds)
try {
  if (!isExpoGo && Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch {
  // safe fallback
}

class NotificationService {
  private isInitialized = false;
  private listeners: Set<NotificationListener> = new Set();
  private responseListeners: Set<ResponseTapListener> = new Set();
  private lastDispatchDates: Map<string, string> = new Map();

  private shouldDispatchToday(key: string): boolean {
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return this.lastDispatchDates.get(key) !== todayStr;
  }

  private markDispatchedToday(key: string): void {
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.lastDispatchDates.set(key, todayStr);
  }

  /**
   * Subscribe to in-app visual notification banners
   */
  subscribeInAppNotifications(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Dispatches an in-app visual notification banner
   */
  showInAppNotification(payload: InAppNotificationPayload): void {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch {
        // ignore
      }
    });
  }

  /**
   * Registers a callback when a notification banner or native alert is tapped.
   */
  addNotificationResponseListener(listener: ResponseTapListener): () => void {
    this.responseListeners.add(listener);
    return () => {
      this.responseListeners.delete(listener);
    };
  }

  /**
   * Initializes notification channels (Android) and notification handlers safely.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (!isExpoGo && Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('reminders', {
            name: 'Routine Reminders',
            description: 'Timely reminders for scheduled routines and habits',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6F61',
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
          });

          await Notifications.setNotificationChannelAsync('default', {
            name: 'General Alerts',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
          });
        } catch {
          // Channels fallback
        }
      }

      if (!isExpoGo && Platform.OS !== 'web') {
        try {
          Notifications.addNotificationReceivedListener((notification) => {
            const content = notification.request.content;
            if (content.title || content.body) {
              this.showInAppNotification({
                id: notification.request.identifier,
                title: content.title || 'Routine Alert',
                body: content.body || '',
                data: content.data as any,
              });
            }
          });

          Notifications.addNotificationResponseReceivedListener((response) => {
            this.responseListeners.forEach((l) => {
              try {
                l(response);
              } catch {
                // ignore
              }
            });
          });
        } catch {
          // fallback
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn('Error during notification initialization:', error);
    }
  }

  /**
   * Checks current permission status and requests permissions if not granted.
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          const perm = await window.Notification.requestPermission();
          return perm === 'granted';
        } catch {
          return false;
        }
      }
      return true;
    }

    if (isExpoGo) {
      // Expo Go SDK 53 removed remote push notifications. Local in-app notifications operate smoothly.
      return true;
    }

    try {
      const existing = await Notifications.getPermissionsAsync();
      let finalStatus = existing.status;

      if (existing.status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = requested.status;
      }

      if (
        finalStatus === 'granted' &&
        Device.isDevice &&
        (Platform.OS === 'ios' || Platform.OS === 'android')
      ) {
        try {
          const projectId =
            Constants.expoConfig?.extra?.eas?.projectId ??
            Constants.easConfig?.projectId;

          if (projectId) {
            const tokenData = await Notifications.getExpoPushTokenAsync({ projectId }).catch(() => null);
            if (tokenData?.data) {
              const { api } = await import('./api');
              await api.registerPushToken(tokenData.data).catch(() => {});
            }
          }
        } catch {
          // safe ignore when push service is unavailable
        }
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.warn('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Checks whether notification permissions are currently granted.
   */
  async getPermissionStatus(): Promise<boolean> {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        return window.Notification.permission === 'granted';
      }
      return true;
    }

    if (isExpoGo) return true;

    try {
      const permissions = await Notifications.getPermissionsAsync();
      return permissions.status === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Triggers an immediate notification with customizable title and body.
   */
  async sendImmediateNotification(
    title: string,
    body: string,
    data: Record<string, any> = {}
  ): Promise<string | null> {
    await this.initialize();

    // Trigger visual in-app banner
    this.showInAppNotification({
      title,
      body,
      data,
    });

    if (isExpoGo || Platform.OS === 'web') {
      return 'in-app-delivered';
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: Platform.OS === 'android' ? { channelId: 'reminders' } : null,
      });

      return id;
    } catch {
      return 'in-app-delivered';
    }
  }

  /**
   * Diagnostic / Test helpers
   */
  async sendImmediateTestNotification(
    title: string = '🔔 Remio Reminder: Test Alert',
    body: string = 'Your routine notifications are active and working smoothly! 🎯',
    data: Record<string, any> = { type: 'test' }
  ): Promise<string | null> {
    return this.sendImmediateNotification(title, body, data);
  }

  async scheduleDelayedTestNotification(
    seconds: number = 5,
    title: string = '⏰ Remio Background Reminder Test',
    body: string = `Success! Scheduled reminder arrived after ${seconds} seconds.`
  ): Promise<string | null> {
    await this.initialize();

    setTimeout(() => {
      this.showInAppNotification({
        title,
        body,
        data: { type: 'delayed_test', scheduledSeconds: seconds },
      });
    }, Math.max(1, seconds) * 1000);

    if (isExpoGo || Platform.OS === 'web') {
      return 'delayed-scheduled-in-app';
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type: 'delayed_test', scheduledSeconds: seconds },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.max(1, seconds),
          channelId: Platform.OS === 'android' ? 'reminders' : undefined,
        },
      });

      return id;
    } catch {
      return 'delayed-scheduled';
    }
  }

  /**
   * Schedules a reminder notification for a specific routine task.
   */
  async scheduleTaskReminder(task: Task): Promise<string | null> {
    if (!task.id) return null;

    try {
      await this.initialize();
      if (!isExpoGo && Platform.OS !== 'web') {
        await this.cancelTaskReminder(task.id);
      }

      const reminderTimeStr = (task as any).reminderTime || '09:00';
      const [hoursStr, minutesStr] = reminderTimeStr.split(':');
      const hours = parseInt(hoursStr, 10) || 9;
      const minutes = parseInt(minutesStr, 10) || 0;

      let targetDate = new Date();
      if (task.nextDueDate) {
        const parsed = new Date(task.nextDueDate);
        if (!isNaN(parsed.getTime())) {
          targetDate = parsed;
        }
      }

      targetDate.setHours(hours, minutes, 0, 0);

      const now = new Date();
      if (targetDate.getTime() <= now.getTime()) {
        targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        targetDate.setHours(hours, minutes, 0, 0);
      }

      if (isExpoGo || Platform.OS === 'web') {
        return `in-app-task-${task.id}`;
      }

      const id = await Notifications.scheduleNotificationAsync({
        identifier: `task-${task.id}`,
        content: {
          title: `🎯 ${task.emoji || '✨'} Routine Due: ${task.title}`,
          body: `It's time for your "${task.title}" routine! Tap to check it off and keep your streak alive.`,
          data: { taskId: task.id, title: task.title },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: targetDate,
          channelId: Platform.OS === 'android' ? 'reminders' : undefined,
        },
      });

      return id;
    } catch (error) {
      console.warn(`Could not schedule reminder for task ${task.id}:`, error);
      return null;
    }
  }

  /**
   * Cancels a scheduled task reminder by task ID.
   */
  async cancelTaskReminder(taskId: string): Promise<void> {
    if (isExpoGo || Platform.OS === 'web') return;
    try {
      await Notifications.cancelScheduledNotificationAsync(`task-${taskId}`);
    } catch {
      // ignore
    }
  }

  /**
   * Cancels all currently scheduled notifications.
   */
  async cancelAllNotifications(): Promise<void> {
    if (isExpoGo || Platform.OS === 'web') return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
      // ignore
    }
  }

  /**
   * Returns list of currently scheduled notifications.
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    if (isExpoGo || Platform.OS === 'web') return [];
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch {
      return [];
    }
  }

  /**
   * Sends a welcome notification when a new user registers or completes onboarding.
   */
  async sendWelcomeNotification(userName?: string): Promise<void> {
    const name = userName ? userName.trim() : 'there';
    const title = `🎉 Welcome to Remio, ${name}!`;
    const body =
      'Notifications are enabled! Remio will predict your routine patterns and keep you on track with timely reminders.';

    await this.sendImmediateNotification(title, body, { type: 'welcome' });
  }

  /**
   * Evaluates active tasks and sends smart context-aware reminders for today, tomorrow, and overdue items.
   */
  async evaluateAndSendSmartReminders(tasks: Task[]): Promise<void> {
    if (!tasks || tasks.length === 0) return;

    const uncompletedTasks = tasks.filter((t) => !t.completed);
    const todayTasks = uncompletedTasks.filter((t) => t.dueLabel === 'Today');
    const tomorrowTasks = uncompletedTasks.filter((t) => t.dueLabel === 'Tomorrow');
    const overdueTasks = uncompletedTasks.filter((t) => t.dueLabel === 'Overdue');

    // 1. If routines are due today
    const dueToday = todayTasks.find((t) => this.shouldDispatchToday(`today_${t.id}`));
    if (dueToday) {
      const taskNames = todayTasks.map((t) => `${t.emoji || '✨'} ${t.title}`).join(', ');
      const title =
        todayTasks.length === 1
          ? `🎯 Routine Due Today: ${dueToday.title}`
          : `🎯 ${todayTasks.length} Routines Due Today`;
      const body = `Pending: ${taskNames}. Tap to check off and protect your consistency streak!`;

      this.markDispatchedToday(`today_${dueToday.id}`);
      await this.sendImmediateNotification(title, body, {
        taskId: dueToday.id,
        type: 'today_digest',
      });
      return;
    }

    // 2. If routines are overdue
    const dueOverdue = overdueTasks.find((t) => this.shouldDispatchToday(`overdue_${t.id}`));
    if (dueOverdue) {
      const title = `⚠️ Overdue Routine: ${dueOverdue.title}`;
      const body = `Your routine "${dueOverdue.title}" is past its predicted date. Tap to check it off!`;

      this.markDispatchedToday(`overdue_${dueOverdue.id}`);
      await this.sendImmediateNotification(title, body, {
        taskId: dueOverdue.id,
        type: 'overdue_digest',
      });
      return;
    }

    // 3. If routines are due tomorrow
    const dueTomorrow = tomorrowTasks.find((t) => this.shouldDispatchToday(`tomorrow_${t.id}`));
    if (dueTomorrow) {
      const title = `📅 Upcoming Tomorrow: ${dueTomorrow.title}`;
      const body = `Get ready! Your "${dueTomorrow.title}" routine is coming up tomorrow.`;

      this.markDispatchedToday(`tomorrow_${dueTomorrow.id}`);
      await this.sendImmediateNotification(title, body, {
        taskId: dueTomorrow.id,
        type: 'tomorrow_digest',
      });
    }
  }

  /**
   * Syncs and schedules notifications for all active tasks that have reminders enabled.
   */
  async syncAllTaskReminders(tasks: Task[]): Promise<void> {
    try {
      await this.initialize();
      const hasPermission = await this.getPermissionStatus();
      if (!hasPermission) return;

      const activeTasks = tasks.filter((t) => !t.completed);
      for (const task of activeTasks) {
        const isReminderOn =
          task.reminderType === 'ai' ||
          task.reminderType === 'manual' ||
          (task as any).reminderEnabled;

        if (isReminderOn) {
          await this.scheduleTaskReminder(task);
        } else {
          await this.cancelTaskReminder(task.id);
        }
      }
    } catch (error) {
      console.warn('Failed to sync task reminders:', error);
    }
  }
}

export const notificationService = new NotificationService();
