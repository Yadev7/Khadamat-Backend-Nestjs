import { Module } from '@nestjs/common';
import { MemberScopeGuard } from './member-scope.guard';

@Module({
  providers: [MemberScopeGuard],
  exports: [MemberScopeGuard],
})
export class MemberScopeModule {}
