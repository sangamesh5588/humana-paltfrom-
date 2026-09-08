import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param,
  Query,
  UseGuards, 
  Request 
} from '@nestjs/common';
import { BookingService, CreateBookingDto, VerifyPaymentDto, CancelBookingDto, PaymentFailureDto } from './booking.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('sessions/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('available-slots')
  async getAvailableSlots(
    @Query('sessionId') sessionId: string,
    @Query('date') date: string,
  ) {
    return this.bookingService.getAvailableSlots(sessionId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(@Request() req: any, @Body() dto: CreateBookingDto) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.createOrder(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-payment')
  async verifyPayment(@Request() req: any, @Body() dto: VerifyPaymentDto) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.verifyPayment(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payment-failed')
  async recordPaymentFailure(@Request() req: any, @Body() dto: PaymentFailureDto) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.recordPaymentFailure(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/room-token')
  async getRoomToken(@Request() req: any, @Param('id') bookingId: string) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.getRoomToken(userId, bookingId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelBooking(
    @Request() req: any, 
    @Param('id') bookingId: string, 
    @Body() dto: CancelBookingDto
  ) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.cancelBooking(userId, bookingId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  async getUserBookings(@Request() req: any) {
    const userId = req.user.userId || req.user.id;
    return this.bookingService.getUserBookings(userId);
  }

  @Post('webhook')
  async handleWebhook(@Body() _payload: any) {
    // Reconcile async Razorpay webhook events (payment.captured, payment.failed)
    return { status: 'RECEIVED' };
  }
}

