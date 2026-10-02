# OpenSpec + entrega automática (commit / PR)

## Em uma frase
O OpenSpec planeja e guia a implementação; o agente no Cursor executa o código e, neste projeto, também **commita, faz push e abre a PR**.

## O que o time ganha
- Menos “implementei, mas esqueci de subir”
- Commits padronizados (Conventional Commits)
- PR com resumo e plano de teste
- Mesmo fluxo para todo mundo: propor → aplicar → entregar

## Fluxo (para explicar no slide)

1. **Propor** — `openspec propose` / “quero X”  
   Gera proposal, design, specs e tasks.
2. **Aplicar** — `openspec apply` / “implementa”  
   Agente implementa as tasks e marca o checklist.
3. **Entregar** — automático ao fechar as tasks (ou ao pedir “sobe”)  
   `commit` → `push` → `gh pr create` → link da PR.

```
Ideia → Specs/Tasks → Código → Commit → Push → Pull Request
```

## O que é automático vs o que continua humano

| Automático (agente) | Humano (time) |
| --- | --- |
| Implementar tasks do change | Validar requisito / produto |
| `lint` / `test` / `build` quando a task pedir | Revisar a PR |
| Commit convencional | Aprovar / mergear |
| Push + abrir PR | Resolver auth/rede (ex.: VPN/Zscaler) |

## O que o OpenSpec **não** é
- Não é CI sozinho (GitHub Actions continua aparte)
- Não mergeia na `main` sem revisão
- Não substitui o backend nem corrige API remota sozinho

## Onde está configurado neste repo
- `agenda/openspec/config.yaml` — contexto do projeto + orientação de apply/archive
- `.cursor/rules/openspec-git-delivery.mdc` — regra do Cursor para commit/push/PR no fluxo OpenSpec

## Frase pronta para a apresentação
> “Com OpenSpec, a IA deixa de só gerar código solto: ela segue a spec, implementa as tasks e já entrega a mudança em uma Pull Request pronta para revisão.”
