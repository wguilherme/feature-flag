# Feature Flag

## O que são Feature Flags?

De forma simples, você pode pensar em uma chave de funcionalidade (feature flag) como uma declaração se/senão que pode ser controlada durante a execução da aplicação. As chaves de funcionalidade permitem que o comportamento da aplicação seja alterado sem a necessidade de implantar novo código.

Esta capacidade serve a diversos propósitos. Você pode reduzir a necessidade de ramificações (branches) de funcionalidades de longa duração. Você pode ocultar funcionalidades em desenvolvimento dos usuários finais, enquanto ainda as expõe para testes internos. Você pode realizar implantações canário (canary releases) - lançando uma nova funcionalidade inicialmente para um pequeno subconjunto de usuários. Você pode realizar testes A/B. Você pode degradar com segurança partes de um sistema em produção que estejam enfrentando uma interrupção. Você pode restringir o acesso a funcionalidades específicas do produto com base em características do usuário, como localização geográfica ou endereço IP, por razões de usabilidade, conformidade ou licenciamento.

As chaves de funcionalidade são dinâmicas; elas são avaliadas durante a execução. Muitos dos casos de uso descritos acima também exigem que as chaves de funcionalidade sejam sensíveis ao contexto - uma decisão de ativação deve levar em conta fatores como qual usuário está fazendo uma requisição web. Além disso, a configuração por trás das decisões de ativação também precisa ser dinâmica para suportar casos de uso como implantações canário, onde você gradualmente disponibiliza uma funcionalidade para mais usuários sem precisar reimplantar ou reiniciar nada.

Considerando todos estes requisitos (junto com outros como interface administrativa, trilhas de auditoria, gerenciamento de ambiente e mais), fica claro que o uso completo de chaves de funcionalidade requer um sistema de chaveamento - tipicamente um serviço independente de chaveamento de funcionalidades junto com uma biblioteca cliente que interage com esse serviço.


## Objetivo

O objetivo deste Benchmark é:
1. Avaliar e comparar as principais ferramentas de Feature Flag do mercado
2. Definir requisitos e features desejadas para um sistema de Feature Flags
3. Explorar soluções cloud-native e integração com Kubernetes
4. Testar tecnologias através de implementações práticas para facilitar o P&D

## Soluções Analisadas

### Ferramentas de Mercado

| Solução | Tipo | Diferencial | Links |
|---------|------|-------------|-------|
| [LaunchDarkly](https://launchdarkly.com/) | Proprietário | Líder de mercado, suporte completo multi-stack | [Docs](https://docs.launchdarkly.com/home) |
| [Split.io](https://www.split.io/) | Proprietário | Forte em analytics e experimentação | [Docs](https://help.split.io/hc/en-us) |
| [Flagsmith](https://www.flagsmith.com/) | Open Source | Self-hosted, boa documentação | [Docs](https://docs.flagsmith.com/) |
| [Unleash](https://www.getunleash.io/) | Open Source | Foco em enterprise, suporte a GitOps | [Docs](https://docs.getunleash.io/) |
| [GrowthBook](https://www.growthbook.io/) | Open Source | Analytics avançado, A/B testing | [Docs](https://docs.growthbook.io/) |
| [OpenFeature](https://openfeature.dev/) | Open Source (CNCF) | Especificação padronizada, provider-agnostic | [Docs](https://openfeature.dev/docs/reference/intro) |
| [Flipt](https://www.flipt.io/) | Open Source | Self-hosted, boa documentação, bem adotado pela comunidade, compatível com Open-feature | [Docs](https://docs.flipt.io/introduction) |

### Comparativo

| Característica | GrowthBook | OpenFeature | Flipt |
|---------------|------------|-------------|-------|
| K8s Native | Não | Sim | Não |
| YAMLs Declarativos | Não | Sim | Não |
| Self-hosted | Sim | Sim | Sim |
| GitOps | Não | Sim | Sim |
| Multi-tenant | Sim | Sim | Sim |
| A/B Testing | Sim | Via Provider | - |
| Compatível com Open Feature | - | Sim | Sim |

# Requisitos Essenciais

## 1. Requisitos Funcionais
- Consistência na distribuição de flags
- Rollouts graduais e controlados
- Sistema de targeting/segmentação
- Monitoramento e analytics
- UI para gerenciamento
- Suporte multi-linguagem (SDKs)

## 2. Requisitos Não-Funcionais
- Performance e baixa latência
- Fallback seguro (offline)
- Cache (eficiência e invalidação)
- Auditoria de mudanças

## 3. Requisitos Cloud Native
- Integração nativa com Kubernetes
- Suporte a GitOps
- Configuração declarativa (YAMLs)
- Métricas Otel/Prometheus
- Observabilidade (logs, tracing, audit)

## 4. Requisitos Técnicos
- Segurança
- Performance
- Escalabilidade
- Alta Disponibilidade
- Análise de Risco
- Custo

## 5. SDKs e Integrações



**Suporte Multi-Stack**
- Frontend: Angular
- Backend: Java, C#, Node.js, Go, Python
- Mobile: Ionic



| Solução | Suporte Multi-Stack | Integrações |
<!-- TODO:  -->


## Análise de Requisitos Detalhada

### 1. Componentes Essenciais de um Sistema de Feature Flags

#### Core Features
- **Gestão de Flags**
  - Tipos flexíveis (boolean, number, string, JSON)
  - Estados por ambiente (dev/stg/prod)
  - Regras de override
  - Targeting e segmentação

#### Estratégias de Deploy
- **Rollout Gradual**
  - Liberação progressiva baseada em tempo
  - Controle por parâmetros customizados
- **Canary Release**
  - Percentual de usuários
  - Monitoramento de métricas
- **Testes Beta**
  - Beta fechado (lista de usuários)
  - Beta aberto (opt-in)

<!-- Estudar sobre: -->
<!-- - **Dark Launch**
  - Integração sem exposição
  - Testes de carga reais -->

#### Experimentação
- **A/B Testing**
  - Segmentação por critérios
    - Localização
    - Dispositivo
    - Metadados customizados
  - Análise de resultados
  - Métricas de conversão

#### Aspectos Técnicos
- Hash determinístico
- Cache eficiente
- Fallback offline
- Alta disponibilidade
- Baixa latência

### 2. Análise de Mercado

#### Players Principais
1. **Soluções Enterprise (Proprietárias)**
   - LaunchDarkly: Líder de mercado, recursos enterprise
   - Split.io: Foco em analytics e experimentação
   - Optimizely: Especialista em A/B testing

2. **Soluções Open Source**
   - Unleash: Foco enterprise, suporte comercial
   - GrowthBook: A/B testing avançado
   - OpenFeature: Especificação CNCF
   - Flagsmith: Self-hosted completo
   - PostHog: Analytics + feature flags
   - Flipt: Simplicidade e performance
   - FeatBit: UI moderna, foco em equipes

### 3. Requisitos Específicos TOTVS

#### Requisitos Técnicos
1. **Suporte Multi-Stack**
   - Frontend: Angular
   - Backend: Java, C#, Node.js, Go, Python
   - Mobile: Ionic

2. **Arquitetura**
   - Multi-tenant
   - Isolamento por serviço
   - Alta disponibilidade (analisar)
   - Escalabilidade horizontal (analisar)

3. **Integração**
   - SDKs oficiais
   - OAuth/SSO
   - K8S
   - GitOps
   - YAMLs declarativos
   - Prometheus


### 4. Considerações Adicionais TOTVS

#### Integração com Ecossistema
1. **DevOps**
   - CI/CD Pipeline
   - GitOps workflow
   - IaC (Infrastructure as Code)
   - Monitoramento centralizado

2. **Segurança**
   - Criptografia em trânsito e repouso
   - Backup e DR
   - Controle granular de acesso
   - Scanning de vulnerabilidades

3. **Observabilidade**
   - Métricas Prometheus
   - Logs centralizados
   - Tracing distribuído
   - Dashboards Grafana

#### Aspectos Culturais
1. **Capacitação**
   - Treinamento para times
   - Documentação clara
   - Exemplos práticos
   - Suporte em português

2. **Governança**
   - Políticas de uso
   - Best practices
   - Padrões de nomenclatura
   - Processos de aprovação

## Implementações de Referência

Este repositório contém exemplos práticos de implementação usando diferentes soluções:

1. **OpenFeature com Flagd**
   - Demonstração de feature flags usando OpenFeature Operator e Flagd Standalone
   - Implementação cloud-native com Kubernetes
   - Exemplo em Node.js com suporte a métricas Prometheus

Exemplo da arquitetura testada:

![OpenFeature com Flagd](./docs/images/architecture-comparison.drawio.png)


2. **GrowthBook**
   <!-- - Exemplo de A/B testing -->
   - Implementação self-hosted
   - Integração com MongoDB
   - Exemplo em Node.js

## Como Usar

## Conclusões e Recomendações

### Pontos Fortes do OpenFeature
- Especificação padronizada CNCF
- Evita vendor lock-in
- Excelente integração com Kubernetes
- Suporte a múltiplos providers
- Possui operator (flagd) para Kubernetes
- Métricas no padrão Open Telemetry

### Pontos Fortes do GrowthBook
- UI intuitiva
- Forte em A/B testing
- Boa documentação
- Opção self-hosted gratuita
- Setup inicial simples
