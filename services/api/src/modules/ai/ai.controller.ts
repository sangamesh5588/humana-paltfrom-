import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiGuideService } from './ai-guide.service';
import { ExpertMatchService } from './expert-match.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('AI Guide')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiGuideService: AiGuideService,
    private readonly expertMatchService: ExpertMatchService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Helper to fallback to first user for easy developer local verification if token is not sent.
   */
  private async getUserId(user?: { id: string }): Promise<string> {
    if (user?.id) return user.id;
    try {
      const firstUser = await this.prisma.user.findFirst();
      if (firstUser) return firstUser.id;
    } catch {}
    throw new BadRequestException('User context missing. Please log in.');
  }

  @UseGuards(JwtAuthGuard)
  @Post('sessions')
  @ApiOperation({ summary: 'Start a new goal-oriented AI consulting session or resume an active one' })
  async startSession(
    @Body() dto: CreateSessionDto,
    @CurrentUser() user?: { id: string },
  ) {
    const userId = await this.getUserId(user);
    return this.aiGuideService.getOrCreateSession(userId, dto.initialGoal);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sessions/:id/messages')
  @ApiOperation({ summary: 'Send a message to the AI Guide during a session' })
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user?: { id: string },
  ) {
    const userId = await this.getUserId(user);
    return this.aiGuideService.processMessage(userId, id, dto.message);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @ApiOperation({ summary: 'Fetch past AI sessions for the user' })
  async getSessions(@CurrentUser() user?: { id: string }) {
    const userId = await this.getUserId(user);
    return this.aiGuideService.getSessions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get details of a specific AI session' })
  async getSession(
    @Param('id') id: string,
    @CurrentUser() user?: { id: string },
  ) {
    const userId = await this.getUserId(user);
    const session = await this.prisma.aiSession.findFirst({
      where: { id, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    return session;
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions/:id/recommendations')
  @ApiOperation({ summary: 'Fetch final multi-dimensional matched experts once goal context is complete' })
  async getRecommendations(
    @Param('id') id: string,
    @CurrentUser() user?: { id: string },
  ) {
    const userId = await this.getUserId(user);
    
    // Retrieve the session to fetch the compiled structured criteria
    const session = await this.prisma.aiSession.findFirst({
      where: { id, userId },
    });

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    const filters = (session.structuredData as any) || {};
    return this.expertMatchService.findMatches(userId, filters);
  }
}
