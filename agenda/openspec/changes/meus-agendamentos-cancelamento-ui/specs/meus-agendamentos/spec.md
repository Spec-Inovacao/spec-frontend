# Spec Delta: meus-agendamentos

## Purpose

Permitir que o cliente acompanhe agendamentos com status visual correto, confirme cancelamentos com um fluxo claro e receba feedback temporário de sucesso.

## ADDED Requirements

### Requirement: Listagem distingue agendamentos cancelados

O sistema SHALL exibir cada agendamento com aparência e rótulo derivados do status retornado pela API, e SHALL tratar itens com status cancelado de forma visualmente distinta dos itens ativos.

#### Scenario: Agendamento ativo com cancelamento permitido

- **WHEN** a listagem inclui um agendamento cujo status não é cancelado e `podeCancelar` é verdadeiro
- **THEN** o sistema SHALL indicar que o cancelamento está disponível e SHALL oferecer a ação de cancelar

#### Scenario: Agendamento cancelado

- **WHEN** a listagem inclui um agendamento com status cancelado
- **THEN** o sistema SHALL exibir indicação explícita de cancelado, SHALL aplicar estilo visual distinto do item ativo e SHALL NOT oferecer a ação de cancelar

### Requirement: Cancelamento exige confirmação na interface

O sistema SHALL solicitar confirmação explícita no layout da área de agendamentos antes de chamar a API de cancelamento, e SHALL NOT depender apenas do diálogo nativo do navegador como única experiência de confirmação.

#### Scenario: Cliente inicia cancelamento

- **WHEN** o cliente aciona cancelar em um agendamento elegível
- **THEN** o sistema SHALL apresentar um toast ou painel de confirmação com ações de confirmar e desistir

#### Scenario: Cliente desiste

- **WHEN** o cliente desiste na confirmação
- **THEN** o sistema SHALL fechar a confirmação e SHALL NOT chamar a API de cancelamento

#### Scenario: Cliente confirma

- **WHEN** o cliente confirma o cancelamento
- **THEN** o sistema SHALL chamar a API de cancelamento e, em sucesso, atualizar a listagem

### Requirement: Feedback de sucesso é temporário

O sistema SHALL informar o sucesso do cancelamento e SHALL remover essa notificação automaticamente após um intervalo curto, sem exigir recarregar a página.

#### Scenario: Cancelamento bem-sucedido

- **WHEN** a API confirma o cancelamento
- **THEN** o sistema SHALL exibir “Agendamento cancelado com sucesso.” e SHALL ocultar essa mensagem após alguns segundos
