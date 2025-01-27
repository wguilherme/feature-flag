import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { FeatureFlagsService } from './services/feature-flags.service';
import { GrowthBookMiddleware } from './middleware/growthbook.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [FeatureFlagsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GrowthBookMiddleware).forRoutes('*');
  }
}
