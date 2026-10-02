# Design

## Context

`MeusAgendamentos` lista itens via `listarAgendamentos`, cancela com `cancelarAgendamento` e hoje usa `window.confirm` plus um parágrafo de sucesso persistente. `AppointmentCard` decide cancelamento por `podeCancelar` e só exclui botão se `status === 'cancelado'`, mas o badge e o texto auxiliar ainda falam em “Cancelamento disponível/bloqueado”, o que mascara itens já cancelados.

## Goals / Non-Goals

**Goals:**
- Confirmação de cancelamento no layout do produto (toast/painel).
- Status visual baseado em `status` (cancelado vs ativo).
- Toast de sucesso auto-dismissível.

**Non-Goals:**
- Alterar endpoints ou payloads da API.
- Implementar autenticação de cliente (permanece `clienteId` fixo enquanto vigente).
- Redesign completo da página além do necessário para status e feedback.

## Decisions

- **Status visual a partir de `status`:** normalizar com comparação case-insensitive a `cancelado`. Badge e mensagem passam a refletir “Cancelado” / estilo dedicado; `podeCancelar` continua governando só itens ativos.
- **Confirmação inline/toast em vez de `window.confirm`:** componente leve na página (ou em `components/appointments/`) com confirmar/cancelar; só dispara a API após confirmar.
- **Sucesso com timeout (~4s):** `useEffect` limpa `success` após intervalo; limpar também ao iniciar novo cancelamento ou ao desmontar.
- **Estilo cancelado no card:** classe no `appointment-card` (opacidade/borda/badge neutro) sem redesenhar a lista inteira.

## Risks / Trade-offs

- **API pode variar casing/label de status** → normalizar string e cair para visual ativo se status for desconhecido, preservando `podeCancelar` para a ação.
- **Confirmação custom exige foco/a11y** → usar `role="dialog"` ou região `aria-live` e botões claros.

## Migration Plan

1. Ajustar componentes de card/status e a página.
2. Validar listagem com item cancelado e fluxo confirmar → sucesso some.
3. Commit convencional da fatia UI.

## Open Questions

Nenhuma bloqueante; intervalo padrão de 4 segundos para o toast de sucesso.
