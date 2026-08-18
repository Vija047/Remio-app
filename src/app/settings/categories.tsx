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
  Plus,
  Home,
  Car,
  Pill,
  Sprout,
  PawPrint,
  User,
  FileText,
  Trash2,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Category } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function CategoriesManagementScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const categories = useTaskStore((s) => s.categories);
  const addCategory = useTaskStore((s) => s.addCategory);
  const deleteCategory = useTaskStore((s) => s.deleteCategory);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'home':
        return <Home size={22} color={theme.text} />;
      case 'car':
        return <Car size={22} color={theme.text} />;
      case 'health':
        return <Pill size={22} color={theme.text} />;
      case 'plants':
        return <Sprout size={22} color={theme.text} />;
      case 'pets':
        return <PawPrint size={22} color={theme.text} />;
      case 'personal':
        return <User size={22} color={theme.text} />;
      case 'documents':
      default:
        return <FileText size={22} color={theme.text} />;
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
          name: `Custom ${categories.length + 1}`,
          emoji: '✨',
          iconName: 'Sparkles',
        });
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
                  {getCategoryIcon(cat.name)}
                </View>
                <Text style={[styles.categoryName, { color: theme.text }]}>
                  {cat.name}
                </Text>
              </View>

              <Pressable
                onPress={() => handleDeleteCategory(cat)}
                style={({ pressed }) => [styles.deleteBtn, pressed && styles.btnPressed]}
              >
                <Trash2 size={18} color={theme.mutedText} />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Add New Category Dashed Box */}
        <Pressable
          onPress={handleAddNewCategory}
          style={({ pressed }) => [
            styles.addCardDashed,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.border,
            },
            pressed && styles.cardPressed,
          ]}
        >
          <View style={[styles.plusCircle, { backgroundColor: theme.coral }]}>
            <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={[styles.addCategoryText, { color: theme.text }]}>
            Add New Category
          </Text>
        </Pressable>
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
    marginBottom: 24,
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
  deleteBtn: {
    padding: 8,
  },
  addCardDashed: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radii['2xl'],
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cardPressed: {
    opacity: 0.8,
  },
  plusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
