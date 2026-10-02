# Tasks

## 1. Status visual na listagem

- [x] 1.1 Atualizar `AppointmentStatus` / `AppointmentCard` / formatters para tratar `status` cancelado com badge, texto e estilo distintos; verificar que itens cancelados não exibem ação de cancelar.
- [x] 1.2 Acrescentar classes CSS para card/badge cancelado sem alterar o layout global do cliente.

## 2. Confirmação e toast de sucesso

- [x] 2.1 Substituir `window.confirm` por confirmação no layout (toast/painel) com confirmar e desistir em `MeusAgendamentos`.
- [x] 2.2 Exibir “Agendamento cancelado com sucesso.” após sucesso da API e ocultar automaticamente após ~4s; verificar que desistir não chama a API.

## 3. Qualidade e entrega

- [ ] 3.1 Executar `npm run lint` e `npm test`; somente se passarem, criar o commit `fix(appointments): improve cancel confirmation and cancelled status UI`.
- [ ] 3.2 Fazer push da branch e abrir/atualizar a PR contra `main`, devolvendo a URL (ou reportar bloqueio de rede/auth).
