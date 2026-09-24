# Design

## Context

O projeto é um scaffold React + Vite sem funcionalidades de produto, APIs ou especificações existentes. A proposta define uma nova capacidade de agendamento; os requisitos observáveis estão em `specs/agendamento-cliente/spec.md`.

## Goals / Non-Goals

**Goals:**

- Transformar a tela inicial em uma jornada responsiva e orientada por etapas.
- Manter as seleções do cliente em um único estado de fluxo, com validação por etapa.
- Isolar a fonte local de serviços e horários para permitir substituição futura por uma API.
- Representar explicitamente estados de seleção, processamento, erro e confirmação.

**Non-Goals:**

- Persistir agendamentos em banco ou integrar autenticação.
- Criar uma área administrativa para profissionais.
- Implementar notificações, pagamentos ou cancelamento.
- Definir disponibilidade real fora dos dados locais da primeira versão.

## Decisions

- **Estado local centralizado no componente da jornada:** o escopo é uma única experiência sem rotas ou compartilhamento entre telas. Um estado de fluxo torna o avanço, retorno e resumo previsíveis; um gerenciador global seria complexidade sem benefício nesta etapa.
- **Dados de disponibilidade locais atrás de funções de consulta:** os dados iniciais serão estáticos, mas o acesso será separado da renderização. Isso preserva o contrato da interface quando a fonte for substituída por uma API; duplicar listas diretamente no JSX foi descartado por dificultar a validação e a manutenção.
- **Etapas explícitas com ações de avanço e retorno:** a interface exibirá progresso e manterá as escolhas ao voltar. Um formulário único sem etapas foi descartado porque mistura descoberta de disponibilidade, revisão e confirmação e torna os erros menos claros.
- **Confirmação simulada no cliente:** a confirmação terá um estado de processamento e uma resposta determinística para exercitar o contrato visual sem inventar uma API. A integração de persistência fica para uma mudança posterior.
- **CSS responsivo sem dependências de UI:** o projeto não possui biblioteca visual. O layout será construído com os estilos existentes substituídos por regras locais, priorizando controles estáveis, foco visível e leitura em telas pequenas.

## Risks / Trade-offs

- **[Risco] Os horários locais podem ficar desatualizados quando houver backend.** -> Mitigação: encapsular a consulta de disponibilidade e deixar o estado de confirmação preparado para erro e nova tentativa.
- **[Risco] Dados de demonstração podem sugerir disponibilidade garantida.** -> Mitigação: tratar a confirmação como operação sujeita a falha e comunicar claramente o resultado ao cliente.
- **[Risco] Muitas escolhas em uma tela pequena podem causar rolagem excessiva.** -> Mitigação: separar as etapas, limitar o conteúdo visível por etapa e testar os estados em larguras móveis.

## Migration Plan

Substituir o conteúdo do scaffold em `src/App.jsx`, `src/App.css` e `src/index.css`, mantendo o ponto de entrada Vite. Validar com lint e build. O rollback consiste em restaurar esses três arquivos ao scaffold anterior, sem migração de dados porque a primeira versão não persiste agendamentos.

## Open Questions

Nenhuma questão bloqueia a implementação desta versão local.
