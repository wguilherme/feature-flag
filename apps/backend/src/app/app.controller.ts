import { Controller, Get } from '@nestjs/common';
import { helloIsomorphic } from '@monorepo-ng-nest/isomorphic';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('hello')
  getHello() {
    return { message: helloIsomorphic() };
  }
}
