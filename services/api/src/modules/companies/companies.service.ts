import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginationQueryDto, SearchQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly repo: CompaniesRepository) {}

  async create(dto: CreateCompanyDto) {
    const { industryId, countryId, ...rest } = dto;
    return this.repo.create({
      ...rest,
      ...(industryId && { industry: { connect: { id: industryId } } }),
      ...(countryId && { country: { connect: { id: countryId } } }),
    });
  }

  async findAll(query: PaginationQueryDto) {
    return this.repo.findAll({
      page: query.page ?? 1, limit: query.limit ?? 20,
      sort: query.sort ?? 'name', order: query.order ?? 'asc',
    });
  }

  async findById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException('Company not found');
    return item;
  }

  async search(query: SearchQueryDto) {
    return this.repo.search(query.q ?? '', query.page ?? 1, query.limit ?? 20);
  }

  async update(id: string, dto: UpdateCompanyDto) {
    await this.findById(id);
    const { industryId, countryId, ...rest } = dto;
    return this.repo.update(id, {
      ...rest,
      ...(industryId !== undefined && { industry: industryId ? { connect: { id: industryId } } : { disconnect: true } }),
      ...(countryId !== undefined && { country: countryId ? { connect: { id: countryId } } : { disconnect: true } }),
    });
  }

  async remove(id: string) { await this.findById(id); return this.repo.softDelete(id); }
  async restore(id: string) { await this.findById(id); return this.repo.restore(id); }

  async findOrCreate(name: string) {
    if (!name || name.trim().length < 2) {
      throw new NotFoundException('Company name must be at least 2 characters');
    }
    return this.repo.findOrCreate(name);
  }

  async bulkCreate(data: CreateCompanyDto[]) { return this.repo.bulkCreate(data as any); }
}
