import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserCheck, Edit3 } from 'lucide-react-native';

interface ExpertProfileHeaderBarProps {
  onEditPress: () => void;
}

export const ExpertProfileHeaderBar: React.FC<ExpertProfileHeaderBarProps> = ({
  onEditPress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={styles.headerIconCircle}>
          <UserCheck size={20} color="#0369A1" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Expert Profile</Text>
          <Text style={styles.headerSub}>Public credentials & rate settings</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={onEditPress} activeOpacity={0.85}>
        <Edit3 size={15} color="#0369A1" />
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
  },
});

export default ExpertProfileHeaderBar;
