import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeftRight, User } from 'lucide-react-native';

interface ModeSwitchToggleProps {
  currentMode?: 'user' | 'expert';
  onSwitchToUser: () => void;
}

export const ModeSwitchToggle: React.FC<ModeSwitchToggleProps> = ({
  onSwitchToUser,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ArrowLeftRight size={18} color="#2563EB" />
        <Text style={styles.title}>Platform Mode</Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={onSwitchToUser}
        activeOpacity={0.85}
      >
        <View style={styles.leftCol}>
          <View style={styles.iconCircle}>
            <User size={20} color="#2563EB" />
          </View>

          <View style={styles.textCol}>
            <Text style={styles.modeTitle}>Switch to User Mode</Text>
            <Text style={styles.modeSub}>Browse experts, goals & community</Text>
          </View>
        </View>

        <View style={styles.actionChip}>
          <Text style={styles.actionChipText}>Switch</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    gap: 2,
    flex: 1,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
  },
  modeSub: {
    fontSize: 12,
    color: '#3B82F6',
  },
  actionChip: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default ModeSwitchToggle;
