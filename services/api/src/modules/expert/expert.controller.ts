import { Controller, Get, Post, Body, Param, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpertService } from './expert.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { 
  StartVerificationSessionDto, 
  SaveJourneyStepDto, 
  SendOtpDto, 
  VerifyOtpDto, 
  SubmitVerificationSessionDto 
} from './dto/expert.dto';

@ApiTags('Expert Verification Engine')
@ApiBearerAuth()
@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @UseGuards(JwtAuthGuard)
  @Get('home')
  @ApiOperation({ summary: 'Get expert homepage overview, status, badges, and catalog' })
  async getExpertHome(
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    const targetUserId = user?.id || userId;
    return this.expertService.getExpertHome(targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get expert profile with experiences & education' })
  async getProfile(
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    const targetUserId = user?.id || userId;
    return this.expertService.getProfile(targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/update')
  @ApiOperation({ summary: 'Update expert role headline and bio' })
  async updateProfile(
    @Body() dto: { headline?: string; bio?: string; expertTags?: string[] },
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    const targetUserId = user?.id || userId;
    return this.expertService.updateExpertRoleAndBio(targetUserId, dto);
  }

  @Get('story')
  @ApiOperation({ summary: 'Get dynamic story carousel slides and benefits' })
  async getStory() {
    return this.expertService.getStorySlides();
  }

  @Get('verification-types')
  @ApiOperation({ summary: 'List all active verification categories' })
  async getVerificationTypes() {
    return this.expertService.getVerificationTypes();
  }

  @Get('journey/:typeSlug')
  @ApiOperation({ summary: 'Get dynamic journey definition, steps, fields, and document rules' })
  async getJourneyConfig(@Param('typeSlug') typeSlug: string) {
    return this.expertService.getJourneyConfig(typeSlug);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start')
  @ApiOperation({ summary: 'Start or resume a verification session draft' })
  async startSession(
    @Body() dto: StartVerificationSessionDto,
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    const targetUserId = user?.id || userId;
    return this.expertService.startSession(targetUserId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('step/save')
  @ApiOperation({ summary: 'Save intermediate journey step answers & documents' })
  async saveStep(
    @Body() dto: SaveJourneyStepDto,
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    const targetUserId = user?.id || userId;
    return this.expertService.saveStep(targetUserId, dto);
  }

  @Post('upload-document')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Upload verification document image, video, or PDF' })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.expertService.uploadDocument(file);
  }


  @Post('otp/send')
  @ApiOperation({ summary: 'Send work/university email OTP code' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.expertService.sendOtp(dto);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify work/university email OTP code' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.expertService.verifyOtp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  @ApiOperation({ summary: 'Submit verification journey for Admin review' })
  async submitSession(
    @Body() dto: SubmitVerificationSessionDto,
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    const targetUserId = user?.id || userId;
    return this.expertService.submitSession(targetUserId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  @ApiOperation({ summary: 'Get current user verification status and review timeline' })
  async getStatus(
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
    @Query('typeSlug') typeSlug?: string,
    @Query('experienceId') experienceId?: string,
    @Query('educationId') educationId?: string,
  ) {
    const targetUserId = user?.id || userId;
    return this.expertService.getStatus(targetUserId, typeSlug, experienceId, educationId);
  }

  @Post('admin/approve')
  @ApiOperation({ summary: 'Admin Approve application and activate Verified Expert Badge' })
  async approveSession(@Body('sessionId') sessionId: string) {
    return this.expertService.adminApproveSession(sessionId);
  }

  @Post('admin/reject')
  @ApiOperation({ summary: 'Admin Reject application with reason' })
  async rejectSession(
    @Body('sessionId') sessionId: string,
    @Body('rejectionReason') rejectionReason: string,
  ) {
    return this.expertService.adminRejectSession(sessionId, rejectionReason);
  }
}

