import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GrowthBookClient, Context } from '@growthbook/growthbook';

@Injectable()
export class GrowthBookMiddleware implements NestMiddleware {
  private client: GrowthBookClient;
  private isClientInitialized = false;

  constructor() {
    this.client = new GrowthBookClient({
      apiHost: 'http://localhost:3100',
      clientKey: 'sdk-OfdGYQEJohOkYfC4',
      enabled: true,
      trackingCallback: (experiment, result) => {
        console.log('Experiment Viewed:', {
          experimentId: experiment.key,
          variationId: result.key,
        });
      },
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!this.isClientInitialized) {
      try {
        await this.client.init({ timeout: 1000 });
        this.isClientInitialized = true;
      } catch (error) {
        console.error('Failed to initialize GrowthBook client:', error);
      }
    }

    const userContext: Context = {
      attributes: {
        id: (req.query.userId as string) || 'anonymous',
        environment: 'production'
      },
    };

    req['growthbook'] = this.client.createScopedInstance(userContext);
    next();
  }
}
