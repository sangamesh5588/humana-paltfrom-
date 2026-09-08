import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}
  @Post() @ApiOperation({ summary: 'Create a skill' }) create(@Body() dto: CreateSkillDto) { return this.service.create(dto); }
  @Get() @ApiOperation({ summary: 'List all skills (paginated)' }) findAll(@Query() query: PaginationQueryDto) { return this.service.findAll(query); }
  @Get('search') @ApiOperation({ summary: 'Search skills' }) search(@Query() query: SearchQueryDto) { return this.service.search(query); }
  @Get(':id') @ApiOperation({ summary: 'Get skill by ID' }) @ApiParam({ name: 'id' }) findById(@Param('id') id: string) { return this.service.findById(id); }
  @Patch(':id') @ApiOperation({ summary: 'Update a skill' }) @ApiParam({ name: 'id' }) update(@Param('id') id: string, @Body() dto: UpdateSkillDto) { return this.service.update(id, dto); }
  @Delete(':id') @ApiOperation({ summary: 'Soft delete a skill' }) @ApiParam({ name: 'id' }) remove(@Param('id') id: string) { return this.service.remove(id); }
  @Patch(':id/restore') @ApiOperation({ summary: 'Restore a skill' }) @ApiParam({ name: 'id' }) restore(@Param('id') id: string) { return this.service.restore(id); }
  @Post('bulk') @ApiOperation({ summary: 'Bulk create skills' }) bulkCreate(@Body() data: CreateSkillDto[]) { return this.service.bulkCreate(data); }
}
