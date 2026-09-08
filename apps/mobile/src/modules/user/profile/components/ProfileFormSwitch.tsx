import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface ProfileFormSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const ProfileFormSwitch: React.FC<ProfileFormSwitchProps> = ({
  label,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.switchGroup}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
        thumbColor={value ? '#0D9488' : '#F1F5F9'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  switchLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

export default ProfileFormSwitch;
