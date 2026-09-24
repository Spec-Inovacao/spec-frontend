# Tasks

## 1. API e persistência

- [x] 1.1 Criar a conexão PostgreSQL e o repositório parametrizado para `PSERVICOS`, `PCONFIGEXP`, `PAGENDAMENTOS` e `PBLOQAGENDA`; verificar com teste que serviços inativos não são retornados e que valores do usuário ficam em parâmetros SQL.
- [x] 1.2 Criar rotas e controllers Express para serviços, disponibilidade, agendamentos, consulta do cliente e cancelamento; verificar os endpoints com testes HTTP.
- [x] 1.3 Validar no backend expediente, `DIASATENDIMENTO`, `TEMPOMIN`, bloqueios, agendamentos ativos, sobreposição e confirmação com status `agendado`; verificar os testes das regras críticas.
- [x] 1.4 Isolar o `CLIENT_ID` temporário em configuração de desenvolvimento; verificar que a API encaminha o cliente configurado sem acesso direto do React ao PostgreSQL.

## 2. Fluxo React do cliente

- [x] 2.1 Substituir o scaffold por componentes de agendamento e serviço de API HTTP; verificar que o frontend usa apenas endpoints `/api`.
- [x] 2.2 Implementar seleção de serviço, data e horário, revisão e confirmação; verificar que horários indisponíveis são desabilitados e que a confirmação usa o backend.
- [x] 2.3 Implementar “Meus agendamentos” e cancelamento condicionado à resposta da API; verificar cancelamento permitido e mensagem para prazo mínimo atingido.
- [x] 2.4 Adicionar estados de erro, carregamento, sucesso, foco visível e layout responsivo; verificar o build e lint do frontend.

## 3. Verificação

- [x] 3.1 Implementar testes para serviços ativos, expediente, agendamento ocupado, bloqueio, sobreposição, criação válida e cancelamento; verificar `npm test` com 12 testes passando.
- [x] 3.2 Executar `npm run lint` e `npm run build`; verificar que ambos terminam sem erros.
