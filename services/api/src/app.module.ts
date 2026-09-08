import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration, { validate } from './config/configuration';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CountriesModule } from './modules/countries/countries.module';
import { IndustriesModule } from './modules/industries/industries.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobTitlesModule } from './modules/job-titles/job-titles.module';
import { SkillsModule } from './modules/skills/skills.module';
import { DegreesModule } from './modules/degrees/degrees.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { LocationModule } from './modules/location/location.module';
import { ExpertModule } from './modules/expert/expert.module';
import { SessionModule } from './modules/session/session.module';
import { BookingModule } from './modules/booking/booking.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    DashboardModule,
    CountriesModule,
    IndustriesModule,
    CompaniesModule,
    JobTitlesModule,
    SkillsModule,
    DegreesModule,
    UniversitiesModule,
    LocationModule,
    ExpertModule,
    SessionModule,
    BookingModule,
    UploadModule,
    AiModule,
  ],
})
export class AppModule {}
