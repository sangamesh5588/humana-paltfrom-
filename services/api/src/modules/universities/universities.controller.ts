import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly service: UniversitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a university' })
  create(@Body() dto: CreateUniversityDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all universities (paginated)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search universities by name' })
  search(@Query() query: SearchQueryDto) {
    return this.service.search(query);
  }

  @Post('find-or-create')
  @ApiOperation({ summary: 'Find a university by name or create it if not found' })
  findOrCreate(@Body() body: { name: string }) {
    return this.service.findOrCreate(body.name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get university by ID' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a university' })
  @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() dto: UpdateUniversityDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a university' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted university' })
  @ApiParam({ name: 'id', type: String })
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create universities' })
  bulkCreate(@Body() data: CreateUniversityDto[]) {
    return this.service.bulkCreate(data);
  }
}
