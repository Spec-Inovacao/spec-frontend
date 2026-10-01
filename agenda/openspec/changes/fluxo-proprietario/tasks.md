# Tasks

## 1. Entrada e fundação visual do proprietário

- [ ] 1.1 Habilitar “Área do proprietário” no `Header` e acrescentar os estados de navegação e as três páginas em `App.jsx`, preservando todas as transições existentes do cliente; verificar navegando entre cliente, agenda, configurações e inclusão sem React Router.
- [ ] 1.2 Criar o stylesheet escopado do proprietário e os componentes de apresentação `OwnerAgendaCard`, `OwnerMetricCard`, `OwnerRulesCard`, `AvailabilitySettingsCard`, `DayToggle`, `AddAppointmentCard`, `TimeSlotCard` e `ApiUnavailableCard`, todos baseados em `Card` e recebendo conteúdo e callbacks por props; verificar por testes de renderização ou inspeção que não possuem dados estáticos internos.
- [ ] 1.3 Criar `ownerApi.js` com base exclusiva em `VITE_OWNER_API_URL`, tratamento explícito para URL ausente, rede e CORS, e documentar a variável em `.env.example`; verificar que `agendaApi` e `VITE_API_URL` permanecem inalterados.
- [ ] 1.4 Executar `npm run lint`, `npm test` e `npm run build`; somente se todos passarem, criar o commit convencional específico `feat(owner): add owner flow foundation` com os arquivos desta funcionalidade.

## 2. Agenda diária

- [ ] 2.1 Inspecionar e registrar as respostas reais de `GET /api/admin/AdminAgenda?data={date-time}` e `GET /api/admin/AdminAgenda/resumo?data={date-time}` antes de escrever adaptadores; verificar que os normalizadores usam apenas campos observados, sem propriedades inferidas.
- [ ] 2.2 Implementar na `AgendaProprietario` seletor de data, carregamento paralelo de agenda e resumo, normalização no `ownerApi` e composição de cards e métricas; verificar a consulta com a data selecionada e a apresentação dos dados normalizados.
- [ ] 2.3 Implementar estados de carregamento, vazio, erro de API/configuração e nova tentativa, mantendo o seletor de data utilizável; verificar cada estado com testes do cliente da API e da página.
- [ ] 2.4 Comparar a agenda com a referência em 1440 px, 768 px e 375 px e ajustar apenas o CSS administrativo para estrutura, espaçamentos, tipografia, bordas, indicadores e responsividade; registrar a validação visual.
- [ ] 2.5 Executar `npm run lint`, `npm test` e `npm run build`; somente se todos passarem, criar o commit convencional específico `feat(owner): add daily agenda dashboard` com os arquivos desta funcionalidade.

## 3. Configurações

- [ ] 3.1 Implementar em `ownerApi` `GET` e `PUT /api/admin/Configuracao` e o adaptador de `horainicio`, `horafim`, `cancelamentominhora` e `diasatendimento`; verificar os métodos com testes que validem método, payload e normalização.
- [ ] 3.2 Implementar `ConfiguracoesProprietario`, `AvailabilitySettingsCard` e `DayToggle` para carregar, editar e salvar expediente, dias de atendimento e antecedência de cancelamento, com feedback de sucesso e erro; verificar carregamento, alteração e salvamento bem-sucedido e recusado.
- [ ] 3.3 Comparar a tela de configurações com a referência em 1440 px, 768 px e 375 px e ajustar controles, colunas, alinhamentos e feedback somente no CSS administrativo; registrar a validação visual.
- [ ] 3.4 Executar `npm run lint`, `npm test` e `npm run build`; somente se todos passarem, criar o commit convencional específico `feat(owner): add availability settings` com os arquivos desta funcionalidade.

## 4. Adicionar agendamento

- [ ] 4.1 Implementar no `ownerApi` carregamento de `GET /api/Usuarios` e `GET /api/Servicos`, disponibilidade por serviço e data e criação em `POST /api/Agendamentos`; verificar com testes que a criação envia exclusivamente `{ clienteId, servicoId, dtInicio }`.
- [ ] 4.2 Implementar `AdicionarAgendamento`, `AddAppointmentCard` e `TimeSlotCard` para selecionar cliente, serviço, data e um horário retornado como disponível; verificar que componentes não fazem `fetch`, que horários não disponíveis não são selecionáveis e que os estados de carregamento e erro são claros.
- [ ] 4.3 Exibir sucesso apenas após resposta do `POST` e preservar as seleções quando a API rejeitar a criação; verificar ambos os caminhos com testes de página/cliente.
- [ ] 4.4 Comparar a tela de adição com a referência em 1440 px, 768 px e 375 px e ajustar apenas o CSS administrativo para cards, formulário, grade de horários, ações e responsividade; registrar a validação visual.
- [ ] 4.5 Executar `npm run lint`, `npm test` e `npm run build`; somente se todos passarem, criar o commit convencional específico `feat(owner): add manual appointment flow` com os arquivos desta funcionalidade.

## 5. Dependências indisponíveis

- [ ] 5.1 Posicionar `ApiUnavailableCard` nas áreas de bloqueio de horário e finalização de atendimento, explicando que cada ação depende de endpoint do backend e sem disponibilizar chamada, mock ou alteração de status local; verificar que nenhuma requisição é feita ao interagir com essas áreas.
- [ ] 5.2 Comparar os cards de indisponibilidade com a referência em 1440 px, 768 px e 375 px e confirmar legibilidade, foco e ausência de ações enganosas; registrar a validação visual.
- [ ] 5.3 Executar `npm run lint`, `npm test` e `npm run build`; somente se todos passarem, criar o commit convencional específico `feat(owner): document unavailable owner actions` com os arquivos desta funcionalidade.

## 6. Testes, lint, build e revisão visual responsiva

- [ ] 6.1 Completar testes de `ownerApi`, adaptadores, navegação administrativa, estados de erro/configuração e fluxos das três páginas; verificar que os cenários da especificação são cobertos sem regressão dos testes do cliente.
- [ ] 6.2 Revisar as três telas contra a referência em 1440 px, 768 px e 375 px, corrigindo discrepâncias de espaçamento, tipografia, alinhamento, cores, bordas e proporções sem reescrever o CSS global do cliente; registrar o resultado por tela.
- [ ] 6.3 Executar `npm run lint`, `npm test` e `npm run build`; somente se todos passarem, criar o commit convencional específico `test(owner): validate owner scheduling flow` com os arquivos de testes e revisão desta funcionalidade.
