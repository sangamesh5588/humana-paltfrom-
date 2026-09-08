import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a company' })
  create(@Body() dto: CreateCompanyDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'List all companies (paginated)' })
  findAll(@Query() query: PaginationQueryDto) { return this.service.findAll(query); }

  @Get('search')
  @ApiOperation({ summary: 'Search companies by name' })
  search(@Query() query: SearchQueryDto) { return this.service.search(query); }

  @Post('find-or-create')
  @ApiOperation({ summary: 'Find a company by name or create it if not found' })
  findOrCreate(@Body() body: { name: string }) {
    return this.service.findOrCreate(body.name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', type: String })
  findById(@Param('id') id: string) { return this.service.findById(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a company' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted company' })
  @ApiParam({ name: 'id', type: String })
  restore(@Param('id') id: string) { return this.service.restore(id); }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create companies' })
  bulkCreate(@Body() data: CreateCompanyDto[]) { return this.service.bulkCreate(data); }
}
