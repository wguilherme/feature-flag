const express = require('express');
const { OpenFeature } = require('@openfeature/server-sdk');
const { FlagdProvider } = require('@openfeature/flagd-provider');
const promClient = require('prom-client');

const app = express();
const port = 3000;

// Configuração do Prometheus
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Função para esperar um tempo
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para inicializar o OpenFeature
async function initializeOpenFeature() {
  const flagdMode = process.env.FLAGD_MODE || 'operator';
  console.log(`Initializing OpenFeature in ${flagdMode} mode`);

  const host = process.env.FLAGD_HOST || (flagdMode === 'operator' ? 'localhost' : 'flagd');
  const port = process.env.FLAGD_PORT || '8013';

  const provider = new FlagdProvider({
    host,
    port,
    cache: false,
    debug: true
  });

  try {
    // Espera 5 segundos antes de tentar conectar ao flagd
    console.log('Waiting for flagd to be ready...');
    await sleep(5000);

    await OpenFeature.setProvider(provider);
    console.log('OpenFeature provider initialized successfully');
  } catch (error) {
    console.error('Error during provider initialization:', error);
    // Não vamos falhar a inicialização, apenas logar o erro
  }
}

// Inicializa o OpenFeature
initializeOpenFeature();

const featureClient = OpenFeature.getClient('hello-world-app');

app.get('/', async (req, res) => {
  try {
    const novaFuncao = await featureClient.getBooleanValue('nova-funcao', false);
    const welcomeMessage = await featureClient.getStringValue('welcome-message', 'Bem-vindo!');

    res.json({
      message: welcomeMessage,
      novaFuncao,
      mode: process.env.FLAGD_MODE || 'operator',
      debug: 'true'
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

// Endpoint de métricas do Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.FLAGD_MODE || 'operator'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.FLAGD_MODE || 'operator'} mode`);
});