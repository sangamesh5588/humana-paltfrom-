import { Controller, Get, Post, Body, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get active master session categories' })
  async getSessionCategories() {
    return this.sessionService.getSessionCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new session draft' })
  async createSession(
    @Body() dto: CreateSessionDto,
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    let targetUserId = user?.id || userId;
    if (!targetUserId) {
      const dbUser = await this.sessionService.resolveDefaultUserId();
      targetUserId = dbUser;
    }
    return this.sessionService.createSession(targetUserId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing session draft' })
  async updateSession(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.sessionService.updateSession(id, dto);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get approved expert sessions feed for learners' })
  async getApprovedFeed(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.sessionService.getApprovedFeed(category, search);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/book')
  @ApiOperation({ summary: 'Book a session slot as a learner' })
  async bookSessionSlot(
    @Param('id') id: string,
    @Body() dto: { slotDateTime: string; answers?: any },
    @CurrentUser() user?: { id: string },
  ) {
    const userId = user?.id || 'learner-user';
    return this.sessionService.bookSessionSlot(userId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('expert')
  @ApiOperation({ summary: 'Get all sessions created by the expert' })
  async getExpertSessions(
    @CurrentUser() user?: { id: string },
    @Query('userId') userId?: string,
  ) {
    let targetUserId = user?.id || userId;
    if (!targetUserId) {
      const dbUser = await this.sessionService.resolveDefaultUserId();
      targetUserId = dbUser;
    }
    return this.sessionService.getExpertSessions(targetUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed session information' })
  async getSessionDetails(@Param('id') id: string) {
    return this.sessionService.getSessionDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/analyze')
  @ApiOperation({ summary: 'Run the AI Session Analyzer to extract rich metadata' })
  async analyzeSession(@Param('id') id: string) {
    return this.sessionService.analyzeSession(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit session for admin review' })
  async submitSession(@Param('id') id: string) {
    return this.sessionService.submitSession(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Admin: Approve the session' })
  async approveSession(@Param('id') id: string) {
    return this.sessionService.approveSession(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Admin: Reject the session with reason' })
  async rejectSession(
    @Param('id') id: string,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.sessionService.rejectSession(id, rejectionReason);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/resubmit')
  @ApiOperation({ summary: 'Resubmit a rejected session for admin review after editing' })
  async resubmitSession(@Param('id') id: string) {
    return this.sessionService.resubmitSession(id);
  }

  @Post('ai-copilot')
  @ApiOperation({ summary: 'Interactive Floating AI Co-Pilot step guidance and suggestions' })
  async generateStepCopilot(
    @Body() dto: { currentStep: number; currentAnswers?: any; userPrompt?: string },
  ) {
    return this.sessionService.generateStepCopilot(dto);
  }
}
