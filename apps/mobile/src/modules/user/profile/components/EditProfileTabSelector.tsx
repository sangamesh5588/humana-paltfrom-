import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type FormTabType = 'appearance' | 'image' | 'details';

interface EditProfileTabSelectorProps {
  activeTab: FormTabType;
  onTabChange: (tab: FormTabType) => void;
}

export const EditProfileTabSelector: React.FC<EditProfileTabSelectorProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.sectionTabsContainer}>
      <TouchableOpacity
        style={[styles.sectionTabBtn, activeTab === 'appearance' && styles.sectionTabBtnActive]}
        onPress={() => onTabChange('appearance')}
      >
        <Text style={[styles.sectionTabLabel, activeTab === 'appearance' && styles.sectionTabLabelActive]}>
          Theme
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.sectionTabBtn, activeTab === 'image' && styles.sectionTabBtnActive]}
        onPress={() => onTabChange('image')}
      >
        <Text style={[styles.sectionTabLabel, activeTab === 'image' && styles.sectionTabLabelActive]}>
          Photo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.sectionTabBtn, activeTab === 'details' && styles.sectionTabBtnActive]}
        onPress={() => onTabChange('details')}
      >
        <Text style={[styles.sectionTabLabel, activeTab === 'details' && styles.sectionTabLabelActive]}>
          Details
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    marginBottom: 24,
  },
  sectionTabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  sectionTabBtnActive: {
    borderBottomColor: '#0D9488', // Active Teal line
  },
  sectionTabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  sectionTabLabelActive: {
    color: '#0D9488',
    fontWeight: 'bold',
  },
});

export default EditProfileTabSelector;
