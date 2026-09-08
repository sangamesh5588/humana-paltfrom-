import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import ApiClient from '../../../../../../core/api/client';

interface BasicInfoStepProps {
  title: string;
  onChangeTitle: (val: string) => void;
  description: string;
  onChangeDescription: (val: string) => void;
  language: string;
  onChangeLanguage: (val: string) => void;
  category: string;
  onChangeCategory: (val: string) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  title,
  onChangeTitle,
  description,
  onChangeDescription,
  language,
  onChangeLanguage,
  category,
  onChangeCategory,
}) => {
  const [categoriesList, setCategoriesList] = useState<{ name: string; icon: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    ApiClient.get('/sessions/categories')
      .then((res) => {
        const data = res.data || [];
        if (data && data.length > 0) {
          const iconMap: { [key: string]: string } = {
            'college-students': '🎓',
            'career-switcher': '🔄',
            'abroad-studies': '✈️',
            'tech-interview-prep': '💻',
            'executive-leadership': '👔',
            'startup-product': '🚀',
          };
          setCategoriesList(
            data.map((c: any) => ({
              name: c.name,
              icon: iconMap[c.slug] || '🌟',
            }))
          );
        } else {
          setCategoriesList([
            { name: 'College Students', icon: '🎓' },
            { name: 'Career Switcher', icon: '🔄' },
            { name: 'Abroad Studies', icon: '✈️' },
            { name: 'Tech Interview Prep', icon: '💻' },
            { name: 'Executive Leadership', icon: '👔' },
            { name: 'Startup & Product', icon: '🚀' },
          ]);
        }
      })
      .catch(() => {
        setCategoriesList([
          { name: 'College Students', icon: '🎓' },
          { name: 'Career Switcher', icon: '🔄' },
          { name: 'Abroad Studies', icon: '✈️' },
          { name: 'Tech Interview Prep', icon: '💻' },
          { name: 'Executive Leadership', icon: '👔' },
          { name: 'Startup & Product', icon: '🚀' },
        ]);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Basic Information</Text>

      <Text style={styles.inputTitle}>Session Title</Text>
      <TextInput
        style={styles.textInput}
        placeholder="e.g. How I Cracked Google After 3 Attempts"
        value={title}
        onChangeText={onChangeTitle}
      />

      <Text style={styles.inputTitle}>Short Description</Text>
      <TextInput
        style={[styles.textInput, styles.textArea]}
        placeholder="Explain the value proposition of this session."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={onChangeDescription}
      />

      <Text style={styles.inputTitle}>Language</Text>
      <TextInput
        style={styles.textInput}
        placeholder="e.g. English, Hindi, Telugu"
        placeholderTextColor="#94A3B8"
        value={language}
        onChangeText={onChangeLanguage}
      />

      <Text style={styles.inputTitle}>Select Category (Fetched Live from Supabase)</Text>
      {loadingCategories ? (
        <ActivityIndicator size="small" color="#0284C7" style={{ alignSelf: 'flex-start', marginVertical: 8 }} />
      ) : (
        <View style={styles.categoryGrid}>
          {categoriesList.map((item) => {
            const isSelected = category === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.categoryPill, isSelected && styles.selectedCategoryPill]}
                activeOpacity={0.8}
                onPress={() => onChangeCategory(item.name)}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text style={[styles.categoryPillText, isSelected && styles.selectedCategoryPillText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  inputTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginTop: 18,
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    marginTop: 4,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  selectedCategoryPill: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  selectedCategoryPillText: {
    color: '#FFFFFF',
  },
});

export default BasicInfoStep;
