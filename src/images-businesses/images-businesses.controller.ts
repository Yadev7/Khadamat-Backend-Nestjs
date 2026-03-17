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
import { ImagesBusinessesService } from './images-businesses.service';
import { CreateImagesBusinessDto } from './dto/create-images-business.dto';
import { UpdateImagesBusinessDto } from './dto/update-images-business.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ImagesBusiness } from './domain/images-business';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllImagesBusinessesDto } from './dto/find-all-images-businesses.dto';

@ApiTags('Imagesbusinesses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'images-businesses',
  version: '1',
})
export class ImagesBusinessesController {
  constructor(
    private readonly imagesBusinessesService: ImagesBusinessesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: ImagesBusiness,
  })
  create(@Body() createImagesBusinessDto: CreateImagesBusinessDto) {
    return this.imagesBusinessesService.create(createImagesBusinessDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ImagesBusiness),
  })
  async findAll(
    @Query() query: FindAllImagesBusinessesDto,
  ): Promise<InfinityPaginationResponseDto<ImagesBusiness>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.imagesBusinessesService.findAllWithPagination({
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
    type: ImagesBusiness,
  })
  findById(@Param('id') id: string) {
    return this.imagesBusinessesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: ImagesBusiness,
  })
  update(
    @Param('id') id: string,
    @Body() updateImagesBusinessDto: UpdateImagesBusinessDto,
  ) {
    return this.imagesBusinessesService.update(id, updateImagesBusinessDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.imagesBusinessesService.remove(id);
  }
}
