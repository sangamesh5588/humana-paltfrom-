import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIndustryDto {
  @ApiProperty({ example: 'Information Technology' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'information-technology' })
  @IsNotEmpty()
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ example: '💻' })
  @IsOptional()
  @IsString()
  icon?: string;
}
