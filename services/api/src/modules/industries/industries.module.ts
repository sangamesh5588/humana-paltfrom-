import { Module } from '@nestjs/common';
import { IndustriesController } from './industries.controller';
import { IndustriesService } from './industries.service';
import { IndustriesRepository } from './industries.repository';

@Module({
  controllers: [IndustriesController],
  providers: [IndustriesService, IndustriesRepository],
  exports: [IndustriesService],
})
export class IndustriesModule {}
