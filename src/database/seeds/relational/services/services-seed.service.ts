import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from 'src/services/infrastructure/persistence/relational/entities/service.entity';
import rawServices from './services.json';

@Injectable()
export class ServiceSeedService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  async run() {
    const list = Array.isArray(rawServices)
      ? rawServices
      : ((rawServices as any).default ?? []);

    const existingCount = await this.serviceRepo.count();
    if (existingCount > 0) {
      console.log(
        `ℹ️ Services already seeded (${existingCount} found). Skipping.`,
      );
      return;
    }

    const entities = this.serviceRepo.create(list);
    await this.serviceRepo.save(entities, { chunk: 20 });
    console.log(`✅ Successfully seeded ${entities.length} services.`);
  }
}
