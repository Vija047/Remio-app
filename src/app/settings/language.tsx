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
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { SUPPORTED_LANGUAGES } from '../../data/mock';
import { useUserStore } from '../../store/useUserStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const selectedLanguage = useUserStore((s) => s.selectedLanguage);
  const setLanguage = useUserStore((s) => s.setLanguage);

  const [search, setSearch] = useState('');

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectLanguage = (langName: string) => {
    haptics.light();
    setLanguage(langName);
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
        <Text style={styles.headerTitle}>Language</Text>
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
        <View style={styles.card}>
          {filteredLanguages.map((item, index) => {
            const isSelected = selectedLanguage.startsWith(item.name.split(' ')[0]);
            return (
              <React.Fragment key={item.id}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  onPress={() => handleSelectLanguage(item.name)}
                  style={styles.langRow}
                >
                  <View style={styles.langLeft}>
                    <View style={styles.globeIconCircle}>
                      <Globe size={18} color={colors.primaryText} />
                    </View>
                    <Text style={styles.langName}>{item.name}</Text>
                  </View>

                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
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
  searchWrapper: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 72,
  },
});
