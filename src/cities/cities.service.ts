import { CountriesService } from '../countries/countries.service';
import { Country } from '../countries/domain/country';
import { Localisation } from '../localisations/domain/localisation';

import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityRepository } from './infrastructure/persistence/city.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { City } from './domain/city';
import { LocalisationsService } from 'src/localisations/localisations.service';

@Injectable()
export class CitiesService {
  constructor(
    private readonly countryService: CountriesService,
    private readonly cityRepository: CityRepository,
    private readonly localisationService: LocalisationsService,
  ) {}

  async create(createCityDto: CreateCityDto) {
    let country: Country | null | undefined = undefined;

    // التحقق من وجود الدولة
    if (createCityDto.country) {
      const countryObject = await this.countryService.findById(
        createCityDto.country.id,
      );
      if (!countryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            country: 'notExists',
          },
        });
      }
      country = countryObject;
    } else if (createCityDto.country === null) {
      country = null;
    }

    // بناء كائن الموقع الجغرافي للربط (Cascade)
    // const localisation = (createCityDto.latitude && createCityDto.longitude)
    //   ? {
    //     latitude: createCityDto.latitude,
    //     longitude: createCityDto.longitude,
    //   } as Localisation
    //   : undefined;

    const localisation =
      createCityDto.latitude !== undefined &&
      createCityDto.longitude !== undefined
        ? ({
            latitude: Number(createCityDto.latitude),
            longitude: Number(createCityDto.longitude),
          } as Localisation)
        : undefined;

    return this.cityRepository.create({
      country,
      nameEn: createCityDto.nameEn,
      nameAr: createCityDto.nameAr,
      nameFr: createCityDto.nameFr,
      // تمرير الكائن هنا يضمن حفظه في جدول localisation وربط ID الخاص به بالمدينة
      localisation: localisation,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.cityRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: City['id']) {
    return this.cityRepository.findById(id);
  }

  findByIds(ids: City['id'][]) {
    return this.cityRepository.findByIds(ids);
  }

  // async update(id: City['id'], updateCityDto: UpdateCityDto) {
  //   let country: Country | null | undefined = undefined;

  //   // التحقق من الدولة عند التحديث
  //   if (updateCityDto.country) {
  //     const countryObject = await this.countryService.findById(
  //       updateCityDto.country.id,
  //     );
  //     if (!countryObject) {
  //       throw new UnprocessableEntityException({
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: {
  //           country: 'notExists',
  //         },
  //       });
  //     }
  //     country = countryObject;
  //   } else if (updateCityDto.country === null) {
  //     country = null;
  //   }

  //   // جلب المدينة الحالية لمعرفة ما إذا كانت تملك موقعاً مسبقاً
  //   const currentCity = await this.cityRepository.findById(id);

  //   // بناء كائن التحديث للموقع
  //   let localisation: any = undefined;
  //   if (updateCityDto.latitude && updateCityDto.longitude) {
  //     localisation = {
  //       // إذا وجد موقع سابق، نمرر المعرف الخاص به ليتم التحديث (Update) وليس الإضافة (Insert)
  //       id: currentCity?.localisation?.id,
  //       latitude: updateCityDto.latitude,
  //       longitude: updateCityDto.longitude,
  //     };
  //   }

  //   return this.cityRepository.update(id, {
  //     country,
  //     nameEn: updateCityDto.nameEn,
  //     nameAr: updateCityDto.nameAr,
  //     nameFr: updateCityDto.nameFr,
  //     localisation: localisation !== undefined ? localisation : currentCity?.localisation,
  //   });
  // }

  // src/cities/cities.service.ts

  async update(id: City['id'], updateCityDto: UpdateCityDto) {
    let country: Country | null | undefined = undefined;

    if (updateCityDto.country) {
      const countryObject = await this.countryService.findById(
        updateCityDto.country.id,
      );
      if (!countryObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { country: 'notExists' },
        });
      }
      country = countryObject;
    } else if (updateCityDto.country === null) {
      country = null;
    }

    // 1. جلب المدينة الحالية من قاعدة البيانات بكافة علاقاتها (مع الموقع)
    const currentCity = await this.cityRepository.findById(id);
    if (!currentCity) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { city: 'notExists' },
      });
    }

    // 2. بناء كائن الموقع الجغرافي بشكل ذكي
    let localisation: any = undefined;
    if (updateCityDto.latitude && updateCityDto.longitude) {
      localisation = {
        // نمرر المعرف القديم لنفس الموقع ليقوم بعمل UPDATE لسطر الموقع بدلاً من إضافة سطر جديد
        id: currentCity.localisation?.id || undefined,
        latitude: Number(updateCityDto.latitude),
        longitude: Number(updateCityDto.longitude),
      };
    } else if (
      updateCityDto.latitude === null ||
      updateCityDto.longitude === null
    ) {
      localisation = null;
    } else {
      localisation = currentCity.localisation;
    }

    // 3. دمج البيانات القديمة والجديدة وإرسالها للمستودع ليتم حفظها عبر الـ Mapper
    return this.cityRepository.update(id, {
      ...currentCity, // الحفاظ على البيانات الأساسية السابقة كالتاريخ والمعرفات
      country,
      nameEn: updateCityDto.nameEn,
      nameAr: updateCityDto.nameAr,
      nameFr: updateCityDto.nameFr,
      localisation: localisation,
    });
  }

  // remove(id: City['id']) {
  //   return this.cityRepository.remove(id);
  // }

  async remove(id: City['id']): Promise<void> {
    const city = await this.cityRepository.findById(id);
    if (city?.localisation?.id) {
      await this.localisationService.remove(city.localisation.id);
    }
    await this.cityRepository.remove(id);
    // تصفية وحذف سطر المدينة (وإذا أردت مسح الموقع، يفضل معالجته عبر المستودع المخصص له أو الاعتماد على دالة الحذف المباشرة)
  }
}
