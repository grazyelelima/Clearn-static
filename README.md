# CLearn — Visualizador Interativo de C

Ferramenta educacional para visualização passo a passo da execução de código C. Desenvolvida com apoio de IA como parte da **Bolsa BIA**, com foco na redução do esforço cognitivo no aprendizado de programação para iniciantes no ensino superior.

A proposta une o melhor do **VisualGo** (animações de algoritmos) com o **Python Tutor** (execução passo a passo com call stack visível), focado inteiramente em C e nos princípios da **Educação 5.0**.

---

## O que oferece

- **Call Stack** — frames de função empilhando e desempilhando em tempo real
- **Memória** — variáveis surgindo, sendo modificadas e destruídas a cada passo
- **Fluxo condicional** — diagrama visual de if/else e switch/case mostrando quais ramos foram e não foram executados
- **Operador Ternário** — visualização das três partes: condição, valor verdadeiro e valor falso
- **Matrizes 2D** — grade visual com destaque de linha, coluna e célula atual
- **Ordenação animada** — barras coloridas para Bubble, Selection e Insertion Sort
- **Árvore de recursão** — nós acendendo e apagando conforme as chamadas empilham e retornam
- **Terminal de saída** — o printf aparece passo a passo, sincronizado com a execução

---

## Lições

| Grupo | Lições |
|-------|--------|
| Fundamentos | Variáveis e Tipos, Loop for, Loop while, Loop do while, if/else, switch/case, Operador Ternário |
| Estruturas | Arrays, Matrizes 2D, Ponteiros, Funções |
| Avançado | Recursão — Fatorial |
| Ordenação | Bubble Sort, Selection Sort, Insertion Sort |
| Strings | Strings, Operação Substring, Inversão de Vetores |

---

## Estrutura Modular das Lições (`js/lessons/`)

Para facilitar a manutenção e escalabilidade pedagógica, as lições são organizadas em 5 arquivos modulares:
- `js/lessons/fundamentos.js` — Variáveis e tipos, laços (`for`, `while`, `do while`), condicionais (`if/else`, `switch/case`) e operador ternário.
- `js/lessons/estrutura.js` — Arrays, ponteiros, funções e matrizes 2D.
- `js/lessons/avancado.js` — Recursão com visualização dinâmica de call stack e árvore SVG.
- `js/lessons/ordenacao.js` — Algoritmos de ordenação (*Bubble*, *Selection* e *Insertion Sort*).
- `js/lessons/strings.js` — Fundamentos de `char[]`, terminador `\0`, operação de substring e inversão de vetores.

---

## Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| HTML5 | Estrutura da interface |
| CSS3 | Visual, animações e tema escuro |
| JavaScript | Motor de animação e lógica das lições |
| SVG | Árvore de recursão e diagrama de fluxo condicional |
| Google Fonts | JetBrains Mono (código) + Inter (interface) |

Sem backend. Sem banco de dados. Sem dependências externas.
