import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DegreeLevelEnum {
  NONE = 'NONE',
  LKG = 'LKG',
  PRIMARY = 'PRIMARY',
  MIDDLE = 'MIDDLE',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  SENIOR_SECONDARY = 'SENIOR_SECONDARY',
  DIPLOMA = 'DIPLOMA',
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS',
  DOCTORATE = 'DOCTORATE',
  POST_DOCTORATE = 'POST_DOCTORATE',
  CERTIFICATE = 'CERTIFICATE',
  SELF_TAUGHT = 'SELF_TAUGHT',
}

export class EducationDto {
  @ApiProperty({ example: 'Stanford University' })
  @IsString()
  @IsNotEmpty()
  school!: string;

  @ApiProperty({ example: 'Bachelor of Science' })
  @IsString()
  @IsNotEmpty()
  degree!: string;

  @ApiProperty({ enum: DegreeLevelEnum, default: DegreeLevelEnum.NONE })
  @IsEnum(DegreeLevelEnum)
  @IsOptional()
  degreeLevel?: DegreeLevelEnum;

  @ApiProperty({ example: 'Computer Science' })
  @IsString()
  @IsNotEmpty()
  fieldOfStudy!: string;

  @ApiProperty({ example: '2022-09-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ example: '2026-06-15T00:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  current?: boolean;

  @ApiProperty({ example: 'student@stanford.edu', required: false })
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
