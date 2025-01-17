// app.js
const express = require('express');
const { OpenFeature } = require('@openfeature/js-sdk');
const { FlagdProvider } = require('@openfeature/flagd-provider');

const app = express();

// Configurar OpenFeature
const provider = new FlagdProvider({
  host: 'flagd', // nome do service no K8s
  port: 8013
});

OpenFeature.setProvider(provider);
const client = OpenFeature.getClient();

app.get('/', async (req, res) => {
  const novaFuncaoAtiva = await client.getBooleanValue('nova-funcao', false);

  console.log('novaFuncaoAtiva', novaFuncaoAtiva);
  
  if (novaFuncaoAtiva) {
    res.send('Nova função ativa!');
  } else {
    res.send('Função desativada');
  }
});

app.listen(3000);