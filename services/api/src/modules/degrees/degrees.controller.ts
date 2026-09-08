import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DegreesService } from './degrees.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Degrees')
@Controller('degrees')
export class DegreesController {
  constructor(private readonly service: DegreesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a degree' })
  create(@Body() dto: CreateDegreeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all degrees (paginated)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search degrees by name' })
  search(@Query() query: SearchQueryDto) {
    return this.service.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get degree by ID' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a degree' })
  @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() dto: UpdateDegreeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a degree' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted degree' })
  @ApiParam({ name: 'id', type: String })
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create degrees' })
  bulkCreate(@Body() data: CreateDegreeDto[]) {
    return this.service.bulkCreate(data);
  }
}
