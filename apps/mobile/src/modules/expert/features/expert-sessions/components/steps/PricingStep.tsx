import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus, ShieldCheck } from 'lucide-react-native';

interface PricingStepProps {
  duration: number;
  onChangeDuration: (val: number) => void;
  price: string;
  onChangePrice: (val: string) => void;
}

const ALLOWED_PRICES = [299, 499, 799, 999, 1499, 1999, 2499, 3499, 4999];

export const PricingStep: React.FC<PricingStepProps> = ({
  duration,
  onChangeDuration,
  price,
  onChangePrice,
}) => {
  const numericPrice = parseInt(price, 10) || 1499;

  const handleStepDown = () => {
    const currentIndex = ALLOWED_PRICES.findIndex((p) => p >= numericPrice);
    if (currentIndex > 0) {
      onChangePrice(ALLOWED_PRICES[currentIndex - 1].toString());
    }
  };

  const handleStepUp = () => {
    const currentIndex = ALLOWED_PRICES.findIndex((p) => p > numericPrice);
    if (currentIndex !== -1 && currentIndex < ALLOWED_PRICES.length) {
      onChangePrice(ALLOWED_PRICES[currentIndex].toString());
    } else if (numericPrice < ALLOWED_PRICES[ALLOWED_PRICES.length - 1]) {
      onChangePrice(ALLOWED_PRICES[ALLOWED_PRICES.length - 1].toString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Session Duration & Pricing</Text>
      <Text style={styles.formSub}>
        Choose your call length and platform standard rate ending in .99 / .49.
      </Text>

      {/* Duration Selector */}
      <Text style={styles.inputTitle}>Call Duration</Text>
      <View style={styles.durationRow}>
        {[30, 45, 60].map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.durationPill, duration === d && styles.durationPillSelected]}
            onPress={() => onChangeDuration(d)}
          >
            <Text style={[styles.durationText, duration === d && styles.durationTextSelected]}>
              {d} Mins
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Recommended Platform Rate Card */}
      <View style={styles.aiRateCard}>
        <View style={styles.aiHeaderRow}>
          <ShieldCheck size={18} color="#0369A1" />
          <Text style={styles.aiHeaderTitle}>Recommended Platform Rate</Text>
        </View>

        <Text style={styles.aiPriceDisplay}>₹{numericPrice}</Text>
        <Text style={styles.aiReasonText}>
          Based on your verified background and {duration}-minute session depth.
        </Text>

        <View style={styles.verifiedQualityBadge}>
          <ShieldCheck size={12} color="#059669" />
          <Text style={styles.verifiedQualityText}>Platform Standard Quality Rate</Text>
        </View>
      </View>

      {/* Stepper Control */}
      <Text style={styles.inputTitle}>Adjust Price (Safe Band: ₹299 – ₹4,999)</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity style={styles.stepperBtn} onPress={handleStepDown}>
          <Minus size={18} color="#0369A1" />
        </TouchableOpacity>

        <View style={styles.stepperValueBox}>
          <Text style={styles.stepperValueText}>₹{numericPrice}</Text>
        </View>

        <TouchableOpacity style={styles.stepperBtn} onPress={handleStepUp}>
          <Plus size={18} color="#0369A1" />
        </TouchableOpacity>
      </View>
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
  formSub: {
    fontSize: 13,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 16,
    lineHeight: 18,
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginTop: 18,
    marginBottom: 8,
  },
  durationRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  durationPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  durationPillSelected: {
    backgroundColor: '#0369A1',
    borderColor: '#0369A1',
  },
  durationText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
  durationTextSelected: {
    color: '#FFFFFF',
  },
  aiRateCard: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0369A1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiPriceDisplay: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  aiReasonText: {
    fontSize: 12,
    color: '#0369A1',
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.85,
  },
  verifiedQualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  verifiedQualityText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
});

export default PricingStep;
