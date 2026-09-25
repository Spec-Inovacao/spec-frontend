# Proposal

## Why

O cliente precisa conseguir marcar um atendimento sem depender de troca manual de mensagens ou de uma agenda externa. Como o produto ainda está no scaffold inicial, este é o momento de estabelecer o fluxo principal de agendamento e suas regras de confirmação antes da implementação da interface.

## What Changes

- Criar uma jornada de agendamento orientada por etapas para o cliente.
- Permitir a seleção de serviço, profissional, data e horário disponíveis.
- Exibir um resumo revisável antes da confirmação.
- Confirmar o agendamento e apresentar os dados do atendimento ao cliente.
- Permitir voltar entre etapas sem perder as seleções válidas.
- Informar estados de carregamento, indisponibilidade e erro de forma compreensível.

## Capabilities

### New Capabilities

- `agendamento-cliente`: fluxo do cliente para consultar disponibilidade, escolher um horário e confirmar um agendamento.

### Modified Capabilities

Nenhuma.

## Impact

O principal impacto será em `src/App.jsx`, `src/App.css` e `src/index.css`, substituindo o scaffold do Vite por uma experiência de agendamento responsiva. A primeira versão usará estado local e dados de disponibilidade definidos no cliente; não há API ou dependência externa existente a preservar. A estrutura deve deixar a integração futura com persistência ou backend isolada do fluxo visual.
