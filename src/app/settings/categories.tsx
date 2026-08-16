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
  GripVertical,
  Edit2,
  Plus,
  Home,
  Car,
  Pill,
  Sprout,
  PawPrint,
  User,
  FileText,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Category } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function CategoriesManagementScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const categories = useTaskStore((s) => s.categories);
  const addCategory = useTaskStore((s) => s.addCategory);
  const deleteCategory = useTaskStore((s) => s.deleteCategory);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'home':
        return <Home size={22} color={colors.primaryText} />;
      case 'car':
        return <Car size={22} color={colors.primaryText} />;
      case 'health':
        return <Pill size={22} color={colors.primaryText} />;
      case 'plants':
        return <Sprout size={22} color={colors.primaryText} />;
      case 'pets':
        return <PawPrint size={22} color={colors.primaryText} />;
      case 'personal':
        return <User size={22} color={colors.primaryText} />;
      case 'documents':
      default:
        return <FileText size={22} color={colors.primaryText} />;
    }
  };

  const handleAddNewCategory = () => {
    haptics.light();
    Alert.prompt
      ? Alert.prompt('New Category', 'Enter category name:', (name) => {
          if (name && name.trim()) {
            addCategory({
              name: name.trim(),
              emoji: '✨',
              iconName: 'Sparkles',
            });
          }
        })
      : addCategory({
          name: 'Fitness',
          emoji: '💪',
          iconName: 'Dumbbell',
        });
  };

  const handleEditCategory = (cat: Category) => {
    haptics.light();
    Alert.alert(cat.name, 'Category Options', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCategory(cat.id),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Manage your life areas</Text>
          <Text style={styles.subtitle}>
            Drag to reorder how they appear in your dashboard.
          </Text>
        </View>

        {/* Categories List */}
        <View style={styles.listContainer}>
          {categories.map((cat) => (
            <View key={cat.id} style={styles.categoryRow}>
              <View style={styles.leftGroup}>
                <GripVertical size={20} color="#D1D5DB" style={styles.dragHandle} />
                <View style={styles.iconCircle}>
                  {getCategoryIcon(cat.name)}
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>

              <Pressable
                onPress={() => handleEditCategory(cat)}
                style={({ pressed }) => [styles.editBtn, pressed && styles.btnPressed]}
              >
                <Edit2 size={18} color="#9CA3AF" />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Add New Category Dashed Box */}
        <Pressable
          onPress={handleAddNewCategory}
          style={({ pressed }) => [styles.addCardDashed, pressed && styles.cardPressed]}
        >
          <View style={styles.plusCircle}>
            <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.addCategoryText}>Add New Category</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: colors.primaryText,
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
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
  },
  listContainer: {
    gap: 16,
    marginBottom: 28,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dragHandle: {
    marginRight: -4,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
  },
  editBtn: {
    padding: 8,
  },
  addCardDashed: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: radii['2xl'],
    backgroundColor: '#FAFAFA',
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cardPressed: {
    backgroundColor: '#F3F4F6',
  },
  plusCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
});
