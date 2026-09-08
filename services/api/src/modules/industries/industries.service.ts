import { Injectable, NotFoundException } from '@nestjs/common';
import { IndustriesRepository } from './industries.repository';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class IndustriesService {
  constructor(private readonly repo: IndustriesRepository) {}

  async create(dto: CreateIndustryDto) { return this.repo.create(dto); }

  async findAll(query: PaginationQueryDto) {
    return this.repo.findAll({
      page: query.page ?? 1, limit: query.limit ?? 20,
      sort: query.sort ?? 'name', order: query.order ?? 'asc',
    });
  }

  async findById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Industry not found');
    return item;
  }

  async search(query: SearchQueryDto) {
    return this.repo.search(query.q ?? '', query.page ?? 1, query.limit ?? 20);
  }

  async update(id: string, dto: UpdateIndustryDto) {
    await this.findById(id);
    return this.repo.update(id, dto);
  }

  async remove(id: string) { await this.findById(id); return this.repo.softDelete(id); }
  async restore(id: string) { await this.findById(id); return this.repo.restore(id); }
  async bulkCreate(data: CreateIndustryDto[]) { return this.repo.bulkCreate(data); }
}
