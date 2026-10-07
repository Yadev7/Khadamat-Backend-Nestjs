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
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Member } from './domain/member';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllMembersDto } from './dto/find-all-members.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleEnum } from 'src/roles/roles.enum';

@ApiTags('Members')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'members',
  version: '1',
})
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('dashboard')
  @Roles(RoleEnum.member_admin, RoleEnum.member_manager)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getMemberDashboard() {
    return this.membersService.getDashboardData();
  }

  @Post()
  @ApiCreatedResponse({
    type: Member,
  })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Member),
  })
  async findAll(
    @Query() query: FindAllMembersDto,
  ): Promise<InfinityPaginationResponseDto<Member>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.membersService.findAllWithPagination({
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
    type: Member,
  })
  findById(@Param('id') id: string) {
    return this.membersService.findById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.admin, RoleEnum.member_admin, RoleEnum.member_manager)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Member,
  })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin, RoleEnum.member_admin, RoleEnum.member_manager)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
