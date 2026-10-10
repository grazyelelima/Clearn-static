// ═══════════════════════════════════════════
// LIÇÕES — FUNDAMENTOS
// ═══════════════════════════════════════════

const LESSONS_FUNDAMENTOS = [

{group:'Fundamentos',icon:'📦',title:'Variáveis e Tipos',tag:'básico',
 desc:'int, float, char — dados alocados no stack de main()',
 code:`#include <stdio.h>

int main() {
    int   idade = 25;
    float peso  = 72.5;
    char  letra = 'A';
    int   dobro = idade * 2;

    printf("Idade: %d\\n", idade);
    printf("Peso:  %.1f\\n", peso);
    printf("Letra: %c\\n", letra);
    printf("Dobro: %d\\n", dobro);
    return 0;
}`,
 steps:(()=>{
   const fr=(vars)=>[{name:'main()',vars}];
   const S=[];
   S.push(step(4,'Alocamos 4 bytes para `idade` no stack e escrevemos 25.',
     fr({idade:{name:'idade',value:'25',hi:true}}),{},''));
   S.push(step(5,'`peso` é float (4 bytes). Guarda números com casas decimais.',
     fr({idade:{name:'idade',value:'25'},peso:{name:'peso',value:'72.5',hi:true}}),{},''));
   S.push(step(6,'`letra` é char (1 byte). Armazena o código ASCII 65 = \'A\'.',
     fr({idade:{name:'idade',value:'25'},peso:{name:'peso',value:'72.5'},letra:{name:'letra',value:"'A'",hi:true}}),{},''));
   S.push(step(7,'CPU calcula 25 × 2 = 50 e grava em `dobro`.',
     fr({idade:{name:'idade',value:'25'},peso:{name:'peso',value:'72.5'},letra:{name:'letra',value:"'A'"},dobro:{name:'dobro',value:'50',hi:true}}),{},''));
   const full=fr({idade:{name:'idade',value:'25'},peso:{name:'peso',value:'72.5'},letra:{name:'letra',value:"'A'"},dobro:{name:'dobro',value:'50'}});
   S.push(step(9,'printf lê `idade` (25) e imprime na tela.',full,{},'Idade: 25\n'));
   S.push(step(10,'printf lê `peso` (72.5) com 1 casa decimal.',full,{},'Peso:  72.5\n'));
   S.push(step(11,'printf converte ASCII 65 → caractere \'A\'.',full,{},'Letra: A\n'));
   S.push(step(12,'printf imprime `dobro` (50).',full,{},'Dobro: 50\n'));
   S.push(step(13,'return 0 — programa encerrado. Frame de main() destruído.',[],{},''));
   return S;
 })()
},

// 1 ── FOR LOOP,

{group:'Fundamentos',icon:'🔁',title:'Loop for',tag:'básico',
 desc:'Contador, condição e acumulador — iteração por iteração',
 code:`#include <stdio.h>

int main() {
    int i, soma = 0;

    for (i = 1; i <= 5; i++) {
        soma += i;
        printf("i=%d  soma=%d\\n", i, soma);
    }

    return 0;
}`,
 steps:(()=>{
   const fr=(i,s,hi)=>[{name:'main()',vars:{
     i:{name:'i',value:String(i),hi:hi==='i'},
     soma:{name:'soma',value:String(s),hi:hi==='soma'}
   }}];
   const S=[];
   S.push(step(4,'Declaramos i e soma. soma começa em 0.',fr(0,0,'soma'),{},''));
   let soma=0;
   for(let i=1;i<=5;i++){
     S.push(step(6,`Verificamos a condição: i=${i} ≤ 5? ✓ Sim, entramos no bloco.`,fr(i,soma,'i'),{},''));
     soma+=i;
     S.push(step(7,`soma += ${i}  →  ${soma-i} + ${i} = ${soma}`,fr(i,soma,'soma'),{},''));
     S.push(step(8,`printf imprime os valores atuais.`,fr(i,soma,null),{},`i=${i}  soma=${soma}\n`));
   }
   S.push(step(6,'Verificamos: i=6 ≤ 5? ✗ Não. O loop encerra aqui.',fr(6,soma,'i'),{},''));
   S.push(step(10,'return 0.',[],{},''));
   return S;
 })()
},

// 2 ── IF/ELSE  (com branch_state),

{group:'Fundamentos',icon:'🔀',title:'if / else',tag:'básico',branch:true,
 desc:'Apenas UM ramo é executado — veja quais condições passam e quais falham',
 branchDef:{
   type:'ifelse',
   // cada ramo: id, cond (texto), lineCond, lineBody
   branches:[
     {id:'A', cond:'nota >= 90', label:'Conceito A', lineCond:6,  lineBody:7 },
     {id:'B', cond:'nota >= 70', label:'Conceito B', lineCond:8,  lineBody:9 },
     {id:'C', cond:'else',       label:'Reprovado',  lineCond:10, lineBody:11},
   ]
 },
 code:`#include <stdio.h>

int main() {
    int nota = 75;

    if (nota >= 90) {
        printf("Conceito A\\n");
    } else if (nota >= 70) {
        printf("Conceito B\\n");
    } else {
        printf("Reprovado\\n");
    }

    printf("Nota final: %d\\n", nota);
    return 0;
}`,
 steps:(()=>{
   const fr=(hi)=>[{name:'main()',vars:{nota:{name:'nota',value:'75',hi:!!hi}}}];
   // branch_state: { testing:'A'|'B'|'C'|null, results:{A:'pass'|'fail'|'skip', ...}, exec:'A'|'B'|'C'|null }
   const bs=(testing,results,exec)=>({testing,results:results||{},exec:exec||null});
   return[
     step(4,'nota = 75 alocado no stack de main().',fr(true),{},'',null,null,bs(null,{})),
     step(6,'Avaliamos a 1ª condição: nota (75) ≥ 90?',fr(true),{},'',null,null,bs('A',{})),
     step(6,'75 ≥ 90? ✗ FALSO. Ramo A descartado. Testamos o próximo.',fr(false),{},'',null,null,bs(null,{A:'fail'})),
     step(8,'Avaliamos a 2ª condição: nota (75) ≥ 70?',fr(true),{},'',null,null,bs('B',{A:'fail'})),
     step(8,'75 ≥ 70? ✓ VERDADEIRO! Este ramo será executado.',fr(true),{},'',null,null,bs(null,{A:'fail',B:'pass'},'B')),
     step(9,'Executamos o bloco B. Ramo C nunca será testado.',fr(false),{},'Conceito B\n',null,null,bs(null,{A:'fail',B:'pass',C:'skip'},'B')),
     step(14,'Saímos do if/else. Continuamos o programa.',fr(false),{},'Nota final: 75\n',null,null,bs(null,{A:'fail',B:'pass',C:'skip'})),
     step(15,'return 0.',[],{},'',null,null,null),
   ];
 })()
},

// 2b ── SWITCH/CASE,

{group:'Fundamentos',icon:'🎛️',title:'switch / case',tag:'básico',branch:true,
 desc:'Compara uma variável com múltiplos casos — mais limpo que vários if/else',
 branchDef:{
   type:'switch',
   expr:'dia',
   branches:[
     {id:'1', cond:'case 1', label:'Segunda',  lineCond:7,  lineBody:8 },
     {id:'2', cond:'case 2', label:'Terça',    lineCond:9,  lineBody:10},
     {id:'3', cond:'case 3', label:'Quarta',   lineCond:11, lineBody:12},
     {id:'4', cond:'case 4', label:'Quinta',   lineCond:13, lineBody:14},
     {id:'5', cond:'case 5', label:'Sexta',    lineCond:15, lineBody:16},
     {id:'d', cond:'default',label:'Inválido', lineCond:17, lineBody:18},
   ]
 },
 code:`#include <stdio.h>

int main() {
    int dia = 3;

    switch (dia) {
        case 1: printf("Segunda\\n"); break;
        case 2: printf("Terca\\n");   break;
        case 3: printf("Quarta\\n");  break;
        case 4: printf("Quinta\\n");  break;
        case 5: printf("Sexta\\n");   break;
        default: printf("Invalido\\n");
    }

    printf("Dia: %d\\n", dia);
    return 0;
}`,
 steps:(()=>{
   const fr=(hi)=>[{name:'main()',vars:{dia:{name:'dia',value:'3',hi:!!hi}}}];
   const bs=(testing,results,exec)=>({testing,results:results||{},exec:exec||null});
   return[
     step(4, 'dia = 3 alocado no stack.',fr(true),{},'',null,null,bs(null,{})),
     step(6, 'switch avalia o valor de dia = 3. Vai comparar com cada case.',fr(true),{},'',null,null,bs(null,{})),
     step(7, 'Comparamos: dia (3) == 1? ✗ Não.',fr(false),{},'',null,null,bs('1',{})),
     step(9, 'Comparamos: dia (3) == 2? ✗ Não.',fr(false),{},'',null,null,bs('2',{'1':'fail'})),
     step(11,'Comparamos: dia (3) == 3? ✓ Sim! Encontramos o case correto.',fr(true),{},'',null,null,bs('3',{'1':'fail','2':'fail'})),
     step(12,'Executamos case 3. Os outros cases abaixo são pulados.',fr(false),{},'Quarta\n',null,null,bs(null,{'1':'fail','2':'fail','3':'pass','4':'skip','5':'skip','d':'skip'},'3')),
     step(12,'break encerra o switch. Sem break, cairia no próximo case (fallthrough).',fr(false),{},'',null,null,bs(null,{'1':'fail','2':'fail','3':'pass','4':'skip','5':'skip','d':'skip'})),
     step(19,'printf: Dia = 3.',fr(false),{},'Dia: 3\n',null,null,null),
     step(20,'return 0.',[],{},'',null,null,null),
   ];
 })()
},

// 3 ── ARRAYS,

{group:'Fundamentos',icon:'🔂',title:'Loop while',tag:'básico',
 desc:'Repete enquanto a condição for verdadeira — condição testada ANTES de executar',
 code:`#include <stdio.h>

int main() {
    int senha = 0;
    int tentativas = 0;

    while (senha != 1234) {
        tentativas++;
        printf("Tentativa %d: senha errada\\n", tentativas);

        if (tentativas == 1) senha = 9999;
        if (tentativas == 2) senha = 1111;
        if (tentativas == 3) senha = 1234;
    }

    printf("Acesso liberado em %d tentativas!\\n", tentativas);
    return 0;
}`,
 steps:(()=>{
   const S=[];
   const fr=(senha,tent,hi)=>[{name:'main()',vars:{
     senha:{name:'senha',value:String(senha),hi:hi==='senha'},
     tentativas:{name:'tentativas',value:String(tent),hi:hi==='tentativas'}
   }}];

   S.push(step(4,'senha=0 e tentativas=0 alocados no stack.',fr(0,0,'senha'),{},''));
   S.push(step(7,'Testamos: senha (0) != 1234? ✓ Verdadeiro. Entramos no while.',fr(0,0,'senha'),{},''));
   S.push(step(8,'tentativas++ → tentativas = 1.',fr(0,1,'tentativas'),{},''));
   S.push(step(9,'printf: tentativa 1.',fr(0,1,null),{},'Tentativa 1: senha errada\n'));
   S.push(step(11,'tentativas==1? ✓ senha = 9999.',fr(9999,1,'senha'),{},''));
   S.push(step(7,'Testamos: senha (9999) != 1234? ✓ Verdadeiro. Repetimos.',fr(9999,1,'senha'),{},''));
   S.push(step(8,'tentativas++ → tentativas = 2.',fr(9999,2,'tentativas'),{},''));
   S.push(step(9,'printf: tentativa 2.',fr(9999,2,null),{},'Tentativa 2: senha errada\n'));
   S.push(step(12,'tentativas==2? ✓ senha = 1111.',fr(1111,2,'senha'),{},''));
   S.push(step(7,'Testamos: senha (1111) != 1234? ✓ Verdadeiro. Repetimos.',fr(1111,2,'senha'),{},''));
   S.push(step(8,'tentativas++ → tentativas = 3.',fr(1111,3,'tentativas'),{},''));
   S.push(step(9,'printf: tentativa 3.',fr(1111,3,null),{},'Tentativa 3: senha errada\n'));
   S.push(step(13,'tentativas==3? ✓ senha = 1234.',fr(1234,3,'senha'),{},''));
   S.push(step(7,'Testamos: senha (1234) != 1234? ✗ FALSO! Saímos do while.',fr(1234,3,'senha'),{},''));
   S.push(step(16,'printf: acesso liberado em 3 tentativas.',fr(1234,3,null),{},'Acesso liberado em 3 tentativas!\n'));
   S.push(step(17,'return 0.',[],{},''));
   return S;
 })()
},

// 11 ── DO WHILE,

{group:'Fundamentos',icon:'🔃',title:'Loop do while',tag:'básico',
 desc:'Executa o bloco PRIMEIRO, testa a condição depois — garante ao menos uma execução',
 code:`#include <stdio.h>

int main() {
    int n = 1;
    int fatorial = 1;

    do {
        fatorial = fatorial * n;
        printf("%d! = %d\\n", n, fatorial);
        n++;
    } while (n <= 5);

    printf("Fim. Ultimo: %d! = %d\\n", n-1, fatorial);
    return 0;
}`,
 steps:(()=>{
   const S=[];
   const fr=(n,fat,hi)=>[{name:'main()',vars:{
     n:{name:'n',value:String(n),hi:hi==='n'},
     fatorial:{name:'fatorial',value:String(fat),hi:hi==='fat'}
   }}];

   S.push(step(4,'n=1 e fatorial=1 no stack. Diferente do while, o do while entra sem testar!',fr(1,1,'n'),{},''));
   S.push(step(7,'Entramos no bloco DO — sem verificar nada ainda.',fr(1,1,null),{},''));

   let fat=1;
   for(let n=1;n<=5;n++){
     fat=fat*n;
     S.push(step(8,`fatorial = ${fat/n} × ${n} = ${fat}.`,fr(n,fat,'fat'),{},''));
     S.push(step(9,`printf: ${n}! = ${fat}`,fr(n,fat,null),{},`${n}! = ${fat}\n`));
     S.push(step(10,`n++ → n = ${n+1}.`,fr(n+1,fat,'n'),{},''));
     if(n<5){
       S.push(step(11,`Testamos: n (${n+1}) ≤ 5? ✓ Verdadeiro. Repetimos o bloco.`,fr(n+1,fat,'n'),{},''));
     }
   }
   S.push(step(11,'Testamos: n (6) ≤ 5? ✗ Falso. Saímos do do while.',fr(6,120,'n'),{},''));
   S.push(step(13,'printf: fim.',fr(6,120,null),{},'Fim. Ultimo: 5! = 120\n'));
   S.push(step(14,'return 0.',[],{},''));
   return S;
 })()
},

// 12 ── OPERADOR TERNÁRIO,

{group:'Fundamentos',icon:'❓',title:'Operador Ternário',tag:'básico',ternary:true,
 desc:'Condicional em uma linha: condição ? valor_se_verdadeiro : valor_se_falso',
 ternDef:{expr:'idade >= 18', trueVal:'"adulto"', falseVal:'"menor"'},
 code:`#include <stdio.h>

int main() {
    int idade = 20;

    // condicao ? valor_true : valor_false
    char *status = (idade >= 18) ? "adulto" : "menor";

    printf("Idade: %d\\n", idade);
    printf("Status: %s\\n", status);

    int num = -15;
    int abs_num = (num >= 0) ? num : -num;
    printf("Absoluto de %d: %d\\n", num, abs_num);

    return 0;
}`,
 steps:(()=>{
   const S=[];
   const ts=(testing,result)=>({testing,trueVal:'"adulto"',falseVal:'"menor"',result:result===undefined?null:result});
   const fr=(vars)=>[{name:'main()',vars}];

   S.push(step(4,'idade = 20 alocado no stack.',
     fr({idade:{name:'idade',value:'20',hi:true}}),{},'',null,null,null,null,null));

   S.push(step(10,'Avaliamos a condição: idade (20) >= 18?',
     fr({idade:{name:'idade',value:'20'}}),{},'',null,null,null,
     ts('testing'),null));

   S.push(step(10,'20 >= 18? ✓ VERDADEIRO! Retorna "adulto" — valor da esquerda do ":".',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"',hi:true}}),{},'',null,null,null,
     ts('true','adulto'),null));

   S.push(step(12,'printf: Idade 20.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'}}),{},'Idade: 20\n',null,null,null,
     ts(null,'adulto'),null));

   S.push(step(13,'printf: Status adulto.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'}}),{},'Status: adulto\n',null,null,null,
     ts(null,'adulto'),null));

   S.push(step(15,'num = -15 alocado no stack.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15',hi:true}}),{},'',null,null,null,null,null));

   S.push(step(16,'Avaliamos: num (-15) >= 0?',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15'}}),{},'',null,null,null,
     {testing:'testing',trueVal:'num (−15)',falseVal:'−num (15)',result:null},null));

   S.push(step(16,'-15 >= 0? ✗ FALSO! Retorna -num = 15 — valor da direita do ":".',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15'},abs_num:{name:'abs_num',value:'15',hi:true}}),{},'',null,null,null,
     {testing:'false',trueVal:'num (−15)',falseVal:'−num (15)',result:15},null));

   S.push(step(17,'printf: absoluto de -15 é 15.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15'},abs_num:{name:'abs_num',value:'15'}}),{},'Absoluto de -15: 15\n',null,null,null,
     {testing:null,trueVal:'num (−15)',falseVal:'−num (15)',result:15},null));

   S.push(step(19,'return 0.',[],{},'',null,null,null,null,null));
   return S;
 })()
},

// 13 ── MATRIZ 2D,

];

if (typeof LESSONS !== "undefined") {
  LESSONS.push(...LESSONS_FUNDAMENTOS);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LESSONS_FUNDAMENTOS;
}
