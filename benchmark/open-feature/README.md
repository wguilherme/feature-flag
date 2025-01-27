# Feature Flag Demo with OpenFeature and Flipt

Este projeto demonstra a implementação de feature flags usando OpenFeature como SDK e Flipt como provedor de feature flags.

## Arquitetura

O projeto utiliza as seguintes tecnologias:

- [OpenFeature](https://openfeature.dev/): SDK para gerenciamento de feature flags
- [Flipt](https://flipt.io/): Provedor de feature flags
- [Kubernetes](https://kubernetes.io/): Orquestração de containers
- [Kind](https://kind.sigs.k8s.io/): Kubernetes local para desenvolvimento

## Pré-requisitos

- Docker
- Kind (Kubernetes in Docker)
- kubectl
- Helm
- fswatch (para desenvolvimento local)

## Quickstart

1. **Configurar o cluster Kind**

```bash
make kind
```

Este comando irá:
- Criar um cluster Kind
- Instalar o cert-manager
- Instalar o OpenFeature Operator

2. **Implantar a aplicação**

```bash
make k8s-deploy
```

3. **Acessar a aplicação**

```bash
make dev
```

A aplicação estará disponível em http://localhost:3001

## Desenvolvimento

O projeto suporta dois modos de operação:

- **Operator Mode**: Usa o OpenFeature Operator para gerenciar as feature flags (padrão)
- **Standalone Mode**: Usa o Flagd diretamente sem o operator

Para alternar entre os modos, use a variável `FLAG_MODE`:

```bash
# Operator Mode
FLAG_MODE=operator make dev

# Standalone Mode
FLAG_MODE=standalone make dev
```

### Comandos disponíveis

- `make dev`: Inicia o ambiente de desenvolvimento com hot-reload
- `make k8s-build`: Constrói a imagem Docker
- `make k8s-deploy`: Implanta a aplicação no Kubernetes
- `make k8s-delete`: Remove a aplicação do Kubernetes
- `make kind`: Configura um novo cluster Kind com todas as dependências

## Estrutura do Projeto

```
.
├── k8s/                    # Configurações Kubernetes
│   ├── v2/                # Configurações para modo operator
│   └── *.yaml             # Configurações para modo standalone
├── src/                    # Código fonte da aplicação
├── Dockerfile             # Dockerfile para build da aplicação
├── Makefile              # Comandos make para desenvolvimento
└── README.md             # Esta documentação
```

## Troubleshooting

### Logs

Para ver os logs da aplicação:
```bash
kubectl logs -l app=hello-world-operator
```

Para ver os logs do Flipt:
```bash
kubectl logs -l app=flipt
```

Para ver os logs do OpenFeature Operator:
```bash
kubectl logs -l app=feature-flag-source-operator
```
