import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Globe, Check } from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { useUserStore } from '../../store/useUserStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

const LANGUAGES = [
  { id: 'en', name: 'English (US)' },
  { id: 'es', name: 'Spanish (Español)' },
  { id: 'fr', name: 'French (Français)' },
  { id: 'de', name: 'German (Deutsch)' },
  { id: 'ja', name: 'Japanese (日本語)' },
  { id: 'hi', name: 'Hindi (हिन्दी)' },
  { id: 'pt', name: 'Portuguese (Português)' },
];

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const selectedLanguage = useUserStore((s) => s.selectedLanguage);
  const setLanguage = useUserStore((s) => s.setLanguage);

  const [search, setSearch] = useState('');

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectLanguage = (langName: string) => {
    haptics.light();
    setLanguage(langName);
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Language</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <Input
          placeholder="Search languages..."
          value={search}
          onChangeText={setSearch}
          isSearch
          containerStyle={styles.searchWrapper}
        />

        {/* Languages Card List */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {filteredLanguages.map((item, index) => {
            const isSelected = selectedLanguage.startsWith(item.name.split(' ')[0]);
            return (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <View
                    style={[styles.divider, { backgroundColor: theme.divider }]}
                  />
                )}
                <Pressable
                  onPress={() => handleSelectLanguage(item.name)}
                  style={styles.langRow}
                >
                  <View style={styles.langLeft}>
                    <View
                      style={[
                        styles.globeIconCircle,
                        { backgroundColor: theme.cardMuted },
                      ]}
                    >
                      <Globe size={18} color={theme.text} />
                    </View>
                    <Text style={[styles.langName, { color: theme.text }]}>
                      {item.name}
                    </Text>
                  </View>

                  {isSelected && (
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: theme.primary },
                      ]}
                    >
                      <Check
                        size={14}
                        color={theme.isDark ? '#0B0C10' : '#FFFFFF'}
                        strokeWidth={3}
                      />
                    </View>
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}
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
  searchWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    overflow: 'hidden',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  globeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langName: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
});
