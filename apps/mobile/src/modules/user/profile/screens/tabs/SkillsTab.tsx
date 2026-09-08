import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  LayoutAnimation
} from 'react-native';
import { 
  Star, 
  X, 
  Plus 
} from 'lucide-react-native';
import Theme from '../../../../../app/theme';
import useAuthStore from '../../../../../core/auth/store';

export const SkillsTab: React.FC = () => {
  const { user } = useAuthStore();
  const p = user?.profile;

  // Local state initialized from profile
  const [skillsList, setSkillsList] = useState<string[]>(p?.skills || ['React Native', 'TypeScript', 'Node.js', 'NestJS']);
  const [primarySkills, setPrimarySkills] = useState<string[]>(['React Native', 'TypeScript']);
  const [newSkillText, setNewSkillText] = useState('');

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    
    // Add skill with smooth layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSkillsList([...skillsList, newSkillText.trim()]);
    setNewSkillText('');
  };

  const handleRemoveSkill = (skill: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSkillsList(skillsList.filter(s => s !== skill));
    setPrimarySkills(primarySkills.filter(s => s !== skill));
  };

  const togglePrimarySkill = (skill: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (primarySkills.includes(skill)) {
      setPrimarySkills(primarySkills.filter(s => s !== skill));
    } else {
      setPrimarySkills([...primarySkills, skill]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Skills Management</Text>
        <Text style={styles.helperText}>Tap skill to toggle Primary highlight (⭐) or remove it (🗑️).</Text>
        
        <View style={styles.badgeGrid}>
          {skillsList.map((skill) => {
            const isPrimary = primarySkills.includes(skill);
            return (
              <View key={skill} style={[styles.skillBadge, isPrimary && styles.skillBadgePrimary]}>
                <TouchableOpacity onPress={() => togglePrimarySkill(skill)} style={styles.skillBtn}>
                  <Star size={12} color={isPrimary ? '#CA8A04' : '#64748B'} fill={isPrimary ? '#F59E0B' : 'transparent'} style={{ marginRight: 4 }} />
                  <Text style={[styles.skillBadgeText, isPrimary && styles.skillBadgeTextPrimary]}>{skill}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => handleRemoveSkill(skill)} style={styles.skillDeleteBtn}>
                  <X size={12} color="#64748B" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Add skill input bar */}
        <View style={styles.addSkillWrapper}>
          <TextInput
            style={styles.addSkillInput}
            placeholder="Type to search/add skill..."
            placeholderTextColor="#94A3B8"
            value={newSkillText}
            onChangeText={setNewSkillText}
            onSubmitEditing={handleAddSkill}
          />
          <TouchableOpacity onPress={handleAddSkill} style={styles.addSkillBtn}>
            <Plus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  sectionBlock: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 18,
  },
  skillBadgePrimary: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  skillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillBadgeText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  skillBadgeTextPrimary: {
    fontWeight: '700',
    color: '#92400E',
  },
  skillDeleteBtn: {
    marginLeft: 6,
    padding: 2,
  },
  addSkillWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addSkillInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  addSkillBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default SkillsTab;
