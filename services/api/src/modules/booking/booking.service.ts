import { 
  Injectable, 
  Logger, 
  NotFoundException, 
  BadRequestException, 
  UnauthorizedException 
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RazorpayService } from './razorpay.service';
import { BookingStatus, PaymentStatus, CancelledRole, RefundStatus, SessionStatus } from '@prisma/client';

export interface CreateBookingDto {
  sessionId: string;
  slotDateTime: string;
  answers?: Record<string, string>;
}

export interface PaymentFailureDto {
  bookingId: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  failureReason?: string;
}

export interface VerifyPaymentDto {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface CancelBookingDto {
  cancellationReason: string;
}

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayService: RazorpayService,
  ) {}
  private parseDateOnly(date: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
      throw new BadRequestException('Date must be provided in YYYY-MM-DD format');
    }
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid booking date');
    }
    return parsed;
  }

  private parseSlotDateTime(slotDateTime: string): Date {
    const raw = String(slotDateTime || '').replace('@', '').trim();
    const match = raw.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    if (match) {
      const [, datePart, hourPart, minutePart, meridiem] = match;
      let hour = Number(hourPart);
      const minute = Number(minutePart);
      if (meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0;
      const parsed = new Date(`${datePart}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestException('Invalid slot date/time');
    }
    return parsed;
  }

  private formatSlotLabel(date: Date): string {
    const hour = date.getUTCHours();
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minute} ${period}`;
  }

  private parseTimeToMinutes(time: string): number {
    const [hourRaw, minuteRaw] = String(time || '00:00').split(':');
    const hour = Number(hourRaw);
    const minute = Number(minuteRaw);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;
    return hour * 60 + minute;
  }

  private combineDateAndMinutes(date: string, minutes: number): Date {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return new Date(`${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`);
  }

  private isSameMinute(a: Date, b: Date): boolean {
    return Math.floor(a.getTime() / 60000) === Math.floor(b.getTime() / 60000);
  }

  async getAvailableSlots(sessionId: string, date: string) {
    const selectedDate = this.parseDateOnly(date);
    let session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { expertProfile: true },
    });

    let expertId = session?.expertId;
    let expertProfile: any = session?.expertProfile;

    if (!session) {
      // Check if sessionId is a fallback topic template like `topic-1-expertId`
      if (sessionId.includes('-')) {
        const parts = sessionId.split('-');
        const possibleExpertId = parts[parts.length - 1];
        if (possibleExpertId) {
          expertProfile = await this.prisma.profile.findFirst({
            where: { OR: [{ userId: possibleExpertId }, { id: possibleExpertId }] },
          });
          if (expertProfile) {
            expertId = expertProfile.userId;
          }
        }
      }

      if (!expertProfile) {
        expertProfile = await this.prisma.profile.findFirst();
        expertId = expertProfile?.userId || 'default-expert-id';
      }
    }

    const dayOfWeek = selectedDate.getUTCDay();

    const [schedule, setting] = await Promise.all([
      expertProfile ? this.prisma.availabilitySchedule.findUnique({
        where: { profileId_dayOfWeek: { profileId: expertProfile.id, dayOfWeek } },
      }) : null,
      expertProfile ? this.prisma.availabilitySetting.findUnique({
        where: { profileId: expertProfile.id },
      }) : null,
    ]);

    const effectiveSchedule = schedule || {
      dayOfWeek,
      isAvailable: dayOfWeek >= 1 && dayOfWeek <= 5,
      startTime: '09:00',
      endTime: '17:00',
      hasSplitShift: false,
      splitStartTime: '14:00',
      splitEndTime: '18:00',
    };

    const bufferMinutes = setting?.bufferMinutes ?? 15;
    const noticeHours = setting?.noticeHours ?? 2;
    const durationMinutes = session?.durationMinutes || 60;
    const minimumStart = new Date(Date.now() + noticeHours * 60 * 60 * 1000);

    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);
    const queryStart = new Date(dayStart.getTime() - 24 * 60 * 60 * 1000);
    const queryEnd = new Date(dayEnd.getTime() + 24 * 60 * 60 * 1000);
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    const targetExpertUserIds = Array.from(new Set([
      expertId,
      expertProfile?.userId,
      expertProfile?.id,
    ].filter((id): id is string => Boolean(id))));

    const existingBookings = targetExpertUserIds.length > 0 ? await this.prisma.booking.findMany({
      where: {
        expertId: { in: targetExpertUserIds },
        slotDateTime: { gte: queryStart, lte: queryEnd },
        OR: [
          { status: { in: [BookingStatus.CONFIRMED, BookingStatus.RESCHEDULED] } },
          { status: BookingStatus.PENDING_PAYMENT, createdAt: { gte: fifteenMinsAgo } },
        ],
      },
      select: { id: true, slotDateTime: true, durationMinutes: true },
    }) : [];

    const shifts = effectiveSchedule.isAvailable
      ? [
          [effectiveSchedule.startTime, effectiveSchedule.endTime],
          ...(effectiveSchedule.hasSplitShift ? [[effectiveSchedule.splitStartTime || '14:00', effectiveSchedule.splitEndTime || '18:00']] : []),
        ]
      : [];

    const slots: Array<{ slotDateTime: string; time: string; available: boolean }> = [];
    const stepMinutes = 30;

    for (const [shiftStart, shiftEnd] of shifts) {
      const startMinutes = this.parseTimeToMinutes(shiftStart);
      const endMinutes = this.parseTimeToMinutes(shiftEnd);

      for (let cursor = startMinutes; cursor + durationMinutes <= endMinutes; cursor += stepMinutes) {
        const slotStart = this.combineDateAndMinutes(date, cursor);
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

        if (slotStart < minimumStart) continue;

        const isBooked = existingBookings.some((booking) => {
          const bookingStart = new Date(booking.slotDateTime);
          const bookingEnd = new Date(bookingStart.getTime() + (booking.durationMinutes || durationMinutes) * 60 * 1000);
          
          const bookingStartWithBuffer = new Date(bookingStart.getTime() - bufferMinutes * 60 * 1000);
          const bookingEndWithBuffer = new Date(bookingEnd.getTime() + bufferMinutes * 60 * 1000);

          return slotStart < bookingEndWithBuffer && slotEnd > bookingStartWithBuffer;
        });

        if (!isBooked) {
          slots.push({
            slotDateTime: slotStart.toISOString(),
            time: this.formatSlotLabel(slotStart),
            available: true,
          });
        }
      }
    }

    return {
      sessionId,
      expertId: expertId || '',
      date,
      durationMinutes,
      bufferMinutes,
      noticeHours,
      timezone: setting?.timezone ?? 'UTC',
      slots,
    };
  }

  private async assertSlotAvailable(sessionId: string, slotDate: Date) {
    const dateKey = slotDate.toISOString().split('T')[0];
    const availability = await this.getAvailableSlots(sessionId, dateKey);
    const match = availability.slots.find((slot) => this.isSameMinute(new Date(slot.slotDateTime), slotDate));
    if (!match) {
      throw new BadRequestException('Selected slot is no longer available for this expert');
    }
  }

  /**
   * Create Booking Order & Razorpay Order
   */
  async createOrder(learnerUserId: string, dto: CreateBookingDto) {
    this.logger.log(`Creating booking order for session: ${dto.sessionId} by user: ${learnerUserId}`);

    try {
      let session = await this.prisma.session.findUnique({
        where: { id: dto.sessionId },
        include: { expertProfile: true },
      });

      if (!session) {
        // Auto-provision template session if booking fallback template
        let expertProfile = await this.prisma.profile.findFirst({
          where: { expertStatus: 'VERIFIED' },
        }) || await this.prisma.profile.findFirst();

        if (dto.sessionId.includes('-')) {
          const possibleExpertId = dto.sessionId.split('-').pop();
          if (possibleExpertId) {
            const foundExp = await this.prisma.profile.findFirst({
              where: { OR: [{ userId: possibleExpertId }, { id: possibleExpertId }] },
            });
            if (foundExp) expertProfile = foundExp;
          }
        }

        if (!expertProfile) {
          throw new NotFoundException('Session offering or valid expert not found');
        }

        session = await this.prisma.session.create({
          data: {
            id: dto.sessionId,
            expertId: expertProfile.userId,
            title: '1-on-1 Strategy & Career Growth Advisory',
            description: 'Personalized 1-on-1 strategy call covering career advancement, interview preparation, and leadership guidance.',
            category: 'Career Strategy',
            durationMinutes: 60,
            priceAmount: 1499,
            status: SessionStatus.APPROVED,
          },
          include: { expertProfile: true },
        });
      }

      const learnerProfile = await this.prisma.profile.findUnique({
        where: { userId: learnerUserId },
      });

      if (!learnerProfile) {
        throw new BadRequestException('Learner profile not found. Please complete profile setup before booking.');
      }

      const expertProfile = session.expertProfile;
      if (!expertProfile) {
        throw new BadRequestException('Expert profile not found for this session.');
      }

      if (expertProfile.userId === learnerProfile.userId) {
        throw new BadRequestException('You cannot book your own session.');
      }

      const slotDate = this.parseSlotDateTime(dto.slotDateTime);
      await this.assertSlotAvailable(session.id, slotDate);

      const bookingNumber = `BKG-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // Create Booking Record in PENDING_PAYMENT status
      const booking = await this.prisma.booking.create({
        data: {
          bookingNumber,
          sessionId: session.id,
          learnerId: learnerProfile.userId,
          expertId: expertProfile.userId,
          slotDateTime: slotDate,
          durationMinutes: session.durationMinutes,
          priceAmount: session.priceAmount,
          status: BookingStatus.PENDING_PAYMENT,
        },
      });

      // Save prep answers if provided
      if (dto.answers && Object.keys(dto.answers).length > 0) {
        try {
          const prepData = Object.entries(dto.answers).map(([qKey, aText]) => ({
            bookingId: booking.id,
            questionText: String(qKey || 'Question'),
            answerText: typeof aText === 'string' ? aText : JSON.stringify(aText || ''),
          }));
          await this.prisma.bookingPrepAnswer.createMany({ data: prepData });
        } catch (prepErr: any) {
          this.logger.warn('Failed to save prep answers into DB:', prepErr?.message || prepErr);
        }
      }

      // Call Razorpay Order Creation
      const razorpayOrder = await this.razorpayService.createOrder(session.priceAmount, bookingNumber);

      // Create Payment Record
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          razorpayOrderId: razorpayOrder.orderId,
          amount: session.priceAmount,
          currency: 'INR',
          status: PaymentStatus.CREATED,
        },
      });

      return {
        bookingId: booking.id,
        bookingNumber,
        orderId: razorpayOrder.orderId,
        razorpayKeyId: this.razorpayService.getKeyId(),
        amount: session.priceAmount,
        currency: 'INR',
      };
    } catch (err: any) {
      this.logger.error(`Error in createOrder for session ${dto.sessionId}:`, err?.stack || err?.message || err);
      throw err;
    }
  }

  /**
   * Verify Payment Signature and Confirm Booking
   */
  async verifyPayment(learnerUserId: string, dto: VerifyPaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        session: true,
        learner: true,
        expert: true,
        payments: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.learnerId !== learnerUserId) {
      throw new UnauthorizedException('You are not authorized to verify this booking');
    }

    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException('Booking is not awaiting payment');
    }

    const matchingPayment = booking.payments.find((payment) => payment.razorpayOrderId === dto.razorpay_order_id);
    if (!matchingPayment) {
      throw new BadRequestException('Payment order does not belong to this booking');
    }

    const isValid = this.razorpayService.verifySignature(
      dto.razorpay_order_id,
      dto.razorpay_payment_id,
      dto.razorpay_signature
    );

    if (!isValid) {
      // Update payment record as failed
      await this.prisma.payment.updateMany({
        where: { bookingId: booking.id, razorpayOrderId: dto.razorpay_order_id },
        data: { status: PaymentStatus.FAILED, failureReason: 'Invalid signature' },
      });
      throw new BadRequestException('Payment signature verification failed');
    }

    // Generate secure 1:1 video meeting URL
    const meetingUrl = `https://humanplatform.daily.co/room-${booking.id.slice(0, 8)}`;

    // Update payment as SUCCESS
    await this.prisma.payment.updateMany({
      where: { bookingId: booking.id, razorpayOrderId: dto.razorpay_order_id },
      data: {
        razorpayPaymentId: dto.razorpay_payment_id,
        razorpaySignature: dto.razorpay_signature,
        status: PaymentStatus.SUCCESS,
      },
    });

    // Update booking as CONFIRMED
    const updatedBooking = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CONFIRMED,
        meetingUrl,
      },
      include: {
        session: true,
        learner: true,
        expert: true,
        prepAnswers: true,
      },
    });

    // Create Notification Log
    await this.prisma.bookingNotification.create({
      data: {
        bookingId: booking.id,
        recipientUserId: learnerUserId,
        eventType: 'BOOKING_CONFIRMED',
        status: 'SENT',
      },
    });

    return {
      status: 'CONFIRMED',
      meetingUrl,
      booking: updatedBooking,
    };
  }

  /**
   * Record Payment Failure / User Cancellation on Gateway
   */
  async recordPaymentFailure(_userId: string, dto: PaymentFailureDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking record not found');
    }

    // Update payment status to FAILED and log failure details
    await this.prisma.payment.updateMany({
      where: { bookingId: booking.id },
      data: {
        status: PaymentStatus.FAILED,
        razorpayPaymentId: dto.razorpay_payment_id || null,
        failureReason: dto.failureReason || 'User closed checkout or gateway payment failed',
      },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CANCELLED },
    });

    this.logger.warn(`Payment failure captured in DB for booking: ${booking.id}, reason: ${dto.failureReason}`);

    return {
      status: 'FAILED',
      bookingId: booking.id,
      reason: dto.failureReason || 'Payment failed',
    };
  }

  /**
   * Generate 1:1 Live Video Room Access Token
   */
  async getRoomToken(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { session: true, learner: true, expert: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.learnerId !== userId && booking.expertId !== userId) {
      throw new UnauthorizedException('You are not authorized to join this 1:1 call');
    }

    const isExpert = booking.expertId === userId;
    const roomToken = `jwt_token_${booking.id}_${isExpert ? 'exp' : 'lrn'}_${Date.now()}`;

    return {
      bookingId: booking.id,
      meetingUrl: booking.meetingUrl || `https://humanplatform.daily.co/room-${booking.id.slice(0, 8)}`,
      roomToken,
      isExpert,
      durationMinutes: booking.durationMinutes,
      slotDateTime: booking.slotDateTime,
    };
  }

  /**
   * Cancel Booking & Process Automatic Refund
   */
  async cancelBooking(userId: string, bookingId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.learnerId !== userId && booking.expertId !== userId) {
      throw new UnauthorizedException('Not authorized to cancel this booking');
    }

    const isLearner = booking.learnerId === userId;
    const cancelledRole = isLearner ? CancelledRole.LEARNER : CancelledRole.EXPERT;

    // Calculate Refund Policy based on time window
    const now = new Date();
    const slotTime = new Date(booking.slotDateTime);
    const hoursUntilSlot = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundPercentage = 100;
    if (cancelledRole === CancelledRole.LEARNER) {
      if (hoursUntilSlot < 12) {
        refundPercentage = 0;
      } else if (hoursUntilSlot < 24) {
        refundPercentage = 50;
      }
    }

    const refundAmount = Math.round((booking.priceAmount * refundPercentage) / 100);
    const successfulPayment = booking.payments.find(p => p.status === PaymentStatus.SUCCESS);

    let refundResult = { refundId: `rfnd_mock_${Date.now()}`, status: 'processed' };
    if (successfulPayment && successfulPayment.razorpayPaymentId && refundAmount > 0) {
      refundResult = await this.razorpayService.processRefund(successfulPayment.razorpayPaymentId, refundAmount);
    }

    // Create Cancellation Audit Entry
    await this.prisma.bookingCancellation.create({
      data: {
        bookingId: booking.id,
        cancelledByUserId: userId,
        cancelledRole,
        cancellationReason: dto.cancellationReason || 'User requested cancellation',
        refundPercentage,
        refundAmount,
        refundStatus: refundAmount > 0 ? RefundStatus.PROCESSED : RefundStatus.NOT_APPLICABLE,
        refundRazorpayId: refundResult.refundId,
      },
    });

    // Update Booking status to CANCELLED
    const cancelledBooking = await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CANCELLED },
    });

    return {
      status: 'CANCELLED',
      bookingId: booking.id,
      refundPercentage,
      refundAmount,
      cancellation: cancelledBooking,
    };
  }

  /**
   * List Active & Past Bookings for Learner or Expert
   */
  async getUserBookings(userId: string) {
    const userProfile = await this.prisma.profile.findFirst({
      where: { OR: [{ userId }, { id: userId }] },
    });

    const targetUserIds = Array.from(new Set([
      userId,
      userProfile?.userId,
      userProfile?.id,
    ].filter((id): id is string => Boolean(id))));

    const bookings = await this.prisma.booking.findMany({
      where: {
        OR: [
          { learnerId: { in: targetUserIds } },
          { expertId: { in: targetUserIds } },
        ],
      },
      include: {
        session: true,
        learner: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        expert: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
            headline: true,
          },
        },
        prepAnswers: true,
        cancellation: true,
      },
      orderBy: { slotDateTime: 'desc' },
    });

    return bookings;
  }
}



