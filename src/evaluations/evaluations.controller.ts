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
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Evaluation } from './domain/evaluation';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllEvaluationsDto } from './dto/find-all-evaluations.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Evaluations')
@Controller({
  path: 'evaluations',
  version: '1',
})
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  // 🌟 Public route: Anyone can submit an evaluation/review without a token
  @Public()
  @Post()
  @ApiCreatedResponse({
    type: Evaluation,
  })
  create(@Body() createEvaluationDto: CreateEvaluationDto) {
    console.log('RECEIVED PAYLOAD:', createEvaluationDto);
    return this.evaluationsService.create(createEvaluationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Evaluation),
  })
  async findAll(
    @Query() query: FindAllEvaluationsDto,
  ): Promise<InfinityPaginationResponseDto<Evaluation>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.evaluationsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Evaluation,
  })
  findById(@Param('id') id: string) {
    return this.evaluationsService.findById(id);
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Evaluation,
  })
  update(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ) {
    return this.evaluationsService.update(id, updateEvaluationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.evaluationsService.remove(id);
  }
}
