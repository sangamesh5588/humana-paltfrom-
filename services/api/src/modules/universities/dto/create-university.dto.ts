import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUniversityDto {
  @ApiProperty({ example: 'Stanford University' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'stanford-university' })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiPropertyOptional({ example: 'https://stanford.edu' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'https://logo.clearbit.com/stanford.edu' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  ranking?: number;
}
