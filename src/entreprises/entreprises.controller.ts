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
import { EntreprisesService } from './entreprises.service';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Entreprise } from './domain/entreprise';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllEntreprisesDto } from './dto/find-all-entreprises.dto';

@ApiTags('Entreprises')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'entreprises',
  version: '1',
})
export class EntreprisesController {
  constructor(private readonly entreprisesService: EntreprisesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Entreprise,
  })
  create(@Body() createEntrepriseDto: CreateEntrepriseDto) {
    return this.entreprisesService.create(createEntrepriseDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Entreprise),
  })
  async findAll(
    @Query() query: FindAllEntreprisesDto,
  ): Promise<InfinityPaginationResponseDto<Entreprise>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.entreprisesService.findAllWithPagination({
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
    type: Entreprise,
  })
  findById(@Param('id') id: string) {
    return this.entreprisesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Entreprise,
  })
  update(
    @Param('id') id: string,
    @Body() updateEntrepriseDto: UpdateEntrepriseDto,
  ) {
    return this.entreprisesService.update(id, updateEntrepriseDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.entreprisesService.remove(id);
  }
}
