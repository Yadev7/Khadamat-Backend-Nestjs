import { SetMetadata } from '@nestjs/common';

export const MEMBER_SCOPE_KEY = 'memberScope';
export const MemberScope = () => SetMetadata(MEMBER_SCOPE_KEY, true);
