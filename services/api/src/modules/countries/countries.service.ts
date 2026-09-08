import { Injectable, NotFoundException } from '@nestjs/common';
import { CountriesRepository } from './countries.repository';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly repo: CountriesRepository) {}

  async create(dto: CreateCountryDto) {
    return this.repo.create(dto);
  }

  async findAll(query: PaginationQueryDto) {
    return this.repo.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      sort: query.sort ?? 'name',
      order: query.order ?? 'asc',
    });
  }

  async findById(id: string) {
    const country = await this.repo.findById(id);
    if (!country) throw new NotFoundException('Country not found');
    return country;
  }

  async search(query: SearchQueryDto) {
    return this.repo.search(
      query.q ?? '',
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async update(id: string, dto: UpdateCountryDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.repo.softDelete(id);
  }

  async restore(id: string) {
    await this.findById(id);
    return this.repo.restore(id);
  }

  async bulkCreate(data: CreateCountryDto[]) {
    return this.repo.bulkCreate(data);
  }
}
