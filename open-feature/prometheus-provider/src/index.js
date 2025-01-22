const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');
const path = require('path');
const express = require('express');
require('dotenv').config();

const PROTO_PATH = path.join(__dirname, 'flags.proto');

// Carrega o arquivo proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const flagService = protoDescriptor.flags;

// Configuração do Prometheus
const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://prometheus.monitoring.svc.cluster.local:9090';

// Função para consultar o Prometheus
async function queryPrometheus(query) {
  try {
    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query`, {
      params: {
        query: query
      }
    });

    if (response.data.status === 'success' && response.data.data.result.length > 0) {
      return parseFloat(response.data.data.result[0].value[1]);
    }
    return null;
  } catch (error) {
    console.error('Error querying Prometheus:', error.message);
    return null;
  }
}

// Implementação do serviço
const server = new grpc.Server();

server.addService(flagService.FlagProvider.service, {
  async resolveString(call, callback) {
    const flagKey = call.request.flag_key;

    if (flagKey === 'welcome-message') {
      try {
        // Calcula a taxa de sucesso
        const query = "sum(rate(app_requests_total{status='success'}[5m])) / sum(rate(app_requests_total[5m])) * 100";
        const successRate = await queryPrometheus(query);

        if (successRate === null) {
          callback(null, {
            value: "Bem-vindo ao nosso serviço!",
            reason: "DEFAULT",
            variant: "v1"
          });
          return;
        }

        if (successRate >= 90) {
          callback(null, {
            value: "Bem-vindo ao nosso serviço!",
            reason: "TARGETING_MATCH",
            variant: "v1"
          });
        } else {
          callback(null, {
            value: "Olá! Parece que estamos enfrentando alguns problemas. Nossa equipe está trabalhando nisso!",
            reason: "TARGETING_MATCH",
            variant: "v2"
          });
        }
      } catch (error) {
        console.error('Error resolving flag:', error);
        callback(null, {
          value: "Bem-vindo ao nosso serviço!",
          reason: "ERROR",
          variant: "v1"
        });
      }
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Flag not found'
      });
    }
  },

  resolveBool(call, callback) {
    const flagKey = call.request.flag_key;

    if (flagKey === 'nova-funcao') {
      callback(null, {
        value: true,
        reason: "STATIC",
        variant: "on"
      });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Flag not found'
      });
    }
  },

  resolveFloat(call, callback) {
    callback({
      code: grpc.status.UNIMPLEMENTED,
      details: 'Method not implemented'
    });
  },

  resolveObject(call, callback) {
    callback({
      code: grpc.status.UNIMPLEMENTED,
      details: 'Method not implemented'
    });
  }
});

// Inicia o servidor
const grpcPort = process.env.PORT || 8013;
server.bindAsync(
  `0.0.0.0:${grpcPort}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start server:', error);
      return;
    }
    console.log(`Server running at 0.0.0.0:${port}`);
    server.start();
  }
);

// Inicia o servidor HTTP
const app = express();
const httpPort = process.env.PORT || 8017;

// Endpoint para fornecer as flags
app.get('/flags.yaml', async (req, res) => {
  try {
    // Calcula a taxa de sucesso
    const query = "sum(rate(app_requests_total{status='success'}[5m])) / sum(rate(app_requests_total[5m])) * 100";
    const successRate = await queryPrometheus(query);

    // Define a variante com base na taxa de sucesso
    const welcomeVariant = successRate >= 90 ? "v1" : "v2";

    // Gera o arquivo de configuração
    const config = {
      flags: {
        'nova-funcao': {
          state: 'ENABLED',
          variants: {
            on: true,
            off: false
          },
          defaultVariant: "on"
        },
        'welcome-message': {
          state: 'ENABLED',
          variants: {
            v1: "Bem-vindo ao nosso serviço!",
            v2: "Olá! Parece que estamos enfrentando alguns problemas. Nossa equipe está trabalhando nisso!"
          },
          defaultVariant: welcomeVariant
        }
      }
    };

    // Converte para YAML e envia
    res.setHeader('Content-Type', 'application/yaml');
    res.send(require('yaml').stringify(config));
  } catch (error) {
    console.error('Error generating flags:', error);
    res.status(500).send('Error generating flags');
  }
});

app.listen(httpPort, () => {
  console.log(`Server running at http://0.0.0.0:${httpPort}`);
});
