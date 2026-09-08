import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ required: false, description: 'Initial goal to kickstart the conversation' })
  @IsString()
  @IsOptional()
  initialGoal?: string;
}
