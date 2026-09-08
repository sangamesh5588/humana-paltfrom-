import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { RazorpayService } from './razorpay.service';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  controllers: [BookingController],
  providers: [BookingService, RazorpayService],
  exports: [BookingService, RazorpayService],
})
export class BookingModule {}
