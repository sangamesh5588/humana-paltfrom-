import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  linkedBadgeId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  explanation?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  timeline?: any;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  targetAudience?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  outcomes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  bookingQuestions?: any;

  @ApiPropertyOptional()
  @IsOptional()
  rules?: any;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priceAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  availabilitySchedule?: any;
}

export class UpdateSessionDto extends CreateSessionDto {}
