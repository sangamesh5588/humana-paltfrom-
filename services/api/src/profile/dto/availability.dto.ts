import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class DayScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @IsBoolean()
  isAvailable!: boolean;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @IsOptional()
  @IsBoolean()
  hasSplitShift?: boolean;

  @IsOptional()
  @IsString()
  splitStartTime?: string;

  @IsOptional()
  @IsString()
  splitEndTime?: string;
}

export class SaveAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayScheduleDto)
  schedules!: DayScheduleDto[];

  @IsOptional()
  @IsInt()
  bufferMinutes?: number;

  @IsOptional()
  @IsInt()
  noticeHours?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}
