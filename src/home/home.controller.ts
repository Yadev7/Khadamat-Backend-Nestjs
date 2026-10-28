import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Home')
@Controller()
export class HomeController {
  constructor(private service: HomeService) {}

  @Public()
  @Get()
  appInfo() {
    return this.service.appInfo();
  }
}
