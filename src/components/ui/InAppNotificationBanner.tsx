import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, X } from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { notificationService, InAppNotificationPayload } from '../../services/notificationService';

export function InAppNotificationBanner() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();

  const [activeNotification, setActiveNotification] = useState<InAppNotificationPayload | null>(null);
  const translateY = useRef(new Animated.Value(-160)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = notificationService.subscribeInAppNotifications((payload) => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }

      setActiveNotification(payload);
      haptics.success();

      // Animate In smoothly
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
          speed: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 5 seconds
      dismissTimer.current = setTimeout(() => {
        dismissBanner();
      }, 5000);
    });

    return () => {
      unsubscribe();
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, []);

  const dismissBanner = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -160,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveNotification(null);
    });
  };

  const handlePress = () => {
    haptics.light();
    const taskId = activeNotification?.data?.taskId;
    dismissBanner();

    if (taskId) {
      router.push(`/task/${taskId}` as any);
    } else {
      router.push('/(tabs)/today');
    }
  };

  if (!activeNotification) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: Math.max(insets.top, 24) + 6,
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.bannerCard,
          {
            backgroundColor: theme.isDark ? '#1A1D27' : '#FFFFFF',
            borderColor: theme.isDark ? '#333A4D' : '#E2E8F0',
            shadowColor: '#000000',
          },
          pressed && styles.bannerPressed,
        ]}
      >
        {/* App Info Header Bar */}
        <View style={styles.topRow}>
          <View style={styles.appHeaderLeft}>
            <View style={[styles.iconCircle, { backgroundColor: theme.coralLight }]}>
              <Bell size={13} color={theme.coral} strokeWidth={2.5} />
            </View>
            <Text style={[styles.appName, { color: theme.text }]}>
              Remio Routine AI
            </Text>
            <View style={styles.dot} />
            <Text style={[styles.timeText, { color: theme.mutedText }]}>Now</Text>
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              dismissBanner();
            }}
            hitSlop={12}
            style={styles.closeBtn}
          >
            <X size={16} color={theme.mutedText} />
          </Pressable>
        </View>

        {/* Content with Solid Contrast */}
        <View style={styles.contentBody}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {activeNotification.title}
          </Text>
          <Text style={[styles.body, { color: theme.secondaryText }]} numberOfLines={3}>
            {activeNotification.body}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 999999,
    elevation: 99999,
  },
  bannerCard: {
    borderRadius: radii['2xl'],
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 25,
    overflow: 'hidden',
  },
  bannerPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  contentBody: {
    gap: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
