import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';
import useAuthStore from '../../../../../core/auth/store';

export const GoalsTab: React.FC = () => {
  const { user } = useAuthStore();
  const p = user?.profile;

  return (
    <View style={styles.container}>
      {/* Aspirations */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Aspirations</Text>
        <Text style={styles.bioText}>{p?.aspirations || "No career aspirations specified."}</Text>
      </View>

      <View style={styles.blockDivider} />

      {/* Challenges */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Challenges</Text>
        <Text style={styles.bioText}>{p?.challenges || "No current challenges listed."}</Text>
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
    marginBottom: 12,
  },
  blockDivider: {
    height: 8,
    backgroundColor: '#F1F5F9',
  },
  bioText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
});

export default GoalsTab;
