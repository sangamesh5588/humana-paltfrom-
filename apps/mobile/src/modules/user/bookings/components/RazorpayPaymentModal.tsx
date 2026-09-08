import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { CheckCircle2, Lock, Smartphone, CreditCard, Landmark, X } from 'lucide-react-native';

interface RazorpayPaymentModalProps {
  visible: boolean;
  orderData: {
    bookingId: string;
    bookingNumber: string;
    orderId: string;
    amount: number;
    currency: string;
    sessionTitle?: string;
    expertName?: string;
  } | null;
  onClose: () => void;
  onPaymentSuccess: (paymentDetails: {
    bookingId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
}

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  visible,
  orderData,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [processing, setProcessing] = useState(false);

  if (!orderData) return null;

  const handlePayNow = async () => {
    setProcessing(true);
    try {
      // Simulate real Razorpay authorization & signature generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentId = `pay_${Date.now().toString().slice(-10)}${Math.floor(100 + Math.random() * 900)}`;
      const signature = `sig_verified_${Date.now().toString().slice(-8)}`;

      onPaymentSuccess({
        bookingId: orderData.bookingId,
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });
    } catch (err: any) {
      Alert.alert('Payment Failed', err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.sheetHeader}>
            <View style={styles.merchantInfo}>
              <View style={styles.razorpayBadge}>
                <Text style={styles.razorpayText}>Razorpay</Text>
              </View>
              <Text style={styles.merchantName}>Human Platform Mentorship</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Amount Hero Box */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Total Amount Payable</Text>
            <Text style={styles.amountText}>₹{orderData.amount.toLocaleString()}</Text>
            <Text style={styles.orderRefText}>Ref: {orderData.bookingNumber}</Text>
          </View>

          {/* Payment Method Selector */}
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          <View style={styles.methodsList}>
            {/* UPI Option */}
            <TouchableOpacity
              style={[styles.methodRow, selectedMethod === 'UPI' && styles.methodRowSelected]}
              onPress={() => setSelectedMethod('UPI')}
              activeOpacity={0.8}
            >
              <View style={[styles.methodIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <Smartphone size={22} color="#166534" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>UPI (Google Pay / PhonePe / Paytm)</Text>
                <Text style={styles.methodSub}>Instant 0% transaction fee payment</Text>
              </View>
              {selectedMethod === 'UPI' && <CheckCircle2 size={20} color="#059669" />}
            </TouchableOpacity>

            {/* Credit/Debit Card */}
            <TouchableOpacity
              style={[styles.methodRow, selectedMethod === 'CARD' && styles.methodRowSelected]}
              onPress={() => setSelectedMethod('CARD')}
              activeOpacity={0.8}
            >
              <View style={[styles.methodIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <CreditCard size={22} color="#1E40AF" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                <Text style={styles.methodSub}>Visa, Mastercard, RuPay, Amex</Text>
              </View>
              {selectedMethod === 'CARD' && <CheckCircle2 size={20} color="#059669" />}
            </TouchableOpacity>

            {/* NetBanking */}
            <TouchableOpacity
              style={[styles.methodRow, selectedMethod === 'NETBANKING' && styles.methodRowSelected]}
              onPress={() => setSelectedMethod('NETBANKING')}
              activeOpacity={0.8}
            >
              <View style={[styles.methodIconWrap, { backgroundColor: '#FAF5FF' }]}>
                <Landmark size={22} color="#6B21A8" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>NetBanking</Text>
                <Text style={styles.methodSub}>All major Indian banks supported</Text>
              </View>
              {selectedMethod === 'NETBANKING' && <CheckCircle2 size={20} color="#059669" />}
            </TouchableOpacity>
          </View>

          {/* Security Guarantee Footer */}
          <View style={styles.securityRow}>
            <Lock size={14} color="#059669" />
            <Text style={styles.securityText}>256-Bit SSL Encrypted & Secured by Razorpay</Text>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={[styles.payBtn, processing && styles.payBtnDisabled]}
            onPress={handlePayNow}
            disabled={processing}
            activeOpacity={0.85}
          >
            {processing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.payBtnText}>Pay ₹{orderData.amount.toLocaleString()} via Razorpay</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  razorpayBadge: {
    backgroundColor: '#0C2340',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  razorpayText: {
    color: '#00BAF2',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  amountCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  amountLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  amountText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  orderRefText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  methodsList: {
    gap: 10,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  methodRowSelected: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  methodIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  methodSub: {
    fontSize: 12,
    color: '#64748B',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  payBtn: {
    backgroundColor: '#0C2340',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default RazorpayPaymentModal;
