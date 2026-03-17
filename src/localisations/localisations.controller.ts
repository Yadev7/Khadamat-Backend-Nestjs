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
import { LocalisationsService } from './localisations.service';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Localisation } from './domain/localisation';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllLocalisationsDto } from './dto/find-all-localisations.dto';

@ApiTags('Localisations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'localisations',
  version: '1',
})
export class LocalisationsController {
  constructor(private readonly localisationsService: LocalisationsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Localisation,
  })
  create(@Body() createLocalisationDto: CreateLocalisationDto) {
    return this.localisationsService.create(createLocalisationDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Localisation),
  })
  async findAll(
    @Query() query: FindAllLocalisationsDto,
  ): Promise<InfinityPaginationResponseDto<Localisation>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.localisationsService.findAllWithPagination({
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
    type: Localisation,
  })
  findById(@Param('id') id: string) {
    return this.localisationsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Localisation,
  })
  update(
    @Param('id') id: string,
    @Body() updateLocalisationDto: UpdateLocalisationDto,
  ) {
    return this.localisationsService.update(id, updateLocalisationDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.localisationsService.remove(id);
  }
}
