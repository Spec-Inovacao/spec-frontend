# Spec Delta

## Purpose

Permitir que o proprietário opere sua agenda diária, mantenha regras de disponibilidade e registre novos atendimentos com os contratos administrativos expostos pela API remota.

## ADDED Requirements

### Requirement: Proprietário acessa a área administrativa

O sistema SHALL disponibilizar a Área do proprietário pelo cabeçalho e SHALL permitir navegar entre agenda diária, configurações de disponibilidade e adição de agendamento sem remover ou alterar as jornadas do cliente.

#### Scenario: Entrada pela área do proprietário

- **WHEN** o proprietário seleciona “Área do proprietário”
- **THEN** o sistema SHALL exibir a agenda diária e fornecer navegação para as outras duas telas administrativas

### Requirement: Proprietário consulta agenda e resumo diários

O sistema SHALL consultar a agenda e o resumo para a data selecionada e SHALL apresentar somente informações confirmadas pelas respostas normalizadas da API.

#### Scenario: Agenda diária disponível

- **WHEN** a consulta da agenda e do resumo da data selecionada é concluída
- **THEN** o sistema SHALL exibir os atendimentos e os indicadores retornados, distinguindo visualmente itens e métricas

#### Scenario: Agenda sem atendimentos

- **WHEN** a consulta da agenda da data selecionada não retornar atendimentos
- **THEN** o sistema SHALL informar que não há atendimentos para a data mantendo o seletor de data disponível

#### Scenario: Falha na consulta da agenda

- **WHEN** a API da agenda ou do resumo falhar, inclusive por configuração ausente ou CORS
- **THEN** o sistema SHALL informar que a API administrativa está indisponível ou mal configurada e oferecer nova tentativa

### Requirement: Proprietário mantém configurações de disponibilidade

O sistema SHALL carregar e permitir salvar horário inicial, horário final, antecedência mínima de cancelamento e dias de atendimento conforme o contrato de configuração.

#### Scenario: Configuração carregada

- **WHEN** a configuração administrativa é obtida com sucesso
- **THEN** o sistema SHALL apresentar os valores recebidos em controles editáveis de expediente, antecedência e dias de atendimento

#### Scenario: Configuração salva

- **WHEN** o proprietário envia valores válidos de configuração
- **THEN** o sistema SHALL atualizar a configuração e informar o resultado da operação sem alterar os valores até a resposta da API

### Requirement: Proprietário adiciona agendamento manualmente

O sistema SHALL permitir selecionar cliente, serviço, data e horário disponível e SHALL criar o agendamento somente com o corpo `clienteId`, `servicoId` e `dtInicio`.

#### Scenario: Horários são consultados para o serviço e data

- **WHEN** o proprietário seleciona serviço e data
- **THEN** o sistema SHALL consultar a disponibilidade correspondente e permitir selecionar apenas um horário informado como disponível

#### Scenario: Agendamento criado

- **WHEN** o proprietário confirma cliente, serviço e horário válidos
- **THEN** o sistema SHALL enviar o corpo de criação previsto e informar o sucesso somente após a confirmação da API

#### Scenario: Criação recusada

- **WHEN** a API rejeita a criação do agendamento
- **THEN** o sistema SHALL apresentar o erro e preservar as seleções para correção ou nova tentativa

### Requirement: Ações sem suporte de API são transparentes

O sistema SHALL apresentar bloqueio de horário e finalização de atendimento como ações indisponíveis enquanto não existir endpoint remoto que as suporte.

#### Scenario: Proprietário encontra uma ação indisponível

- **WHEN** o proprietário visualiza bloqueio de horário ou finalização de atendimento
- **THEN** o sistema SHALL explicar que a ação depende de suporte do backend e SHALL impedir qualquer simulação local da operação

### Requirement: Área administrativa preserva a referência visual e responsividade

O sistema SHALL usar a identidade visual existente e SHALL reproduzir a estrutura de cabeçalho, navegação, cards claros, bordas sutis, destaques azuis, tipografia compacta e indicadores da referência em larguras de 1440 px, 768 px e 375 px.

#### Scenario: Tela administrativa em largura reduzida

- **WHEN** uma das telas administrativas é exibida em 768 px ou 375 px
- **THEN** o sistema SHALL reorganizar navegação, cards, controles e ações sem perda de conteúdo, sobreposição ou necessidade de rolagem horizontal
