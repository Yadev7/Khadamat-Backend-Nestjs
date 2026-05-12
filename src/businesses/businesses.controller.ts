import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Business } from './domain/business';
import { AuthGuard } from '@nestjs/passport';
import { InfinityPaginationResponseDto } from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllBusinessesDto } from './dto/find-all-businesses.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Businesses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'businesses',
  version: '1',
})
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Business,
  })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  // @Get()
  // @ApiOkResponse({
  //   type: InfinityPaginationResponse(Business),
  // })
  // async findAll(
  //   @Query() query: FindAllBusinessesDto,
  // ): Promise<InfinityPaginationResponseDto<Business>> {
  //   const page = query?.page ?? 1;
  //   let limit = query?.limit ?? 10;
  //   if (limit > 50) {
  //     limit = 50;
  //   }

  //   return infinityPagination(
  //     await this.businessesService.findAllWithPagination({
  //       paginationOptions: {
  //         page,
  //         limit,
  //       },
  //     }),
  //     { page, limit },
  //   );
  // }

  @Get()
  @Public()
  async findAll(
    @Query() query: FindAllBusinessesDto,
  ): Promise<InfinityPaginationResponseDto<Business>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    return infinityPagination(
      await this.businessesService.findAllWithPagination({
        paginationOptions: { page, limit },
        filterOptions: {
          cityId: query.cityId,
          zoneId: query.zoneId,
          serviceId: query.service, // Map 'service' from query to serviceId
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @Public()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Business,
  })
  findById(@Param('id') id: string) {
    return this.businessesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Business,
  })
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }
}
