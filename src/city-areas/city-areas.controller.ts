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
import { CityAreasService } from './city-areas.service';
import { CreateCityAreaDto } from './dto/create-city-area.dto';
import { UpdateCityAreaDto } from './dto/update-city-area.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CityArea } from './domain/city-area';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCityAreasDto } from './dto/find-all-city-areas.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Cityareas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'city-areas',
  version: '1',
})
export class CityAreasController {
  constructor(private readonly cityAreasService: CityAreasService) {}

  @Post()
  @ApiCreatedResponse({
    type: CityArea,
  })
  create(@Body() createCityAreaDto: CreateCityAreaDto) {
    return this.cityAreasService.create(createCityAreaDto);
  }

  @Get()
  @Public()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CityArea),
  })
  async findAll(
    @Query() query: FindAllCityAreasDto,
  ): Promise<InfinityPaginationResponseDto<CityArea>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.cityAreasService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CityArea,
  })
  findById(@Param('id') id: string) {
    return this.cityAreasService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CityArea,
  })
  update(
    @Param('id') id: string,
    @Body() updateCityAreaDto: UpdateCityAreaDto,
  ) {
    return this.cityAreasService.update(id, updateCityAreaDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.cityAreasService.remove(id);
  }
}
