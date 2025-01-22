import { Controller, Get, Query } from '@nestjs/common';
import { helloIsomorphic } from '@monorepo-ng-nest/isomorphic';
import { FeatureFlagsService } from './services/feature-flags.service';

@Controller()
export class AppController {
  constructor(
    private readonly featureFlagsService: FeatureFlagsService
  ) {}

  @Get('hello')
  getHello(@Query('userId') userId?: string) {
    const featureContext = this.featureFlagsService.getFeatureContext(userId);
    console.log('Feature context:', featureContext);
    return {
      message: helloIsomorphic(featureContext),
      featureContext
    };
  }
}
