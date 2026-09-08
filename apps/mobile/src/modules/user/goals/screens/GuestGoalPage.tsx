import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Target } from 'lucide-react-native';
import useAuthStore from '../../../../core/auth/store';

export const GuestGoalPage: React.FC = () => {
  const setGuest = useAuthStore((state) => state.setGuest);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentCard}>
          {/* Icon Badge */}
          <View style={styles.iconCircle}>
            <Target size={38} color="#0D9488" strokeWidth={2} />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Track Your Goals</Text>

          {/* Description */}
          <Text style={styles.description}>
            Sign in or create an account to define your career aspirations, map your steps, and get guided mentorship recommendations.
          </Text>

          {/* Action Button */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setGuest(false)} 
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Log In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contentCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#111827',
    borderRadius: 28,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuestGoalPage;
