import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Industries')
@Controller('industries')
export class IndustriesController {
  constructor(private readonly service: IndustriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an industry' })
  create(@Body() dto: CreateIndustryDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'List all industries (paginated)' })
  findAll(@Query() query: PaginationQueryDto) { return this.service.findAll(query); }

  @Get('search')
  @ApiOperation({ summary: 'Search industries by name' })
  search(@Query() query: SearchQueryDto) { return this.service.search(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Get industry by ID' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) { return this.service.findById(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an industry' })
  @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() dto: UpdateIndustryDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an industry' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted industry' })
  @ApiParam({ name: 'id', type: String })
  restore(@Param('id') id: string) { return this.service.restore(id); }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create industries' })
  bulkCreate(@Body() data: CreateIndustryDto[]) { return this.service.bulkCreate(data); }
}
