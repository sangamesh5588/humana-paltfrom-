import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from '../database/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { SmsService } from '../sms/sms.service';
import { SandboxAadhaarService } from '../kyc/sandbox-aadhaar.service';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  controllers: [ProfileController],
  providers: [ProfileService, SmsService, SandboxAadhaarService],
  exports: [ProfileService, SmsService, SandboxAadhaarService],
})
export class ProfileModule {}
