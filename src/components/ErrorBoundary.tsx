import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Log crash details in production monitoring systems (e.g. Sentry / Bugsnag) if integrated
    if (__DEV__) {
      console.error('[Root ErrorBoundary caught an unhandled error]:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <AlertTriangle size={40} color="#EF4444" />
            </View>

            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred. Don't worry, your data is safe.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.devErrorBox}>
                <Text style={styles.devErrorTitle}>Dev Error Details:</Text>
                <ScrollView style={styles.devErrorScroll}>
                  <Text style={styles.devErrorText}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo?.componentStack && (
                    <Text style={styles.devStackText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </ScrollView>
              </View>
            )}

            <View style={styles.actionButtons}>
              <Pressable
                onPress={this.handleReset}
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
              >
                <RefreshCw size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1117',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  devErrorBox: {
    width: '100%',
    maxHeight: 180,
    backgroundColor: '#1E2330',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 24,
  },
  devErrorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F87171',
    marginBottom: 4,
  },
  devErrorScroll: {
    flex: 1,
  },
  devErrorText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#F3F4F6',
    marginBottom: 6,
  },
  devStackText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#9CA3AF',
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.8,
  },
});
