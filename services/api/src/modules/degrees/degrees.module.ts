import { Module } from '@nestjs/common';
import { DegreesController } from './degrees.controller';
import { DegreesService } from './degrees.service';
import { DegreesRepository } from './degrees.repository';

@Module({
  controllers: [DegreesController],
  providers: [DegreesService, DegreesRepository],
  exports: [DegreesService],
})
export class DegreesModule {}
