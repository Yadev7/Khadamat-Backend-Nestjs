import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from 'src/countries/infrastructure/persistence/relational/entities/country.entity';
import { CityEntity } from 'src/cities/infrastructure/persistence/relational/entities/city.entity';
import { CityAreaEntity } from 'src/city-areas/infrastructure/persistence/relational/entities/city-area.entity';

@Injectable()
export class GeoSeedService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
    @InjectRepository(CityAreaEntity)
    private cityAreaRepository: Repository<CityAreaEntity>,
  ) {}

  async run() {
    // --- 1. SEED COUNTRY ---
    let country = await this.countryRepository.findOne({
      where: { countryCode: 'MA' },
    });
    if (!country) {
      country = await this.countryRepository.save(
        this.countryRepository.create({
          nameEn: 'Morocco',
          nameAr: 'المغرب',
          nameFr: 'Maroc',
          countryCode: 'MA',
          flagImg: 'https://flagcdn.com/w320/ma.png',
        }),
      );
    }

    // --- 2. SEED CITY ---
    // Fix: Use 'idCountry' or 'country' depending on how it's defined in CityEntity
    // If TypeORM complained, use the object relation:
    const city = await this.cityRepository.findOne({
      where: { nameEn: 'Fes', country: { id: country.id } },
    });

    // --- 3. SEED CITY AREA ---
    if (city) {
      const areaExists = await this.cityAreaRepository.findOne({
        where: { nameAr: 'النرجس', city: { id: city.id } },
      });

      if (!areaExists) {
        // Create the object first to avoid overload issues
        const newArea = this.cityAreaRepository.create({
          nameAr: 'النرجس',
          nameFr: 'Narjiss',
          city: city, // Use the city object relation
          // Removed localisationId as it's a relation,
          // if it's null by default, we don't need to specify it.
        });

        await this.cityAreaRepository.save(newArea);
      }
    }

    // if (!city) {
    //   city = await this.cityRepository.save(
    //     this.cityRepository.create({
    //       nameEn: 'Fes',
    //       nameAr: 'فاس',
    //       nameFr: 'Fès',
    //       country: country, // Pass the whole object
    //     }),
    //   );
    // }

    // --- 3. SEED CITY AREA ---
    // The check below ensures 'city' exists before accessing .id
    // --- 3. SEED CITY AREA ---
    if (city) {
      const areaNameAr = 'النرجس';

      const areaExists = await this.cityAreaRepository.findOne({
        where: {
          nameAr: areaNameAr,
          city: { id: city.id },
        },
      });

      if (!areaExists) {
        // Create a plain object that matches your entity structure
        // If your Entity doesn't have nameAr, check if it's name_ar or similar
        const areaData: any = {
          nameAr: areaNameAr,
          nameFr: 'Narjiss',
          city: city,
        };

        // If 'localisation' is the relation name, we leave it out
        // entirely so it stays null in the DB.

        await this.cityAreaRepository.save(
          this.cityAreaRepository.create(areaData),
        );
      }
    }

    console.log('🌱 Geo-data seeded successfully!');
  }
}
