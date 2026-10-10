# Documentação de Mudanças e Refatoração

| Informação | Detalhe |
| :--- | :--- |
| **Branch de Desenvolvimento** | `feature/adicionar-novos-exemplos` |
| **Commit Base de Referência** | `02d6513` (*refatore(lessons): refatorando o arquivo lessons, e adicionado exemplos de Strings em c*) |
| **Projeto** | CLearn — Visualizador Interativo de C |
| **Foco** | Extensão de conteúdo pedagógico e modularização de código |

---

## 📌 Sumário Executivo

Nesta branch, foram realizadas duas melhorias principais na aplicação:
1. **Inclusão de Novos Exemplos Pedagógicos (Novo Grupo "Strings"):** Criação de 3 lições interativas passo a passo abordando fundamentos essenciais de manipulação de vetores e caracteres em C: strings com terminador nulo `\0`, operação de substring (fatiamento seguro de texto) e inversão *in-place* de vetores.
2. **Refatoração Arquitetural de Lições:** Divisão do arquivo monolítico `js/lessons.js` (com mais de 1.200 linhas) em **5 submódulos especializados** dentro da pasta `js/lessons/`, mantendo `js/lessons.js` apenas como agregador central e base de funções auxiliares (*helpers*).

---

## 🗂️ 1. Modularização da Pasta `js/lessons/`

### 1.1 Motivação
Anteriormente, todas as 15 lições da plataforma estavam concentradas em um único arquivo de mais de 1.200 linhas (`js/lessons.js`), o que dificultava:
* A navegação e localização de bugs em lições específicas.
* A adição de novas lições por múltiplos colaboradores sem conflitos de *merge*.
* A legibilidade do código-fonte.

### 1.2 Nova Estrutura de Arquivos
O código foi reorganizado na pasta `js/lessons/` dividida em 5 arquivos temáticos:

| Arquivo | Categoria (`group`) | Quantidade de Lições | Lições Contidas |
| :--- | :--- | :---: | :--- |
| `js/lessons/fundamentos.js` | `Fundamentos` | 7 | `Variáveis e Tipos`, `Loop for`, `Loop while`, `Loop do while`, `if / else`, `switch / case`, `Operador Ternário` |
| `js/lessons/estrutura.js` | `Estruturas` | 4 | `Arrays (Vetores)`, `Matrizes 2D`, `Ponteiros`, `Funções` |
| `js/lessons/avancado.js` | `Avançado` | 1 | `Recursão — Fatorial` (integrado com a árvore dinâmica em SVG) |
| `js/lessons/ordenacao.js` | `Ordenação` | 3 | `Bubble Sort`, `Selection Sort`, `Insertion Sort` |
| `js/lessons/strings.js` | `Strings` | 3 | `Strings`, `Operação Substring`, `Inversão de Vetores` |

### 1.3 Papel do `js/lessons.js`
O arquivo `js/lessons.js` foi mantido como ponto de entrada e biblioteca de suporte:
* Contém as funções de construção de passos (`step`, `ss`, `rs`).
* Contém a configuração de nós e arestas para renderização SVG da recursão (`REC_NODES`, `REC_EDGES`, `buildRecSVG`, `updateRecSVG`).
* Inicializa o array central `const LESSONS = [];` que recebe as lições de cada módulo.

---

## 🔤 2. Novas Lições Adicionadas (Módulo `strings.js`)

Foram implementadas três lições interativas que seguem o mesmo fluxo do visualizador:

### 2.1 Lição 1: `Strings` (Nível Básico)
* **Conceito pedagógico:** Demonstra que uma string em C é um vetor de caracteres (`char[]`) alocado de forma contígua na memória do *stack* e terminado obrigatoriamente pelo caractere nulo `'\0'`.
* **Visualização:** Acompanha o índice `i` percorrendo a cadeia `"Clearn"`, a contagem das vogais `'e'` e `'a'`, e a interrupção automática do laço quando `str[i] == '\0'`.

### 2.2 Lição 2: `Operação Substring` (Nível Intermediário)
* **Conceito pedagógico:** Implementa a extração manual de um trecho de texto através de uma função `sub(origem, destino, inicio, tamanho)`.
* **Visualização:**
  * Empilhamento do frame de função `sub()` na **Call Stack** acima do frame `main()`.
  * Cópia caractere a caractere utilizando deslocamento por ponteiro/índice (`orig[ini + i]`).
  * Inserção explícita do terminador `dest[i] = '\0'`.
  * Desempilhamento do frame ao retornar para `main()`.

### 2.3 Lição 3: `Inversão de Vetores` (Nível Intermediário)
* **Conceito pedagógico:** Inversão de elementos em um vetor de inteiros *in-place* (sem alocação de memória auxiliar) utilizando técnica de dois ponteiros/índices convergentes.
* **Visualização:**
  * Variáveis `i` (início) e `j` (fim) aproximando-se do centro.
  * Uso de uma variável auxiliar `temp` para realizar o algoritmo clássico de troca (*swap*).
  * Realce (*highlight*) dos elementos do vetor sendo alterados no *stack*.

---

## 🌐 3. Ajustes na Interface e Carregamento (`index.html`)

No arquivo `index.html`, foram incluídas as chamadas sequenciais para os 5 módulos antes de `js/engine.js`:

```html
<script src="js/lessons.js"></script>
<script src="js/lessons/fundamentos.js"></script>
<script src="js/lessons/estrutura.js"></script>
<script src="js/lessons/avancado.js"></script>
<script src="js/lessons/ordenacao.js"></script>
<script src="js/lessons/strings.js"></script>
<script src="js/engine.js"></script>
```

Dessa forma:
1. Os utilitários são carregados primeiro (`lessons.js`).
2. Os 5 arquivos registram suas lições no array `LESSONS`.
3. O motor `engine.js` lê todas as 18 lições e renderiza dinamicamente as seções no menu **📚 Lições**.

---

## 📖 4. Atualização da Documentação (`README.md`)

O arquivo principal `README.md` foi atualizado para:
* Incluir o grupo `Strings` na tabela geral de lições da ferramenta.
* Adicionar a seção detalhando a nova organização modular em `js/lessons/`.
