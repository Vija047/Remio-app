import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Home,
  Car,
  Pill,
  Sprout,
  PawPrint,
  User,
  FileText,
  Trash2,
  Sparkles,
  Dumbbell,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Coffee,
  Heart,
  Wrench,
  DollarSign,
  X,
  Check,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Category } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

interface IconPreset {
  name: string;
  emoji: string;
  icon: (color: string) => React.ReactNode;
}

const ICON_PRESETS: IconPreset[] = [
  { name: 'Sparkles', emoji: '✨', icon: (c) => <Sparkles size={20} color={c} /> },
  { name: 'Dumbbell', emoji: '🏋️', icon: (c) => <Dumbbell size={20} color={c} /> },
  { name: 'ShoppingCart', emoji: '🛒', icon: (c) => <ShoppingCart size={20} color={c} /> },
  { name: 'Briefcase', emoji: '💼', icon: (c) => <Briefcase size={20} color={c} /> },
  { name: 'GraduationCap', emoji: '🎓', icon: (c) => <GraduationCap size={20} color={c} /> },
  { name: 'Coffee', emoji: '☕', icon: (c) => <Coffee size={20} color={c} /> },
  { name: 'Heart', emoji: '❤️', icon: (c) => <Heart size={20} color={c} /> },
  { name: 'DollarSign', emoji: '💰', icon: (c) => <DollarSign size={20} color={c} /> },
  { name: 'Wrench', emoji: '🔧', icon: (c) => <Wrench size={20} color={c} /> },
  { name: 'Home', emoji: '🏠', icon: (c) => <Home size={20} color={c} /> },
  { name: 'Car', emoji: '🚗', icon: (c) => <Car size={20} color={c} /> },
  { name: 'Pill', emoji: '💊', icon: (c) => <Pill size={20} color={c} /> },
  { name: 'Sprout', emoji: '🌱', icon: (c) => <Sprout size={20} color={c} /> },
  { name: 'PawPrint', emoji: '🐾', icon: (c) => <PawPrint size={20} color={c} /> },
  { name: 'User', emoji: '👤', icon: (c) => <User size={20} color={c} /> },
  { name: 'FileText', emoji: '📄', icon: (c) => <FileText size={20} color={c} /> },
];

export default function CategoriesManagementScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const categories = useTaskStore((s) => s.categories);
  const addCategory = useTaskStore((s) => s.addCategory);
  const deleteCategory = useTaskStore((s) => s.deleteCategory);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconPreset>(ICON_PRESETS[0]);

  const getCategoryIcon = (name: string, iconName?: string) => {
    const key = (iconName || name).toLowerCase();
    switch (key) {
      case 'home':
        return <Home size={22} color={theme.text} />;
      case 'car':
        return <Car size={22} color={theme.text} />;
      case 'health':
      case 'pill':
        return <Pill size={22} color={theme.text} />;
      case 'plants':
      case 'sprout':
        return <Sprout size={22} color={theme.text} />;
      case 'pets':
      case 'pawprint':
        return <PawPrint size={22} color={theme.text} />;
      case 'personal':
      case 'user':
        return <User size={22} color={theme.text} />;
      case 'dumbbell':
      case 'fitness':
        return <Dumbbell size={22} color={theme.text} />;
      case 'shoppingcart':
      case 'shopping':
        return <ShoppingCart size={22} color={theme.text} />;
      case 'briefcase':
      case 'work':
        return <Briefcase size={22} color={theme.text} />;
      case 'graduationcap':
      case 'study':
      case 'education':
        return <GraduationCap size={22} color={theme.text} />;
      case 'coffee':
        return <Coffee size={22} color={theme.text} />;
      case 'heart':
        return <Heart size={22} color={theme.text} />;
      case 'dollarsign':
      case 'finance':
      case 'money':
        return <DollarSign size={22} color={theme.text} />;
      case 'wrench':
        return <Wrench size={22} color={theme.text} />;
      case 'sparkles':
        return <Sparkles size={22} color={theme.text} />;
      case 'docs':
      case 'documents':
      case 'filetext':
      default:
        return <FileText size={22} color={theme.text} />;
    }
  };

  const handleOpenAddModal = () => {
    haptics.light();
    setNewCatName('');
    setSelectedIcon(ICON_PRESETS[0]);
    setIsModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!newCatName.trim()) {
      haptics.error();
      Alert.alert('Required', 'Please enter a category name.');
      return;
    }

    haptics.success();
    addCategory({
      name: newCatName.trim(),
      emoji: selectedIcon.emoji,
      iconName: selectedIcon.name,
    });
    setIsModalOpen(false);
    setNewCatName('');
  };

  const handleDeleteCategory = (cat: Category) => {
    haptics.light();
    Alert.alert('Remove Category', `Are you sure you want to remove "${cat.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCategory(cat.id),
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Categories</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Routine Categories</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Organize your routines by life areas and categories.
          </Text>
        </View>

        {/* Categories List */}
        <View style={styles.listContainer}>
          {categories.map((cat) => (
            <View
              key={cat.id}
              style={[
                styles.categoryRow,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.leftGroup}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: theme.cardMuted },
                  ]}
                >
                  {getCategoryIcon(cat.name, cat.iconName)}
                </View>
                <View>
                  <Text style={[styles.categoryName, { color: theme.text }]}>
                    {cat.name}
                  </Text>
                  {cat.isCustom && (
                    <Text style={[styles.customBadge, { color: theme.coral }]}>Custom</Text>
                  )}
                </View>
              </View>

              <Pressable
                onPress={() => handleDeleteCategory(cat)}
                style={({ pressed }) => [styles.deleteBtn, pressed && styles.btnPressed]}
                hitSlop={8}
              >
                <Trash2 size={18} color={theme.mutedText} />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Add New Category - Single Row Horizontal Button */}
        <Pressable
          onPress={handleOpenAddModal}
          style={({ pressed }) => [
            styles.addCategoryRowBtn,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.border,
            },
            pressed && styles.cardPressed,
          ]}
        >
          <View style={[styles.plusCircleSmall, { backgroundColor: theme.coral }]}>
            <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={[styles.addCategoryText, { color: theme.text }]}>
            Add New Category
          </Text>
        </Pressable>
      </ScrollView>

      {/* Add Category Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setIsModalOpen(false)} />

          <View style={[styles.modalSheet, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Category</Text>
              <Pressable
                onPress={() => setIsModalOpen(false)}
                style={styles.closeBtn}
                hitSlop={8}
              >
                <X size={20} color={theme.secondaryText} />
              </Pressable>
            </View>

            {/* Category Name Input */}
            <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Category Name</Text>
            <View
              style={[
                styles.textInputWrapper,
                { backgroundColor: theme.cardMuted, borderColor: theme.border },
              ]}
            >
              <TextInput
                value={newCatName}
                onChangeText={setNewCatName}
                placeholder="e.g. Fitness, Groceries, Finance..."
                placeholderTextColor={theme.mutedText}
                style={[styles.textInput, { color: theme.text }]}
                autoFocus
                maxLength={30}
              />
            </View>

            {/* Icon Picker */}
            <Text style={[styles.inputLabel, { color: theme.secondaryText, marginTop: 16 }]}>Choose Icon</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconScrollRow}
            >
              {ICON_PRESETS.map((preset) => {
                const isSelected = selectedIcon.name === preset.name;
                return (
                  <Pressable
                    key={preset.name}
                    onPress={() => {
                      haptics.light();
                      setSelectedIcon(preset);
                    }}
                    style={[
                      styles.iconOption,
                      {
                        backgroundColor: isSelected ? theme.coralLight : theme.cardMuted,
                        borderColor: isSelected ? theme.coral : 'transparent',
                      },
                    ]}
                  >
                    {preset.icon(isSelected ? theme.coral : theme.text)}
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setIsModalOpen(false)}
                style={[styles.modalBtnCancel, { borderColor: theme.border }]}
              >
                <Text style={[styles.cancelBtnText, { color: theme.secondaryText }]}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleSaveCategory}
                style={[styles.modalBtnSave, { backgroundColor: theme.coral }]}
              >
                <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.saveBtnText}>Save Category</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  btnPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  listContainer: {
    gap: 12,
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii['2xl'],
    borderWidth: 1,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
  },
  customBadge: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  // Sleek single horizontal row for Add New Category button
  addCategoryRowBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radii['2xl'],
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cardPressed: {
    opacity: 0.8,
  },
  plusCircleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    borderWidth: 1,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInputWrapper: {
    borderWidth: 1,
    borderRadius: radii['xl'],
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  iconScrollRow: {
    gap: 10,
    paddingVertical: 4,
    marginBottom: 24,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: radii['xl'],
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnCancel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  modalBtnSave: {
    flex: 1.4,
    borderRadius: radii.full,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

