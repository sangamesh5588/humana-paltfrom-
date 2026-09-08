import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'India' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'IN' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  iso2!: string;

  @ApiProperty({ example: 'IND' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  iso3!: string;

  @ApiPropertyOptional({ example: '+91' })
  @IsOptional()
  @IsString()
  phoneCode?: string;

  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: '₹' })
  @IsOptional()
  @IsString()
  currencySymbol?: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: '🇮🇳' })
  @IsOptional()
  @IsString()
  flagEmoji?: string;

  @ApiPropertyOptional({ example: 'https://flags.example.com/in.png' })
  @IsOptional()
  @IsString()
  flagUrl?: string;

  @ApiPropertyOptional({ example: 'Asia' })
  @IsOptional()
  @IsString()
  continent?: string;
}
