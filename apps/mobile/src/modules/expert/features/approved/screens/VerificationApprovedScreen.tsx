import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react-native';

export const VerificationApprovedScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mainCard, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Minimal Hero Icon */}
        <View style={styles.iconWrapper}>
          <ShieldCheck size={52} color="#059669" />
        </View>

        <View style={styles.statusTag}>
          <Text style={styles.statusTagText}>VERIFIED EXPERT</Text>
        </View>

        <Text style={styles.title}>You are a Verified Expert!</Text>
        <Text style={styles.subtitle}>
          Your application has been approved. Your official badge and expert tools are now unlocked.
        </Text>

        {/* Key Benefits Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Unlocked Benefits</Text>

          <View style={styles.benefitRow}>
            <CheckCircle2 size={18} color="#059669" />
            <Text style={styles.benefitText}>Official Verified Badge on Profile</Text>
          </View>

          <View style={styles.benefitRow}>
            <CheckCircle2 size={18} color="#059669" />
            <Text style={styles.benefitText}>Priority Placement in Search</Text>
          </View>

          <View style={styles.benefitRow}>
            <CheckCircle2 size={18} color="#059669" />
            <Text style={styles.benefitText}>Direct Paid Consultation Invites</Text>
          </View>
        </View>
      </Animated.View>

      {/* Direct Action to Expert Home */}
      <TouchableOpacity 
        style={styles.dashboardBtn} 
        onPress={() => navigation.navigate('ExpertBottomTabs')}
        activeOpacity={0.88}
      >
        <Text style={styles.dashboardBtnText}>Go to Expert Dashboard</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 28,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusTag: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  benefitsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    gap: 12,
  },
  benefitsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  dashboardBtn: {
    backgroundColor: '#059669',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dashboardBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default VerificationApprovedScreen;
