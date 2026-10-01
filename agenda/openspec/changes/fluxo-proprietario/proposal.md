# Proposal

## Why

O proprietário não possui uma visão operacional da própria agenda nem meios para manter a disponibilidade ou registrar manualmente um atendimento. A entrada já está prevista no cabeçalho, e a API administrativa remota fornece contratos suficientes para entregar essas três jornadas sem alterar o fluxo existente do cliente.

## What Changes

- Habilitar “Área do proprietário” como entrada para páginas de agenda diária, configurações de disponibilidade e inclusão manual de agendamento, mantendo a navegação por estado atual e sem React Router.
- Exibir agenda e resumo diários obtidos de `AdminAgenda` e `AdminAgenda/resumo`, com seleção de data e estados de carregamento, vazio e erro.
- Permitir consultar e atualizar expediente, dias de atendimento e antecedência mínima de cancelamento pela configuração administrativa.
- Permitir carregar clientes e serviços, consultar disponibilidade e criar um agendamento com `clienteId`, `servicoId` e `dtInicio`.
- Isolar a API administrativa em `ownerApi.js`, usando `VITE_OWNER_API_URL`, e normalizar respostas antes de apresentá-las à interface.
- Exibir bloqueio de horário e finalização de atendimento como indisponíveis quando a API não expuser suporte, sem inventar endpoints ou comportamentos locais.
- Reproduzir a estrutura visual de referência em telas de 1440 px, 768 px e 375 px, reutilizando os componentes e tokens existentes.

## Capabilities

### New Capabilities

- `gestao-agenda-proprietario`: permite ao proprietário consultar a agenda diária, configurar disponibilidade e adicionar agendamentos usando apenas os contratos administrativos disponíveis.

### Modified Capabilities

Nenhuma.

## Impact

Afeta `src/App.jsx`, `src/components/layout/Header.jsx`, novas páginas e componentes em `src/pages/` e `src/components/owner/`, um stylesheet específico do proprietário e o novo cliente `src/services/ownerApi.js`. A integração usa exclusivamente `VITE_OWNER_API_URL`; `VITE_API_URL` e a API local do cliente permanecem inalterados. Não há novas dependências nem mudanças no backend local.
