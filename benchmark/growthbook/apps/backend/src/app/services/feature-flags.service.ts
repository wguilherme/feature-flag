import { Injectable, OnModuleInit } from '@nestjs/common';
import { GrowthBookClient, Context } from '@growthbook/growthbook';
import { FeatureFlagsContext } from '@monorepo-ng-nest/isomorphic';

@Injectable()
export class FeatureFlagsService implements OnModuleInit {
  private client: GrowthBookClient;
  private isClientInitialized = false;

  constructor() {
    const apiHost = process.env.GROWTHBOOK_API_HOST || 'http://localhost:3100';
    const clientKey = process.env.GROWTHBOOK_CLIENT_KEY || 'sdk-OfdGYQEJohOkYfC4';

    console.log('Initializing GrowthBook client with config:', {
      apiHost,
      clientKey
    });

    this.client = new GrowthBookClient({
      apiHost,
      clientKey,
      enabled: true,
      trackingCallback: (experiment, result) => {
        console.log('Experiment Viewed:', {
          experimentId: experiment.key,
          variationId: result.key,
        });
      },
    });
  }

  async onModuleInit() {
    try {
      console.log('Attempting to initialize GrowthBook client...');
      
      await this.client.init({ timeout: 5000 });
      this.isClientInitialized = true;
      
      console.log('GrowthBook client initialized successfully');
      
      // Log available features
      const features = this.client.getFeatures();
      console.log('Available features:', JSON.stringify(features, null, 2));

      // Log client state
      console.log('GrowthBook client state:', {
        isInitialized: this.isClientInitialized,
        hasFeatures: Object.keys(features || {}).length > 0,
        apiHost: this.client['apiHost'],
        clientKey: this.client['clientKey']
      });

      // Try to make a test API call
      try {
        const response = await fetch('http://localhost:3100/api/features', {
          headers: {
            'Authorization': `Bearer ${process.env.GROWTHBOOK_CLIENT_KEY || 'sdk-OfdGYQEJohOkYfC4'}`
          }
        });
        const responseData = await response.text();
        console.log('GrowthBook API test response:', {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          data: responseData.substring(0, 200) // Log first 200 chars only
        });
      } catch (error) {
        console.error('Failed to make test API call to GrowthBook:', {
          error: error.message,
          name: error.name,
          stack: error.stack
        });
      }

    } catch (error) {
      console.error('Failed to initialize GrowthBook client:', {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
    }
  }

  getFeatureContext(userId: string = 'test-user-1'): FeatureFlagsContext {
    if (!this.isClientInitialized) {
      console.warn('GrowthBook client not initialized');
      return { isBetaEnabled: false };
    }

    console.log('Getting feature for user:', userId);

    const context: Context = {
      attributes: {
        id: userId,
        environment: 'production'
      }
    };

    console.log('Evaluating feature with context:', JSON.stringify(context, null, 2));

    const feature = this.client.getFeatureValue('BETA_FLOW_V2', false, context);

    console.log('Feature BETA_FLOW_V2 evaluation result:', {
      feature
    })


    console.log('Feature BETA_FLOW_V2 evaluation result:', {
      userId,
      enabled: feature,
      context,
      allFeatures: this.client.getFeatures()
    });

    return {
      isBetaEnabled: feature,
    };
  }
}
