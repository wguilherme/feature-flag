const express = require('express');
const { OpenFeature } = require('@openfeature/server-sdk');
const { FlagdProvider } = require('@openfeature/flagd-provider');
const promClient = require('prom-client');

const app = express();
const port = 3000;

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

async function initializeOpenFeature() {

  const flagdMode = process.env.FLAGD_MODE || 'operator';
  const host = process.env.FLAGD_HOST || (flagdMode === 'operator' ? 'localhost' : 'flagd');
  const port = process.env.FLAGD_PORT || '8013';

  const provider = new FlagdProvider({
    host,
    port,
    cache: false,
    debug: "1.0.0"
  });

  try {
    await OpenFeature.setProvider(provider);
    console.log('OpenFeature provider initialized successfully');
  } catch (error) {
    console.error('Error during provider initialization:', error);
  }
}

initializeOpenFeature();

const featureClient = OpenFeature.getClient('hello-world-app');

app.get('/', async (req, res) => {
  try {
    const novaFuncao = await featureClient.getBooleanValue('nova-funcao', false);

    const flagd = await featureClient.getStringValue('welcome-message', 'Bem-vindo!');
    const flipt = await featureClient.getStringValue('flipt_v1', 'fallback')

    res.json({
      novaFuncao,
      mode: process.env.FLAGD_MODE || 'operator',
      flags: {
        flipt,
        flagd
      }
    });
  } catch (error) {
    console.error('Error getting feature flag:', error);
    res.status(500).json({
      error: 'Error getting feature flag',
      message: 'Bem-vindo!',
      novaFuncao: false,
      mode: process.env.FLAGD_MODE || 'operator'
    });
  }
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.FLAGD_MODE || 'operator'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.FLAGD_MODE || 'operator'} mode`);
});