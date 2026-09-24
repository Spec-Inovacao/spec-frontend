# Agenda

Fluxo do cliente para consultar serviços ativos, escolher data e horário, confirmar um agendamento, consultar seus agendamentos e cancelar quando permitido.

## Arquitetura

`React -> API Express -> PostgreSQL`

O React nunca acessa o banco diretamente. A API consulta `PSERVICOS`, `PCONFIGEXP`, `PAGENDAMENTOS` e `PBLOQAGENDA`, validando disponibilidade, conflitos e antecedência mínima de cancelamento no backend.

## Execução

1. Copie `.env.example` para `.env` e configure `DATABASE_URL` e o `CLIENT_ID` temporário de desenvolvimento.
2. Instale dependências com `npm install`.
3. Inicie a API com `npm run dev:api`.
4. Em outro terminal, inicie o frontend com `npm run dev`.

O Vite encaminha `/api` para `http://localhost:3001`. O `CLIENT_ID` fixo existe apenas enquanto a autenticação não está disponível e deve ser substituído por um usuário autenticado posteriormente.

Os nomes padrão das colunas estão em `.env.example` para acomodar o schema fornecido sem alterá-lo. Nenhuma tabela é criada ou modificada pela aplicação.

## Verificação

- `npm test`: testes de regras e endpoints com dependências falsificadas.
- `npm run lint`: lint do frontend e backend.
- `npm run build`: build de produção do frontend.
