import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExpertController } from './expert.controller';
import { AdminVerificationController } from './admin-verification.controller';
import { ExpertService } from './expert.service';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  controllers: [ExpertController, AdminVerificationController],
  providers: [ExpertService],
  exports: [ExpertService],
})
export class ExpertModule {}
