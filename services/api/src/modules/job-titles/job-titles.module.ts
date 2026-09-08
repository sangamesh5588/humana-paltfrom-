import { Module } from '@nestjs/common';
import { JobTitlesController } from './job-titles.controller';
import { JobTitlesService } from './job-titles.service';
import { JobTitlesRepository } from './job-titles.repository';

@Module({
  controllers: [JobTitlesController],
  providers: [JobTitlesService, JobTitlesRepository],
  exports: [JobTitlesService],
})
export class JobTitlesModule {}
