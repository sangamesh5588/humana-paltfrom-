import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a country' })
  @ApiResponse({ status: 201, description: 'Country created' })
  create(@Body() dto: CreateCountryDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all countries (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of countries' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search countries by name, iso2, or iso3' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query() query: SearchQueryDto) {
    return this.service.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Country details' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a country' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Country updated' })
  update(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a country' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Country soft-deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted country' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Country restored' })
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create countries' })
  @ApiResponse({ status: 201, description: 'Countries bulk-created' })
  bulkCreate(@Body() data: CreateCountryDto[]) {
    return this.service.bulkCreate(data);
  }
}
