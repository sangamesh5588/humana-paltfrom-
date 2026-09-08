import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JobTitlesService } from './job-titles.service';
import { CreateJobTitleDto } from './dto/create-job-title.dto';
import { UpdateJobTitleDto } from './dto/update-job-title.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Job Titles')
@Controller('job-titles')
export class JobTitlesController {
  constructor(private readonly service: JobTitlesService) {}

  @Post() @ApiOperation({ summary: 'Create a job title' })
  create(@Body() dto: CreateJobTitleDto) { return this.service.create(dto); }

  @Get() @ApiOperation({ summary: 'List all job titles (paginated)' })
  findAll(@Query() query: PaginationQueryDto) { return this.service.findAll(query); }

  @Get('search') @ApiOperation({ summary: 'Search job titles' })
  search(@Query() query: SearchQueryDto) { return this.service.search(query); }

  @Post('find-or-create')
  @ApiOperation({ summary: 'Find a job title by title or create it if not found' })
  findOrCreate(@Body() body: { name: string }) {
    return this.service.findOrCreate(body.name);
  }

  @Get(':id') @ApiOperation({ summary: 'Get job title by ID' }) @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) { return this.service.findById(id); }

  @Patch(':id') @ApiOperation({ summary: 'Update a job title' }) @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() dto: UpdateJobTitleDto) { return this.service.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: 'Soft delete a job title' }) @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Patch(':id/restore') @ApiOperation({ summary: 'Restore a job title' }) @ApiParam({ name: 'id', type: String })
  restore(@Param('id') id: string) { return this.service.restore(id); }

  @Post('bulk') @ApiOperation({ summary: 'Bulk create job titles' })
  bulkCreate(@Body() data: CreateJobTitleDto[]) { return this.service.bulkCreate(data); }
}
