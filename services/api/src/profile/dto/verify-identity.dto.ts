import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyIdentityDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  dob!: string;

  @IsString()
  @IsNotEmpty()
  aadhaarNumber!: string;

  @IsOptional()
  @IsString()
  otpCode?: string;
}
