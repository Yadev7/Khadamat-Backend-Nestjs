import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import * as citiesData from './ma.json';

@Injectable()
export class CitySeedService {
  constructor(
    @InjectRepository(CityEntity)
    private repository: Repository<CityEntity>,
  ) {}

  async run() {
    for (const data of citiesData) {
      // التحقق مما إذا كانت المدينة موجودة مسبقاً لتجنب التكرار
      const count = await this.repository.count({
        where: { nameEn: data.city },
      });

      if (count === 0) {
        await this.repository.save(
          this.repository.create({
            nameEn: data.city,
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng),
            // يمكنك ربط الدولة هنا إذا كان لديك ID الدولة المغربية
          }),
        );
      }
    }
  }
}
