import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExperienceDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Mountain View, CA' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '2026-01-15T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ example: '2026-07-15T00:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  current?: boolean;

  @ApiProperty({ example: 'Working on next-generation agentic models.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'user@google.com', required: false })
  @IsString()
  @IsOptional()
  officialEmail?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @ApiProperty({ example: 'VERIFIED', required: false })
  @IsString()
  @IsOptional()
  verificationStatus?: string;

  @ApiProperty({ example: 'https://...', required: false })
  @IsString()
  @IsOptional()
  documentUrl?: string;
}
