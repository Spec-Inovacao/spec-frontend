# Spec Delta

## Purpose

Oferecer ao cliente uma jornada clara e previsível para escolher um atendimento disponível e confirmar seu agendamento sem depender de contato manual.

## ADDED Requirements

### Requirement: Cliente pode selecionar os dados do atendimento

O sistema SHALL apresentar ao cliente as opções de serviço, profissional, data e horário disponíveis, permitindo avançar somente quando a seleção obrigatória da etapa atual estiver preenchida.

#### Scenario: Seleção válida libera a próxima etapa

- **WHEN** o cliente seleciona um serviço, um profissional, uma data e um horário disponível
- **THEN** o sistema SHALL preservar as escolhas e permitir o avanço para a revisão do agendamento

#### Scenario: Seleção incompleta bloqueia o avanço

- **WHEN** o cliente tenta avançar sem preencher uma seleção obrigatória da etapa atual
- **THEN** o sistema SHALL manter o cliente na etapa e indicar qual informação precisa ser escolhida

### Requirement: Sistema exibe somente horários disponíveis

O sistema SHALL diferenciar horários disponíveis de horários indisponíveis e SHALL impedir a seleção de um horário indisponível.

#### Scenario: Horário indisponível é apresentado como não selecionável

- **WHEN** um horário não possui disponibilidade para a combinação de serviço, profissional e data
- **THEN** o sistema SHALL exibi-lo como indisponível e SHALL rejeitar a tentativa de seleção

#### Scenario: Não há horários disponíveis

- **WHEN** não existem horários disponíveis para a combinação selecionada
- **THEN** o sistema SHALL informar que não há horários e SHALL orientar o cliente a alterar a data ou o profissional

### Requirement: Cliente pode revisar o agendamento antes da confirmação

O sistema SHALL exibir um resumo com serviço, profissional, data, horário e duração ou valor quando essas informações estiverem disponíveis, antes de confirmar o agendamento.

#### Scenario: Resumo corresponde às escolhas

- **WHEN** o cliente chega à etapa de revisão
- **THEN** o sistema SHALL mostrar os dados atualmente selecionados e oferecer uma ação para confirmar ou retornar à edição

#### Scenario: Cliente retorna para editar

- **WHEN** o cliente retorna da revisão para uma etapa anterior
- **THEN** o sistema SHALL manter as seleções válidas já feitas e permitir que o cliente as altere

### Requirement: Cliente pode confirmar o agendamento

O sistema SHALL confirmar o agendamento somente após uma ação explícita do cliente e SHALL apresentar uma confirmação com os dados do atendimento criado.

#### Scenario: Confirmação bem-sucedida

- **WHEN** o cliente confirma um resumo válido
- **THEN** o sistema SHALL exibir um estado de sucesso com serviço, profissional, data e horário do agendamento

#### Scenario: Falha ao confirmar

- **WHEN** ocorre uma falha ao confirmar o agendamento
- **THEN** o sistema SHALL informar que o agendamento não foi concluído, preservar o resumo e permitir uma nova tentativa ou alteração das escolhas

### Requirement: Jornada comunica o estado atual

O sistema SHALL indicar visualmente a etapa atual e SHALL comunicar estados de carregamento, erro e sucesso sem perder o contexto necessário para concluir ou corrigir o agendamento.

#### Scenario: Avanço está em processamento

- **WHEN** o sistema está processando uma consulta ou confirmação
- **THEN** o sistema SHALL indicar que a operação está em andamento e SHALL impedir ações duplicadas até receber o resultado
