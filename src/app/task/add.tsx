import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Home,
  Car,
  Heart,
  Sprout,
  PawPrint,
  Scissors,
  FileText,
  Plus,
  Calendar,
  Sparkles,
  Sliders,
  Check,
  Wand2,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { api } from '../../services/api';
import { toLocalDateString } from '../../utils/dateUtils';

interface CategoryGridItem {
  id: string;
  name: string;
  emoji: string;
  icon: (props: { color: string; size: number }) => React.ReactNode;
}

const CATEGORY_ITEMS: CategoryGridItem[] = [
  { id: 'home', name: 'Home', emoji: '🏠', icon: ({ color, size }) => <Home size={size} color={color} /> },
  { id: 'car', name: 'Car', emoji: '🚗', icon: ({ color, size }) => <Car size={size} color={color} /> },
  { id: 'health', name: 'Health', emoji: '💊', icon: ({ color, size }) => <Heart size={size} color={color} /> },
  { id: 'plants', name: 'Plants', emoji: '🌱', icon: ({ color, size }) => <Sprout size={size} color={color} /> },
  { id: 'pets', name: 'Pets', emoji: '🐶', icon: ({ color, size }) => <PawPrint size={size} color={color} /> },
  { id: 'personal', name: 'Personal', emoji: '✂️', icon: ({ color, size }) => <Scissors size={size} color={color} /> },
  { id: 'docs', name: 'Docs', emoji: '📄', icon: ({ color, size }) => <FileText size={size} color={color} /> },
  { id: 'custom', name: 'Custom', emoji: '✨', icon: ({ color, size }) => <Plus size={size} color={color} /> },
];

export default function AddTaskScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const createTask = useTaskStore((s) => s.createTask);

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [lastCompletedDate, setLastCompletedDate] = useState(
    toLocalDateString(new Date())
  );

  const [reminderType, setReminderType] = useState<'ai' | 'manual'>('ai');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsingAi, setParsingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiParser, setShowAiParser] = useState(false);

  const handleAiParse = async () => {
    if (!aiPrompt.trim()) {
      Alert.alert('AI Helper', 'Enter a prompt like: "Water the snake plant every 2 weeks"');
      return;
    }

    try {
      setParsingAi(true);
      haptics.light();
      const parsed = await api.parseTask(aiPrompt.trim());
      if (parsed) {
        if (parsed.title) setTitle(parsed.title);
        if (parsed.category) {
          const matched = CATEGORY_ITEMS.find((c) => c.id === parsed.category.toLowerCase());
          if (matched) setSelectedCategory(matched.id);
        }
        if (parsed.description || parsed.notes) {
          setNotes(parsed.description || parsed.notes || '');
        }
        haptics.success();
        setShowAiParser(false);
      }
    } catch {
      Alert.alert('AI Assist', 'Could not parse prompt. You can enter details manually.');
    } finally {
      setParsingAi(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      haptics.error();
      Alert.alert('Missing Name', 'Please enter a task name.');
      return;
    }

    try {
      setLoading(true);
      haptics.success();

      await createTask({
        title: title.trim(),
        category: selectedCategory,
        description: notes.trim() || undefined,
        reminderEnabled: true,
        reminderTime: reminderTime,
        lastCompletedDate: lastCompletedDate || undefined,
      });

      router.back();
    } catch (err: any) {
      haptics.error();
      Alert.alert('Save Failed', err.message || 'Could not create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add New Task</Text>
        <Pressable
          onPress={() => setShowAiParser(!showAiParser)}
          style={({ pressed }) => [styles.aiHeaderBtn, pressed && styles.btnPressed]}
        >
          <Wand2 size={20} color={theme.coral} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Natural Language Bar */}
        {showAiParser && (
          <View
            style={[
              styles.aiParserBox,
              {
                backgroundColor: theme.coralLight,
                borderColor: theme.coral,
              },
            ]}
          >
            <View style={styles.aiParserHeader}>
              <Sparkles size={16} color={theme.coral} />
              <Text style={[styles.aiParserTitle, { color: theme.coral }]}>
                AI Natural Language Setup
              </Text>
            </View>
            <Input
              placeholder="e.g. Change car engine oil every 6 months"
              value={aiPrompt}
              onChangeText={setAiPrompt}
              containerStyle={styles.aiInput}
            />
            <Button
              title={parsingAi ? 'Analyzing...' : 'Auto-Fill with AI ✨'}
              onPress={handleAiParse}
              variant="coral"
              size="sm"
              disabled={parsingAi}
            />
          </View>
        )}

        {/* Task Name */}
        <Text style={[styles.fieldLabel, { color: theme.text }]}>Task Name</Text>
        <Input
          placeholder="Example: Haircut"
          value={title}
          onChangeText={setTitle}
          containerStyle={styles.inputWrapper}
        />

        {/* Category Grid */}
        <Text style={[styles.fieldLabel, { color: theme.text }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => {
                  haptics.light();
                  setSelectedCategory(cat.id);
                }}
                style={[
                  styles.categoryTile,
                  {
                    backgroundColor: isSelected ? theme.coralLight : theme.cardMuted,
                    borderColor: isSelected ? theme.coral : 'transparent',
                  },
                ]}
              >
                <View style={styles.catIconContainer}>
                  {cat.icon({
                    color: isSelected ? theme.coral : theme.text,
                    size: 24,
                  })}
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    {
                      color: isSelected ? theme.coral : theme.text,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Last Completed Date */}
        <Text style={[styles.fieldLabel, { color: theme.text }]}>Last Completed Date</Text>
        <Input
          placeholder="YYYY-MM-DD"
          value={lastCompletedDate}
          onChangeText={setLastCompletedDate}
          leftIcon={<Calendar size={20} color={theme.secondaryText} />}
          containerStyle={styles.inputWrapper}
        />

        {/* Reminder Type Segment */}
        <Text style={[styles.fieldLabel, { color: theme.text }]}>Reminder Type</Text>
        <View
          style={[
            styles.segmentContainer,
            { backgroundColor: theme.cardMuted },
          ]}
        >
          <Pressable
            onPress={() => {
              haptics.light();
              setReminderType('ai');
            }}
            style={[
              styles.segmentBtn,
              reminderType === 'ai' && { backgroundColor: theme.coral },
            ]}
          >
            <Sparkles
              size={18}
              color={reminderType === 'ai' ? '#FFFFFF' : theme.text}
            />
            <Text
              style={[
                styles.segmentText,
                { color: reminderType === 'ai' ? '#FFFFFF' : theme.text },
              ]}
            >
              AI Smart
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              haptics.light();
              setReminderType('manual');
            }}
            style={[
              styles.segmentBtn,
              reminderType === 'manual' && { backgroundColor: theme.coral },
            ]}
          >
            <Sliders
              size={18}
              color={reminderType === 'manual' ? '#FFFFFF' : theme.text}
            />
            <Text
              style={[
                styles.segmentText,
                { color: reminderType === 'manual' ? '#FFFFFF' : theme.text },
              ]}
            >
              Manual
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.reminderExplainer, { color: theme.secondaryText }]}>
          Remio will automatically predict optimal recurring intervals based on your actual completion habits.
        </Text>

        {/* Optional Notes */}
        <Text style={[styles.fieldLabel, { color: theme.text }]}>Optional Notes</Text>
        <Input
          placeholder="Add details, sizes, model numbers, or specifics..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          containerStyle={styles.inputWrapper}
        />

        {/* Save Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title={loading ? 'Saving Routine...' : 'Save Routine'}
            onPress={handleSave}
            variant="coral"
            size="lg"
            disabled={loading}
            icon={<Check size={20} color="#FFFFFF" strokeWidth={3} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    padding: 6,
  },
  aiHeaderBtn: {
    padding: 6,
  },
  btnPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  aiParserBox: {
    borderRadius: radii['2xl'],
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  aiParserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiParserTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  aiInput: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryTile: {
    width: '22.5%',
    height: 80,
    borderRadius: radii['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderWidth: 1.5,
  },
  catIconContainer: {
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 11,
    textAlign: 'center',
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: radii.full,
    padding: 4,
    gap: 6,
    marginBottom: 8,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radii.full,
    gap: 8,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reminderExplainer: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  buttonWrapper: {
    marginTop: 8,
  },
});
