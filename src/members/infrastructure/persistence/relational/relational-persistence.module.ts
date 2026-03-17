import { Module } from '@nestjs/common';
import { MemberRepository } from '../member.repository';
import { MemberRelationalRepository } from './repositories/member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  providers: [
    {
      provide: MemberRepository,
      useClass: MemberRelationalRepository,
    },
  ],
  exports: [MemberRepository],
})
export class RelationalMemberPersistenceModule {}
