import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
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
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTaskStore } from '../../store/useTaskStore';
import { useHaptics } from '../../hooks/useHaptics';

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
  { id: 'custom', name: 'Custom', emoji: '➕', icon: ({ color, size }) => <Plus size={size} color={color} /> },
];

export default function AddTaskScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [lastCompletedDate, setLastCompletedDate] = useState('2026-05-15');
  const [reminderType, setReminderType] = useState<'ai' | 'manual'>('ai');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Name', 'Please enter a task name.');
      return;
    }

    haptics.success();
    const catItem = CATEGORY_ITEMS.find((c) => c.id === selectedCategory) || CATEGORY_ITEMS[5];

    addTask({
      title: title.trim(),
      emoji: catItem.emoji,
      category: selectedCategory,
      intervalDays: 30,
      lastCompletedDate: lastCompletedDate || new Date().toISOString().split('T')[0],
      nextDueDate: '2026-06-15',
      dueLabel: 'Next Week',
      smartWindowStatus: 'Open',
      confidence: 94,
      reminderType,
      notes: notes.trim(),
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color="#8C351B" />
        </Pressable>
        <Text style={styles.headerTitle}>Add New Task</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Task Name */}
        <Text style={styles.fieldLabel}>Task Name</Text>
        <Input
          placeholder="Example: Haircut"
          value={title}
          onChangeText={setTitle}
          containerStyle={styles.inputWrapper}
        />

        {/* Category Grid */}
        <Text style={styles.fieldLabel}>Category</Text>
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
                  isSelected ? styles.categoryTileActive : styles.categoryTileInactive,
                ]}
              >
                <View style={styles.catIconContainer}>
                  {cat.icon({
                    color: isSelected ? colors.coral : colors.primaryText,
                    size: 24,
                  })}
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    isSelected ? styles.catNameActive : styles.catNameInactive,
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
        <Text style={styles.fieldLabel}>Last Completed</Text>
        <Input
          placeholder="mm/dd/yyyy"
          value={lastCompletedDate}
          onChangeText={setLastCompletedDate}
          leftIcon={<Calendar size={20} color={colors.secondaryText} />}
          containerStyle={styles.inputWrapper}
        />

        {/* Reminder Type Segment */}
        <Text style={styles.fieldLabel}>Reminder Type</Text>
        <View style={styles.segmentContainer}>
          <Pressable
            onPress={() => {
              haptics.light();
              setReminderType('ai');
            }}
            style={[
              styles.segmentBtn,
              reminderType === 'ai' ? styles.segmentActive : styles.segmentInactive,
            ]}
          >
            <Sparkles
              size={18}
              color={reminderType === 'ai' ? '#FFFFFF' : colors.primaryText}
            />
            <Text
              style={[
                styles.segmentText,
                reminderType === 'ai' ? styles.segmentTextActive : styles.segmentTextInactive,
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
              reminderType === 'manual' ? styles.segmentActive : styles.segmentInactive,
            ]}
          >
            <Sliders
              size={18}
              color={reminderType === 'manual' ? '#FFFFFF' : colors.primaryText}
            />
            <Text
              style={[
                styles.segmentText,
                reminderType === 'manual' ? styles.segmentTextActive : styles.segmentTextInactive,
              ]}
            >
              Manual
            </Text>
          </Pressable>
        </View>

        <Text style={styles.reminderExplainer}>
          RoutineAI will intelligently schedule this based on optimal maintenance windows.
        </Text>

        {/* Optional Notes */}
        <Text style={styles.fieldLabel}>Optional Notes</Text>
        <Input
          placeholder="Add any details here..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          containerStyle={styles.inputWrapper}
        />

        {/* Save Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Save Task"
            onPress={handleSave}
            variant="coral"
            size="lg"
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
    backgroundColor: '#FFF8F6',
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
  btnPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8C351B',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 10,
  },
  inputWrapper: {
    marginBottom: 22,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryTile: {
    width: '22%',
    height: 84,
    borderRadius: radii['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1.5,
  },
  categoryTileActive: {
    backgroundColor: '#FFF0ED',
    borderColor: colors.coral,
  },
  categoryTileInactive: {
    backgroundColor: '#F5ECE8',
    borderColor: 'transparent',
  },
  catIconContainer: {
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  catNameActive: {
    color: colors.coral,
    fontWeight: '700',
  },
  catNameInactive: {
    color: colors.primaryText,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5ECE8',
    borderRadius: radii.full,
    padding: 4,
    gap: 6,
    marginBottom: 10,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radii.full,
    gap: 8,
  },
  segmentActive: {
    backgroundColor: colors.coral,
  },
  segmentInactive: {
    backgroundColor: 'transparent',
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  segmentTextInactive: {
    color: colors.primaryText,
  },
  reminderExplainer: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
    marginBottom: 24,
  },
  buttonWrapper: {
    marginTop: 10,
  },
});
