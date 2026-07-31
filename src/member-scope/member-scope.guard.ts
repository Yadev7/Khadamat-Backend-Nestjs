import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../roles/roles.enum';
import { MEMBER_SCOPE_KEY } from './member-scope.decorator';

@Injectable()
export class MemberScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isMemberScoped = this.reflector.getAllAndOverride<boolean>(
      MEMBER_SCOPE_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!isMemberScoped) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const roleId = user.role?.id;

    switch (Number(roleId)) {
      case RoleEnum.admin:
      case RoleEnum.member_admin:
        return true;

      case RoleEnum.member_manager:
        return true;

      case RoleEnum.user:
        return true;

      default:
        throw new ForbiddenException(
          'Access denied. Only member roles can access this resource.',
        );
    }
  }
}
