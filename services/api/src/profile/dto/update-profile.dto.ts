import { IsString, IsOptional, IsArray, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Developer', required: false })
  @IsString()
  @IsOptional()
  headline?: string;

  @ApiProperty({ example: 'San Francisco, CA', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'AI Enthusiast & Software Engineer', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: ['English', 'Spanish'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  // Origin details
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  originCountryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  originState?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  originDistrict?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  originCity?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  originVillage?: string;

  // Current status & location details
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currentCountryId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currentState?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currentCity?: string;

  @ApiProperty({ example: 'WORKING', required: false })
  @IsString()
  @IsOptional()
  currentStatus?: string;

  // Interests/Skills/Ambitions
  @ApiProperty({ example: ['Tech', 'Music'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiProperty({ example: ['React', 'NestJS'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ example: ['Problem Solving'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  passions?: string[];

  @ApiProperty({ example: 'Principal Architect', required: false })
  @IsString()
  @IsOptional()
  aspirations?: string;

  @ApiProperty({ example: 'Need guidance on career growth', required: false })
  @IsString()
  @IsOptional()
  challenges?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  onboardingStep?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  onboardingDone?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bannerColor?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bannerTextColor?: string;

  @ApiProperty({ example: 'Student', required: false })
  @IsString()
  @IsOptional()
  badgeText?: string;

  @ApiProperty({ example: '#4F46E5', required: false })
  @IsString()
  @IsOptional()
  badgeBgColor?: string;

  @ApiProperty({ example: '#FFFFFF', required: false })
  @IsString()
  @IsOptional()
  badgeTextColor?: string;

  @ApiProperty({ example: '🎓', required: false })
  @IsString()
  @IsOptional()
  badgeIcon?: string;
}
