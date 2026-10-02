# Proposal

## Why

Na listagem de “Meus agendamentos”, itens cancelados ainda aparecem com o mesmo visual de “Cancelamento disponível”, o que confunde o status real. Além disso, a confirmação de cancelamento usa `window.confirm` genérico e o toast de sucesso permanece na tela sem sumir sozinho.

## What Changes

- Substituir o `window.confirm` por um toast/modal de confirmação de cancelamento com layout próprio da área de agendamentos.
- Validar o `status` de cada item na listagem e aplicar visual distinto quando estiver `cancelado` (badge, tipografia/cores e ausência de ação de cancelar).
- Exibir o feedback “Agendamento cancelado com sucesso.” e removê-lo automaticamente após alguns segundos.
- Manter o fluxo de chamada à API de cancelamento e o recarregamento da lista após sucesso.

## Capabilities

### New Capabilities

- `meus-agendamentos`: comportamento observável da listagem de agendamentos do cliente, incluindo status visual, confirmação de cancelamento e feedback temporário de sucesso.

### Modified Capabilities

Nenhuma (as specs principais ainda não consolidam essa capacidade; o delta fica isolado neste change).

## Impact

Afeta `MeusAgendamentos.jsx`, componentes em `src/components/appointments/` (`AppointmentCard`, `AppointmentStatus`, eventualmente um toast/confirmação novos) e estilos em `App.css`. Sem mudanças de contrato de API além do uso já existente de `status` e `podeCancelar` na resposta de listagem/cancelamento.
