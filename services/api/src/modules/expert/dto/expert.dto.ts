import { IsString, IsOptional, IsArray, IsInt, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartVerificationSessionDto {
  @ApiProperty({ example: 'career' })
  @IsString()
  verificationTypeSlug!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experienceId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  educationId?: string;
}

export class SaveJourneyStepDto {
  @ApiProperty({ example: 'session-uuid-123' })
  @IsString()
  sessionId!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  stepOrder!: number;

  @ApiProperty({ example: { company: 'Google', title: 'Senior Software Engineer' }, required: false })
  @IsObject()
  @IsOptional()
  answers?: Record<string, any>;

  @ApiProperty({ example: [{ docType: 'offer_letter', url: 'https://...' }], required: false })
  @IsArray()
  @IsOptional()
  documents?: any[];
}

export class SendOtpDto {
  @ApiProperty({ example: 'john@google.com' })
  @IsString()
  email!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'john@google.com' })
  @IsString()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experienceId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  educationId?: string;
}

export class SubmitVerificationSessionDto {
  @ApiProperty({ example: 'session-uuid-123' })
  @IsString()
  sessionId!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  declarationAccepted!: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  experienceId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  educationId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  documentUrl?: string;
}
