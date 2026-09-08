import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiGuideService } from './ai-guide.service';
import { ExpertMatchService } from './expert-match.service';
import { PrismaModule } from '../../database/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule],
  controllers: [AiController],
  providers: [AiGuideService, ExpertMatchService],
  exports: [AiGuideService, ExpertMatchService],
})
export class AiModule {}
