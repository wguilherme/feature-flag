// app.js
const express = require('express');
const { OpenFeature } = require('@openfeature/server-sdk');
const { FlagdProvider } = require('@openfeature/flagd-provider');
const promClient = require('prom-client');

const app = express();

// Configurar métricas Prometheus
const register = new promClient.Registry();
const requestCounter = new promClient.Counter({
  name: 'app_requests_total',
  help: 'Total number of requests',
  labelNames: ['status'],
  registers: [register]
});

// Configurar OpenFeature
const provider = new FlagdProvider({
  host: 'flagd',
  port: 8013
});

async function startServer() {
  try {
    await OpenFeature.setProvider(provider);
    console.log('OpenFeature provider initialized successfully');
    
    const client = OpenFeature.getClient();

    // Endpoint para métricas do Prometheus
    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', register.contentType);
      res.send(await register.metrics());
    });

    // Rota de sucesso
    app.get('/success', (req, res) => {
      requestCounter.inc({ status: 'success' });
      res.send('Success recorded!');
    });

    // Rota de erro
    app.get('/error', (req, res) => {
      requestCounter.inc({ status: 'error' });
      res.status(500).send('Error recorded!');
    });

    app.get('/', async (req, res) => {
      try {
        const [novaFuncaoAtiva, welcomeMessage] = await Promise.all([
          client.getBooleanValue('nova-funcao', true),
          client.getStringValue('welcome-message', 'Bem-vindo ao nosso serviço!')
        ]);

        console.log('novaFuncaoAtiva:', novaFuncaoAtiva);
        console.log('welcomeMessage:', welcomeMessage);
        
        const response = {
          feature: novaFuncaoAtiva ? 'Nova função ativa!' : 'Função desativada',
          message: welcomeMessage
        };

        res.json(response);
      } catch (error) {
        console.error('Erro ao obter feature flags:', error);
        res.status(500).send('Erro ao verificar feature flags');
      }
    });

    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error('Error initializing OpenFeature:', error);
    process.exit(1);
  }
}

startServer().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});