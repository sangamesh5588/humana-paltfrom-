import { Controller, Get, Put, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EducationDto } from './dto/education.dto';
import { ExperienceDto } from './dto/experience.dto';
import { SaveAvailabilityDto } from './dto/availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SmsService } from '../sms/sms.service';
import { SandboxAadhaarService } from '../kyc/sandbox-aadhaar.service';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly smsService: SmsService,
    private readonly sandboxAadhaarService: SandboxAadhaarService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully retrieved' })
  async getProfile(@CurrentUser() user: { id: string }) {
    return this.profileService.getProfileByUserId(user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update profile details' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated' })
  async updateProfile(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(user.id, dto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile avatar image' })
  @ApiResponse({ status: 200, description: 'Avatar successfully uploaded' })
  async uploadAvatar(
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(user.id, file);
  }

  // --- Education endpoints ---
  @Post('education')
  @ApiOperation({ summary: 'Add education credential' })
  @ApiResponse({ status: 201, description: 'Education successfully added' })
  async addEducation(@CurrentUser() user: { id: string }, @Body() dto: EducationDto) {
    return this.profileService.addEducation(user.id, dto);
  }

  @Put('education/:id')
  @ApiOperation({ summary: 'Update education credential' })
  @ApiResponse({ status: 200, description: 'Education successfully updated' })
  async updateEducation(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: EducationDto,
  ) {
    return this.profileService.updateEducation(user.id, id, dto);
  }

  @Delete('education/:id')
  @ApiOperation({ summary: 'Delete education credential' })
  @ApiResponse({ status: 200, description: 'Education successfully deleted' })
  async deleteEducation(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    await this.profileService.deleteEducation(user.id, id);
    return { success: true };
  }

  // --- Experience endpoints ---
  @Post('experience')
  @ApiOperation({ summary: 'Add experience record' })
  @ApiResponse({ status: 201, description: 'Experience successfully added' })
  async addExperience(@CurrentUser() user: { id: string }, @Body() dto: ExperienceDto) {
    return this.profileService.addExperience(user.id, dto);
  }

  @Put('experience/:id')
  @ApiOperation({ summary: 'Update experience record' })
  @ApiResponse({ status: 200, description: 'Experience successfully updated' })
  async updateExperience(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: ExperienceDto,
  ) {
    return this.profileService.updateExperience(user.id, id, dto);
  }

  @Delete('experience/:id')
  @ApiOperation({ summary: 'Delete experience record' })
  @ApiResponse({ status: 200, description: 'Experience successfully deleted' })
  async deleteExperience(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    await this.profileService.deleteExperience(user.id, id);
    return { success: true };
  }

  // --- Availability & Consultation Hours Endpoints ---
  @Get('availability')
  @ApiOperation({ summary: 'Get expert consultation availability schedule & settings' })
  @ApiResponse({ status: 200, description: 'Availability schedule retrieved successfully' })
  async getAvailability(@CurrentUser() user: { id: string }) {
    return this.profileService.getAvailability(user.id);
  }

  @Put('availability')
  @ApiOperation({ summary: 'Save expert consultation availability schedule & settings' })
  @ApiResponse({ status: 200, description: 'Availability schedule saved successfully' })
  async saveAvailability(@CurrentUser() user: { id: string }, @Body() dto: SaveAvailabilityDto) {
    return this.profileService.saveAvailability(user.id, dto);
  }

  @Post('verify-identity')
  @ApiOperation({ summary: 'Verify Government Aadhaar Identity, Phone & Date of Birth' })
  @ApiResponse({ status: 200, description: 'Government Identity successfully verified' })
  async verifyGovernmentIdentity(@CurrentUser() user: { id: string }, @Body() dto: any) {
    return this.profileService.verifyGovernmentIdentity(user.id, dto);
  }

  @Post('send-sms-otp')
  @ApiOperation({ summary: 'Send real SMS OTP to mobile number via Firebase / Twilio API' })
  @ApiResponse({ status: 200, description: 'SMS OTP request processed' })
  async sendSmsOtp(@Body() body: { phone: string; otp?: string }) {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = body.otp && body.otp !== '123456' ? body.otp : randomOtp;
    return this.smsService.sendOtp(body.phone, otp);
  }

  @Post('request-aadhaar-otp')
  @ApiOperation({ summary: 'Request live Government Aadhaar OTP via Sandbox / UIDAI Gateway' })
  @ApiResponse({ status: 200, description: 'Aadhaar Govt OTP request processed' })
  async requestAadhaarOtp(@Body() body: { aadhaarNumber: string }) {
    return this.sandboxAadhaarService.requestAadhaarOtp(body.aadhaarNumber);
  }
}
