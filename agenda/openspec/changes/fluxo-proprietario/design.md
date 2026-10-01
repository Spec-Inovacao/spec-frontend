# Design

## Context

O `App.jsx` controla as telas por estado, enquanto `Header` já expõe uma entrada administrativa desabilitada. O fluxo do cliente consome `agendaApi` e a API local por `VITE_API_URL`; ele deve continuar independente. Os componentes `Card`, `Button`, `Badge`, `StatusBadge` e `PageHeader`, bem como os tokens em `index.css`, já definem a base visual. Veja `proposal.md` para a motivação e `specs/gestao-agenda-proprietario/spec.md` para o contrato observável.

## Goals / Non-Goals

**Goals:**

- Acrescentar as três telas administrativas à navegação por estado existente, sem React Router e sem refatorar a jornada do cliente.
- Concentrar chamadas e normalização da API remota administrativa em uma fronteira exclusiva.
- Compor as telas com os componentes compartilhados e componentes de proprietário orientados por props, mantendo CSS específico e responsivo.

**Non-Goals:**

- Alterar a API local, `agendaApi`, `VITE_API_URL` ou dados do fluxo do cliente.
- Criar mocks, endpoints ou estados locais que simulem bloqueio de horário ou finalização de atendimento.
- Inferir campos de `AdminAgenda` e de `resumo` antes de observar respostas reais da API.

## Decisions

- **Navegação administrativa como novos valores de `view` no estado do `App`:** o botão do cabeçalho passa a navegar para a agenda e as páginas recebem callbacks para trocar de tela. Isso preserva a arquitetura observada; React Router foi descartado por ampliar o escopo e alterar a navegação atual.
- **Fronteira `ownerApi` separada com adaptadores:** `VITE_OWNER_API_URL` será a única base das rotas administrativas. O cliente fará requisições, distinguirá falhas de rede/CORS/configuração e exportará dados normalizados; páginas e componentes não usarão `fetch`. Adaptadores para agenda e resumo serão definidos somente depois da inspeção da resposta real, evitando propriedades inventadas. Reaproveitar `agendaApi` foi descartado para não misturar bases, contratos e falhas da API do cliente.
- **Páginas como orquestradoras e componentes de apresentação por props:** `AgendaProprietario`, `ConfiguracoesProprietario` e `AdicionarAgendamento` manterão carregamento, seleção e feedback; `OwnerAgendaCard`, `OwnerMetricCard`, `OwnerRulesCard`, `AvailabilitySettingsCard`, `DayToggle`, `AddAppointmentCard`, `TimeSlotCard` e `ApiUnavailableCard` receberão valores e callbacks. Dados internos estáticos foram descartados porque impedem o uso da API real e testes previsíveis.
- **Composição visual sobre `Card` e stylesheet isolado:** os componentes administrativos usarão `Card` como superfície e os tokens existentes, com seletores do proprietário em um CSS específico importado pelas páginas ou pela aplicação. Reescrever `App.css` ou criar duplicatas dos componentes UI foi descartado para reduzir risco ao cliente.
- **Ações não suportadas representadas por indisponibilidade explícita:** `ApiUnavailableCard` explica a dependência de backend e não oferece operação executável. Botões locais que aparentem bloquear ou finalizar foram descartados porque violariam o contrato remoto.

## Risks / Trade-offs

- **[Risco] Respostas reais de agenda e resumo divergirem do esperado ou não estarem acessíveis.** → Mitigação: inspecionar o payload antes dos adaptadores, mapear apenas campos observados e mostrar erro de configuração/API quando necessário.
- **[Risco] CORS da API remota bloquear requisições no navegador.** → Mitigação: detectar e comunicar a configuração necessária; não usar proxy improvisado ou tentativa de burlar CORS.
- **[Risco] A referência visual competir com o layout existente em telas pequenas.** → Mitigação: manter tokens e breakpoints existentes, acrescentar regras escopadas e comparar as três larguras exigidas antes de cada entrega visual.
- **[Risco] Estado administrativo crescer dentro de `App.jsx`.** → Mitigação: limitar `App` à seleção de página e manter estados de dados em cada página administrativa.

## Migration Plan

1. Adicionar a variável documentada `VITE_OWNER_API_URL` e o cliente administrativo sem alterar a configuração existente do cliente.
2. Publicar as telas e a entrada do proprietário em uma funcionalidade isolada; as rotas administrativas só são requisitadas depois do acesso à área.
3. Validar lint, testes, build e comparação visual em 1440 px, 768 px e 375 px antes de cada commit de funcionalidade.
4. Em rollback, remover a entrada e os arquivos do proprietário; nenhuma migração de dados ou mudança no backend local é necessária.

## Open Questions

- Os formatos de resposta de `AdminAgenda` e `AdminAgenda/resumo` serão registrados na implementação após a primeira chamada autorizada à API remota; essa inspeção não altera o contrato de integração já definido.
