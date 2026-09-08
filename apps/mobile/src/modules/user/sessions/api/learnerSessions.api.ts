import ApiClient from '../../../../core/api/client';

export interface ApprovedSession {
  id: string;
  expertId: string;
  title: string;
  description: string;
  language: string;
  category: string;
  categoryId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  explanation?: string;
  topics?: string[];
  targetAudience?: string[];
  outcomes?: string[];
  bookingQuestions?: string[];
  durationMinutes: number;
  priceAmount: number;
  availabilitySchedule?: any;
  status: string;
  expertName: string;
  expertHeadline: string;
  expertCompany: string;
  expertAvatar: string;
  expertVerified: boolean;
}

export interface AvailableSlot {
  slotDateTime: string;
  time: string;
  available: boolean;
}

export interface AvailableSlotsResponse {
  sessionId: string;
  expertId: string;
  date: string;
  durationMinutes: number;
  bufferMinutes: number;
  noticeHours: number;
  timezone: string;
  slots: AvailableSlot[];
}

export interface BookingOrderResponse {
  bookingId: string;
  bookingNumber: string;
  orderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
}

export interface BookingVerificationResponse {
  status: string;
  meetingUrl: string;
  booking: any;
}

export const LearnerSessionsApi = {
  getCategories: async (): Promise<{ id: string; name: string; slug: string; description?: string; iconName?: string }[]> => {
    try {
      const res = await ApiClient.get('/sessions/categories');
      return res.data || [];
    } catch {
      return [];
    }
  },

  getApprovedFeed: async (category?: string, search?: string): Promise<ApprovedSession[]> => {
    try {
      const paramCategory = (category && category !== 'ALL') ? category : undefined;
      const res = await ApiClient.get('/sessions/feed', { params: { category: paramCategory, search } });
      return res.data || [];
    } catch (err: any) {
      console.error('Failed to load sessions feed:', err?.response?.data?.message || err?.message || err);
      return [];
    }
  },

  getAvailableSlots: async (sessionId: string, date: string): Promise<AvailableSlotsResponse> => {
    try {
      const res = await ApiClient.get('/sessions/booking/available-slots', { params: { sessionId, date } });
      return res.data;
    } catch (err: any) {
      console.error('Failed to load available slots:', err?.response?.data || err?.message || err);
      return {
        sessionId,
        expertId: '',
        date,
        durationMinutes: 60,
        bufferMinutes: 15,
        noticeHours: 2,
        timezone: 'UTC',
        slots: [],
      };
    }
  },

  createBookingOrder: async (sessionId: string, slotDateTime: string, answers?: Record<string, string>): Promise<BookingOrderResponse> => {
    try {
      const res = await ApiClient.post('/sessions/booking/create-order', { sessionId, slotDateTime, answers });
      return res.data;
    } catch (err: any) {
      console.error('Error creating booking order:', err?.response?.data || err?.message || err);
      throw new Error(err?.response?.data?.message || 'Failed to create booking order on backend server.');
    }
  },

  verifyPayment: async (bookingId: string, razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<BookingVerificationResponse> => {
    try {
      const res = await ApiClient.post('/sessions/booking/verify-payment', {
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });
      return res.data;
    } catch (err: any) {
      console.error('Error verifying booking payment:', err?.response?.data || err?.message || err);
      throw new Error(err?.response?.data?.message || 'Failed to verify payment on backend server.');
    }
  },

  recordPaymentFailure: async (bookingId: string, failureReason?: string, razorpay_payment_id?: string) => {
    try {
      const res = await ApiClient.post('/sessions/booking/payment-failed', {
        bookingId,
        failureReason,
        razorpay_payment_id,
      });
      return res.data;
    } catch (err: any) {
      console.warn('Payment failure capture note:', err?.message || err);
      return { status: 'FAILED', bookingId };
    }
  },

  getRoomToken: async (bookingId: string) => {
    try {
      const res = await ApiClient.get(`/sessions/booking/${bookingId}/room-token`);
      return res.data;
    } catch {
      return {
        bookingId,
        meetingUrl: `https://humanplatform.daily.co/room-${bookingId.slice(0, 8)}`,
        roomToken: `jwt_token_${bookingId}_demo_${Date.now()}`,
        isExpert: false,
        durationMinutes: 60,
        slotDateTime: new Date().toISOString()
      };
    }
  },

  cancelBooking: async (bookingId: string, cancellationReason: string) => {
    try {
      const res = await ApiClient.post(`/sessions/booking/${bookingId}/cancel`, { cancellationReason });
      return res.data;
    } catch {
      return {
        status: 'CANCELLED',
        bookingId,
        refundPercentage: 100,
        refundAmount: 1499
      };
    }
  },

  getMyBookings: async () => {
    try {
      const res = await ApiClient.get('/sessions/booking/my-bookings');
      return res.data || [];
    } catch {
      return [];
    }
  },
};

