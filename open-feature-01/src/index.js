// app.js
const express = require('express');
const { OpenFeature } = require('@openfeature/server-sdk');
const { FlagdProvider } = require('@openfeature/flagd-provider');

const app = express();

// Configurar OpenFeature com gRPC
const provider = new FlagdProvider({
  host: 'flagd',
  port: 8013
});

async function startServer() {
  try {
    await OpenFeature.setProvider(provider);
    console.log('OpenFeature provider initialized successfully');
    
    const client = OpenFeature.getClient();

    app.get('/', async (req, res) => {
      try {
        const novaFuncaoAtiva = await client.getBooleanValue('nova-funcao', false);
        console.log('novaFuncaoAtiva:', novaFuncaoAtiva);
        
        if (novaFuncaoAtiva) {
          res.send('Nova função ativa!');
        } else {
          res.send('Função desativada');
        }
      } catch (error) {
        console.error('Erro ao obter feature flag:', error);
        res.status(500).send('Erro ao verificar feature flag');
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