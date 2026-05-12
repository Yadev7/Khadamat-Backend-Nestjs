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
import { SelectedBusinessesService } from './selected-businesses.service';
import { CreateSelectedBusinessDto } from './dto/create-selected-business.dto';
import { UpdateSelectedBusinessDto } from './dto/update-selected-business.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SelectedBusiness } from './domain/selected-business';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllSelectedBusinessesDto } from './dto/find-all-selected-businesses.dto';

@ApiTags('Selectedbusinesses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'selected-businesses',
  version: '1',
})
export class SelectedBusinessesController {
  constructor(
    private readonly selectedBusinessesService: SelectedBusinessesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: SelectedBusiness,
  })
  create(@Body() createSelectedBusinessDto: CreateSelectedBusinessDto) {
    return this.selectedBusinessesService.create(createSelectedBusinessDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(SelectedBusiness),
  })
  async findAll(
    @Query() query: FindAllSelectedBusinessesDto,
  ): Promise<InfinityPaginationResponseDto<SelectedBusiness>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.selectedBusinessesService.findAllWithPagination({
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
    type: SelectedBusiness,
  })
  findById(@Param('id') id: string) {
    return this.selectedBusinessesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: SelectedBusiness,
  })
  update(
    @Param('id') id: string,
    @Body() updateSelectedBusinessDto: UpdateSelectedBusinessDto,
  ) {
    return this.selectedBusinessesService.update(id, updateSelectedBusinessDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.selectedBusinessesService.remove(id);
  }
}
