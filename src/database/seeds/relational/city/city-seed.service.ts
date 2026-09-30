import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../../../../cities/infrastructure/persistence/relational/entities/city.entity';
import citiesRaw from './cities.json';

@Injectable()
export class CitySeedService {
  constructor(
    @InjectRepository(CityEntity)
    private repository: Repository<CityEntity>,
  ) {}

  async run() {
    for (const data of citiesRaw) {
      // التحقق مما إذا كانت المدينة موجودة مسبقاً لتجنب التكرار
      const count = await this.repository.count({
        where: { nameEn: data.city },
      });

      if (count === 0) {
        const city = this.repository.create({
          nameEn: data.city,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
          // يمكنك ربط الدولة هنا إذا كان لديك ID الدولة المغربية
        } as any);

        await this.repository.save(city);
      }
    }
  }
}
