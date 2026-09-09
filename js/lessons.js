// ═══════════════════════════════════════════
// STEP BUILDER
// ═══════════════════════════════════════════
function step(line,desc,frames,mem,output,sort_state,rec_state,branch_state,tern_state,mat_state){
  return{line,desc,
    frames:JSON.parse(JSON.stringify(frames||[])),
    mem:JSON.parse(JSON.stringify(mem||{})),
    output:output||'',
    sort_state:sort_state?JSON.parse(JSON.stringify(sort_state)):null,
    rec_state:rec_state?JSON.parse(JSON.stringify(rec_state)):null,
    branch_state:branch_state?JSON.parse(JSON.stringify(branch_state)):null,
    tern_state:tern_state?JSON.parse(JSON.stringify(tern_state)):null,
    mat_state:mat_state?JSON.parse(JSON.stringify(mat_state)):null,
  };
}
function ss(array,comparing,swapping,sorted){
  return{array:[...array],comparing:comparing||null,swapping:!!swapping,sorted_indices:sorted||[]};
}
// rec_state: { active:n, returned:{n:val,...}, base:bool }
function rs(active,returned,base){
  return{active,returned:returned||{},base:!!base};
}

// ═══════════════════════════════════════════
// RECURSION TREE LAYOUT  fat(5)
// Fixed positions for fat(5)→fat(4)→fat(3)→fat(2)→fat(1)
// ═══════════════════════════════════════════
// Nodes: n=5,4,3,2,1  laid out diagonally (linear recursion = single chain)
const REC_NODES = [
  {n:5, x:50,  y:30},
  {n:4, x:130, y:75},
  {n:3, x:210, y:120},
  {n:2, x:290, y:165},
  {n:1, x:370, y:210},
// 12 ── OPERADOR TERNÁRIO
{group:'Fundamentos',icon:'❓',title:'Operador Ternário',tag:'básico',ternary:true,
 desc:'Condicional em uma linha: condição ? valor_se_verdadeiro : valor_se_falso',
 ternDef:{expr:'idade >= 18', trueVal:'"adulto"', falseVal:'"menor"', var:'status'},
 code:`#include <stdio.h>

int main() {
    int idade = 20;

    // operador ternário:
    // variavel = (condição) ? valor_true : valor_false;
    char *status = (idade >= 18) ? "adulto" : "menor";

    printf("Idade: %d\n", idade);
    printf("Status: %s\n", status);

    // outro exemplo: valor absoluto
    int num = -15;
    int abs_num = (num >= 0) ? num : -num;
    printf("Absoluto de %d: %d\n", num, abs_num);

    return 0;
}`,
 steps:(()=>{
   const S=[];
   const ts=(tst,tv,fv,res)=>({testing:tst,trueVal:tv,falseVal:fv,result:res});
   const fr=(vars)=>[{name:'main()',vars}];

   S.push(step(4,'idade = 20 alocado no stack.',
     fr({idade:{name:'idade',value:'20',hi:true}}),{},'',null,null,null,null));

   S.push(step(8,'Avaliamos a condição do ternário: idade (20) >= 18?',
     fr({idade:{name:'idade',value:'20'}}),{},'',null,null,null,
     ts('testing','adulto','menor',null)));

   S.push(step(8,'20 >= 18? ✓ VERDADEIRO! O operador retorna o valor da ESQUERDA do ":" — "adulto".',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"',hi:true}}),{},'',null,null,null,
     ts('true','adulto','menor','adulto')));

   S.push(step(10,'printf: idade = 20.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'}}),{},'Idade: 20\n',null,null,null,
     ts(null,'adulto','menor','adulto')));

   S.push(step(11,'printf: status = adulto.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'}}),{},'Status: adulto\n',null,null,null,
     ts(null,'adulto','menor','adulto')));

   S.push(step(14,'num = -15 alocado no stack.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15',hi:true}}),{},'',null,null,null,null));

   S.push(step(15,'Avaliamos: num (-15) >= 0?',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15'}}),{},'',null,null,null,
     ts('testing','num (−15)','−num (15)',null)));

   S.push(step(15,'-15 >= 0? ✗ FALSO! O operador retorna o valor da DIREITA do ":" — -num = 15.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15'},abs_num:{name:'abs_num',value:'15',hi:true}}),{},'',null,null,null,
     ts('false','num (−15)','−num (15)',15)));

   S.push(step(16,'printf: absoluto de -15 é 15.',
     fr({idade:{name:'idade',value:'20'},status:{name:'status',value:'"adulto"'},num:{name:'num',value:'-15'},abs_num:{name:'abs_num',value:'15'}}),{},'Absoluto de -15: 15\n',null,null,null,
     ts(null,'num (−15)','−num (15)',15)));

   S.push(step(18,'return 0. Programa encerrado.',[],{},'',null,null,null,null));
   return S;
 })()
},

// 13 ── MATRIZ 2D
{group:'Estruturas',icon:'🔲',title:'Matrizes 2D',tag:'intermediário',matrix:true,
 desc:'Tabela de linhas e colunas — acesso por mat[linha][coluna]',
 matDef:{rows:3,cols:3},
 code:`#include <stdio.h>

int main() {
    int mat[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    int i, j, soma = 0;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            soma += mat[i][j];
            printf("mat[%d][%d] = %d\n", i, j, mat[i][j]);
        }
    }

    printf("Soma total: %d\n", soma);
    return 0;
}`,
 steps:(()=>{
   const S=[];
   const mat = [[1,2,3],[4,5,6],[7,8,9]];
   
   // mat_state: {cells: [[...]], hi: {r,c} or null, done: [{r,c}]}
   const ms = (hi, done) => ({
     cells: mat.map(row=>[...row]),
     hi: hi||null,
     done: done||[]
   });

   const fr=(i,j,soma)=>{
     const vars={soma:{name:'soma',value:String(soma)}};
     if(i!=null) vars.i={name:'i',value:String(i)};
     if(j!=null) vars.j={name:'j',value:String(j)};
     return [{name:'main()',vars}];
   };

   S.push(step(4,'mat[3][3] criada no stack: 9 inteiros em memória contígua. Pense numa tabela 3×3!',
     fr(null,null,0),{},'',null,null,null,null,ms(null,[])));

   S.push(step(11,'Iniciamos os loops. i=0 (primeira linha).',
     fr(0,null,0),{},'',null,null,null,null,ms(null,[])));

   let soma=0, done=[];
   for(let i=0;i<3;i++){
     for(let j=0;j<3;j++){
       S.push(step(12,`Acessamos mat[${i}][${j}] = ${mat[i][j]}. Linha ${i}, coluna ${j}.`,
         fr(i,j,soma),{},'',null,null,null,null,ms({r:i,c:j},[...done])));
       soma+=mat[i][j];
       S.push(step(13,`soma += ${mat[i][j]} → soma = ${soma}.`,
         fr(i,j,soma),{},'',null,null,null,null,ms({r:i,c:j},[...done])));
       S.push(step(14,`printf: mat[${i}][${j}] = ${mat[i][j]}.`,
         fr(i,j,soma),{},`mat[${i}][${j}] = ${mat[i][j]}\n`,null,null,null,null,ms(null,[...done])));
       done.push({r:i,c:j});
     }
   }
   S.push(step(18,'printf: soma total = 45.',
     fr(null,null,45),{},'Soma total: 45\n',null,null,null,null,ms(null,done)));
   S.push(step(19,'return 0.',[],{},'',null,null,null,null,null));
   return S;
 })()
},

];
// Edges: parent→child
const REC_EDGES = [
  {from:5,to:4},
  {from:4,to:3},
  {from:3,to:2},
  {from:2,to:1},
];

function buildRecSVG(){
  const svg=document.getElementById('rec-svg');
  svg.innerHTML='';
  const ns='http://www.w3.org/2000/svg';

  // draw edges first (behind nodes)
  REC_EDGES.forEach(e=>{
    const a=REC_NODES.find(n=>n.n===e.from);
    const b=REC_NODES.find(n=>n.n===e.to);
    const line=document.createElementNS(ns,'line');
    line.setAttribute('x1',a.x); line.setAttribute('y1',a.y+22);
    line.setAttribute('x2',b.x); line.setAttribute('y2',b.y-22);
    line.setAttribute('class','redge');
    line.id='redge-'+e.from+'-'+e.to;
    svg.appendChild(line);

    // return label (hidden initially)
    const mid=document.createElementNS(ns,'text');
    mid.setAttribute('x',(a.x+b.x)/2+18);
    mid.setAttribute('y',(a.y+b.y)/2);
    mid.setAttribute('class','redge-label');
    mid.setAttribute('opacity','0');
    mid.id='retlbl-'+e.to; // label on the edge from child(e.to) back to parent
    svg.appendChild(mid);
  });

  // draw nodes
  REC_NODES.forEach(nd=>{
    const g=document.createElementNS(ns,'g');
    g.id='rnode-'+nd.n;

    const c=document.createElementNS(ns,'circle');
    c.setAttribute('cx',nd.x); c.setAttribute('cy',nd.y);
    c.setAttribute('r',22);
    c.setAttribute('class','rnode-circle pending');
    g.appendChild(c);

    const t=document.createElementNS(ns,'text');
    t.setAttribute('x',nd.x); t.setAttribute('y',nd.y);
    t.setAttribute('class','rnode-label pending');
    t.textContent='fat('+nd.n+')';
    g.appendChild(t);

    // return value badge (below node)
    const ret=document.createElementNS(ns,'text');
    ret.setAttribute('x',nd.x); ret.setAttribute('y',nd.y+36);
    ret.setAttribute('class','rnode-ret');
    ret.setAttribute('opacity','0');
    ret.id='rret-'+nd.n;
    g.appendChild(ret);

    svg.appendChild(g);
  });
}

function updateRecSVG(state){
  if(!state) return;
  const{active,returned,base}=state;

  REC_NODES.forEach(nd=>{
    const g=document.getElementById('rnode-'+nd.n);
    if(!g) return;
    const circle=g.querySelector('circle');
    const label=g.querySelector('text');

    let cls='rnode-circle ';
    let lcls='rnode-label ';
    if(returned[nd.n]!==undefined){
      cls+='done'; lcls+='done';
    } else if(nd.n===active && base){
      cls+='base'; lcls+='base';
    } else if(nd.n===active){
      cls+='active'; lcls+='active';
    } else if(nd.n < active || returned[nd.n]!==undefined){
      cls+='done'; lcls+='done'; // already visited
    } else {
      cls+='pending'; lcls+='pending';
    }
    circle.setAttribute('class',cls);
    label.setAttribute('class',lcls);

    // return badge
    const retEl=document.getElementById('rret-'+nd.n);
    if(retEl && returned[nd.n]!==undefined){
      retEl.textContent='= '+returned[nd.n];
      retEl.setAttribute('opacity','1');
    }
  });

  // edges
  REC_EDGES.forEach(e=>{
    const el=document.getElementById('redge-'+e.from+'-'+e.to);
    if(!el) return;
    if(returned[e.to]!==undefined){
      el.setAttribute('class','redge done');
      // show return label
      const lbl=document.getElementById('retlbl-'+e.to);
      if(lbl){
        lbl.textContent='↩'+returned[e.to];
        lbl.setAttribute('opacity','1');
      }
    } else if(e.to===active || e.from===active){
      el.setAttribute('class','redge active');
    } else {
      el.setAttribute('class','redge');
    }
  });
}

// ═══════════════════════════════════════════
// LESSONS
// ═══════════════════════════════════════════
const LESSONS=[

// 0 ── VARIÁVEIS
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

// 1 ── FOR LOOP
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

// 2 ── IF/ELSE  (com branch_state)
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

// 2b ── SWITCH/CASE
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

// 3 ── ARRAYS
{group:'Estruturas',icon:'📋',title:'Arrays (Vetores)',tag:'básico',
 desc:'5 inteiros contíguos no stack — cada um tem seu índice e endereço',
 code:`#include <stdio.h>

int main() {
    int v[5] = {10, 30, 20, 50, 40};
    int i, soma = 0;

    for (i = 0; i < 5; i++) {
        soma += v[i];
        printf("v[%d]=%d  soma=%d\\n", i, v[i], soma);
    }

    return 0;
}`,
 steps:(()=>{
   const arr=[10,30,20,50,40];
   const fr=(ci,s)=>{
     const vars={};
     arr.forEach((a,idx)=>vars['v'+idx]={name:`v[${idx}]`,value:String(a),hi:idx===ci});
     if(ci>=0) vars.i={name:'i',value:String(ci)};
     vars.soma={name:'soma',value:String(s)};
     return [{name:'main()',vars}];
   };
   const S=[];
   S.push(step(4,'20 bytes no stack: 5 inteiros em posições consecutivas de memória.',fr(-1,0),{},''));
   S.push(step(5,'i e soma declarados. soma = 0.',fr(0,0),{},''));
   let soma=0;
   for(let i=0;i<5;i++){
     S.push(step(7,`Loop: i=${i}. Acessamos v[${i}] = ${arr[i]}.`,fr(i,soma),{},''));
     soma+=arr[i];
     S.push(step(8,`soma += v[${i}]  →  soma = ${soma}`,fr(i,soma),{},''));
     S.push(step(9,`printf: v[${i}]=${arr[i]}, soma=${soma}.`,fr(i,soma),{},`v[${i}]=${arr[i]}  soma=${soma}\n`));
   }
   S.push(step(7,'i=5 < 5? ✗ Loop encerra.',fr(5,soma),{},''));
   S.push(step(11,'return 0.',[],{},''));
   return S;
 })()
},

// 4 ── PONTEIROS
{group:'Estruturas',icon:'👆',title:'Ponteiros',tag:'intermediário',
 desc:'p guarda o endereço de x — *p acessa e modifica x indiretamente',
 code:`#include <stdio.h>

int main() {
    int x = 42;
    int *p = &x;

    printf("x    = %d\\n",  x);
    printf("*p   = %d\\n", *p);
    printf("&x   = %p\\n", (void*)&x);

    *p = 99;

    printf("x agora = %d\\n", x);
    return 0;
}`,
 steps:(()=>{
   const fr=(xv,pv,hix,hip)=>[{name:'main()',vars:{
     x:{name:'x',value:String(xv),hi:hix},
     p:{name:'p →',value:pv===null?'—':String(pv),hi:hip}
   }}];
   return[
     step(4,'x=42 alocado em 0x1000.',fr(42,null,true,false),{},''),
     step(5,'p é um ponteiro: guarda o endereço de x (0x1000).',fr(42,'0x1000',false,true),{},''),
     step(7,'Lemos x diretamente pelo nome.',fr(42,'0x1000',true,false),{},'x    = 42\n'),
     step(8,'*p "desreferencia": vai ao endereço 0x1000 e lê o valor.',fr(42,'0x1000',false,true),{},'*p   = 42\n'),
     step(9,'&x retorna o número do endereço onde x vive.',fr(42,'0x1000',true,false),{},'&x   = 0x1000\n'),
     step(11,'*p = 99: escrevemos 99 em 0x1000 — sem tocar em x diretamente!',fr(99,'0x1000',true,true),{},''),
     step(13,'x agora é 99 — modificado pelo ponteiro.',fr(99,'0x1000',true,false),{},'x agora = 99\n'),
     step(14,'return 0.',[],{},''),
   ];
 })()
},

// 5 ── FUNÇÕES
{group:'Estruturas',icon:'⚙️',title:'Funções',tag:'intermediário',
 desc:'Cada chamada cria um frame novo na call stack',
 code:`#include <stdio.h>

int somar(int a, int b) {
    int r = a + b;
    return r;
}

int maior(int x, int y) {
    if (x > y) return x;
    return y;
}

int main() {
    int s = somar(3, 7);
    int m = maior(10, 25);
    printf("Soma:  %d\\n", s);
    printf("Maior: %d\\n", m);
    return 0;
}`,
 steps:(()=>{
   const mainBase=(s,m)=>[{name:'main()',vars:{s:{name:'s',value:s},m:{name:'m',value:m}}}];
   return[
     step(13,'main() chama somar(3,7). Um novo frame é empilhado acima de main().',
       [{name:'main()',vars:{s:{name:'s',value:'?'},m:{name:'m',value:'?'}}},
        {name:'somar(3,7)',vars:{a:{name:'a',value:'3',hi:true},b:{name:'b',value:'7'}}}],{},''),
     step(4,'Dentro de somar: r = a + b = 10.',
       [{name:'main()',vars:{s:{name:'s',value:'?'},m:{name:'m',value:'?'}}},
        {name:'somar(3,7)',vars:{a:{name:'a',value:'3'},b:{name:'b',value:'7'},r:{name:'r',value:'10',hi:true}}}],{},''),
     step(5,'return 10. Frame de somar() é destruído. s recebe 10.',
       mainBase('10','?'),{},''),
     step(14,'main() chama maior(10,25). Novo frame empilhado.',
       [{name:'main()',vars:{s:{name:'s',value:'10'},m:{name:'m',value:'?'}}},
        {name:'maior(10,25)',vars:{x:{name:'x',value:'10',hi:true},y:{name:'y',value:'25'}}}],{},''),
     step(8,'10 > 25? ✗ Falso. Caímos no return y.',
       [{name:'main()',vars:{s:{name:'s',value:'10'},m:{name:'m',value:'?'}}},
        {name:'maior(10,25)',vars:{x:{name:'x',value:'10'},y:{name:'y',value:'25',hi:true}}}],{},''),
     step(9,'return 25. Frame de maior() destruído. m recebe 25.',
       mainBase('10','25'),{},''),
     step(15,'printf: Soma=10.',mainBase('10','25'),{},'Soma:  10\n'),
     step(16,'printf: Maior=25.',mainBase('10','25'),{},'Maior: 25\n'),
     step(17,'return 0.',[],{},''),
   ];
 })()
},

// 6 ── RECURSÃO — fatorial DETALHADO
{group:'Avançado',icon:'🔄',title:'Recursão — Fatorial',tag:'avançado',rec:true,
 desc:'A stack cresce enquanto chamadas se acumulam, e encolhe ao retornar',
 code:`#include <stdio.h>

int fat(int n) {
    if (n <= 1)
        return 1;      // caso base
    return n * fat(n-1); // chamada recursiva
}

int main() {
    int r = fat(5);
    printf("5! = %d\\n", r);
    return 0;
}`,
 steps:(()=>{
   const S=[];
   // helper: build frames array bottom-up
   const mf=(mainR,...fats)=>{
     const frames=[{name:'main()',vars:{r:{name:'r',value:mainR}}}];
     fats.forEach(([n,hi,ret])=>{
       const f={name:`fat(${n})`,vars:{n:{name:'n',value:String(n),hi:!!hi}}};
       if(ret!==undefined) f.retVal=ret;
       if(ret!==undefined) f.returning=true;
       frames.push(f);
     });
     return frames;
   };

   // ── DESCIDA ──
   S.push(step(9,'main() chama fat(5). Primeiro frame recursivo empilhado! 📥',
     mf('?',[5,true]),{},'',null,rs(5,{})));

   S.push(step(4,'fat(5): n=5. Verificamos n ≤ 1? ✗ Não. Precisamos de fat(4).',
     mf('?',[5,false]),{},'',null,rs(5,{})));

   S.push(step(6,'fat(5) chama fat(4). Stack cresce! Agora temos 3 frames. 📥',
     mf('?',[5,false],[4,true]),{},'',null,rs(4,{})));

   S.push(step(4,'fat(4): n=4. n ≤ 1? ✗ Não. Precisa de fat(3).',
     mf('?',[5,false],[4,false]),{},'',null,rs(4,{})));

   S.push(step(6,'fat(4) chama fat(3). Stack com 4 frames. 📥',
     mf('?',[5,false],[4,false],[3,true]),{},'',null,rs(3,{})));

   S.push(step(4,'fat(3): n=3. n ≤ 1? ✗ Não. Precisa de fat(2).',
     mf('?',[5,false],[4,false],[3,false]),{},'',null,rs(3,{})));

   S.push(step(6,'fat(3) chama fat(2). Stack com 5 frames. 📥',
     mf('?',[5,false],[4,false],[3,false],[2,true]),{},'',null,rs(2,{})));

   S.push(step(4,'fat(2): n=2. n ≤ 1? ✗ Não. Precisa de fat(1).',
     mf('?',[5,false],[4,false],[3,false],[2,false]),{},'',null,rs(2,{})));

   S.push(step(6,'fat(2) chama fat(1). Stack no PICO: 6 frames empilhados! 📥',
     mf('?',[5,false],[4,false],[3,false],[2,false],[1,true]),{},'',null,rs(1,{})));

   // ── CASO BASE ──
   S.push(step(4,'fat(1): n=1. n ≤ 1? ✓ SIM! CASO BASE encontrado! Retorna 1 sem recursão. 🎯',
     mf('?',[5,false],[4,false],[3,false],[2,false],[1,true,undefined]),{},'',null,rs(1,{},true)));

   S.push(step(5,'fat(1) retorna 1. Frame destruído. Voltamos para fat(2). 📤',
     mf('?',[5,false],[4,false],[3,false],[2,true,undefined]),{},'',null,rs(2,{1:'1'})));

   // ── SUBIDA ──
   S.push(step(6,'fat(2) calcula: n × retorno = 2 × 1 = 2. Retorna 2. 📤',
     mf('?',[5,false],[4,false],[3,false],[2,false,'2×1=2']),{},'',null,rs(2,{1:'1'})));

   S.push(step(6,'fat(2) encerrado. Voltamos para fat(3). 📤',
     mf('?',[5,false],[4,false],[3,true,undefined]),{},'',null,rs(3,{1:'1',2:'2'})));

   S.push(step(6,'fat(3) calcula: 3 × 2 = 6. Retorna 6. 📤',
     mf('?',[5,false],[4,false],[3,false,'3×2=6']),{},'',null,rs(3,{1:'1',2:'2'})));

   S.push(step(6,'fat(3) encerrado. Voltamos para fat(4). 📤',
     mf('?',[5,false],[4,true,undefined]),{},'',null,rs(4,{1:'1',2:'2',3:'6'})));

   S.push(step(6,'fat(4) calcula: 4 × 6 = 24. Retorna 24. 📤',
     mf('?',[5,false],[4,false,'4×6=24']),{},'',null,rs(4,{1:'1',2:'2',3:'6'})));

   S.push(step(6,'fat(4) encerrado. Voltamos para fat(5). 📤',
     mf('?',[5,true,undefined]),{},'',null,rs(5,{1:'1',2:'2',3:'6',4:'24'})));

   S.push(step(6,'fat(5) calcula: 5 × 24 = 120. Retorna 120. Stack quase vazia! 📤',
     mf('?',[5,false,'5×24=120']),{},'',null,rs(5,{1:'1',2:'2',3:'6',4:'24'})));

   S.push(step(9,'Todos os frames recursivos destruídos. r = 120. 🎉',
     [{name:'main()',vars:{r:{name:'r',value:'120',hi:true}}}],{},'',null,
     rs(5,{1:'1',2:'2',3:'6',4:'24',5:'120'})));

   S.push(step(10,'printf: 5! = 120',
     [{name:'main()',vars:{r:{name:'r',value:'120'}}}],{},'5! = 120\n',null,
     rs(5,{1:'1',2:'2',3:'6',4:'24',5:'120'})));

   S.push(step(11,'return 0. main() encerra. Stack completamente vazia.',[],{},'',null,
     rs(5,{1:'1',2:'2',3:'6',4:'24',5:'120'})));

   return S;
 })()
},

// 7 ── BUBBLE SORT
{group:'Ordenação',icon:'🫧',title:'Bubble Sort',tag:'ordenação',sort:true,
 desc:'O maior elemento "borbulha" para o fim a cada passagem',
 code:`#include <stdio.h>

int main() {
    int v[5] = {64, 34, 25, 12, 22};
    int n=5, i, j, tmp;

    for (i = 0; i < n-1; i++) {
        for (j = 0; j < n-i-1; j++) {
            if (v[j] > v[j+1]) {
                tmp    = v[j];
                v[j]   = v[j+1];
                v[j+1] = tmp;
            }
        }
    }

    for (i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\\n");
    return 0;
}`,
 steps:(()=>{
   let arr=[64,34,25,12,22]; const fin=[];
   const fr=(a,i,j,tmp)=>{
     const vars={};
     a.forEach((x,idx)=>vars['v'+idx]={name:`v[${idx}]`,value:String(x)});
     vars.n={name:'n',value:'5'};
     if(i!=null) vars.i={name:'i',value:String(i)};
     if(j!=null) vars.j={name:'j',value:String(j)};
     if(tmp!=null) vars.tmp={name:'tmp',value:String(tmp)};
     return [{name:'main()',vars}];
   };
   const S=[];
   S.push(step(4,'Array inicial: [64, 34, 25, 12, 22]',fr([...arr],null,null,null),{},'',ss([...arr],null,false,[])));
   for(let i=0;i<4;i++){
     for(let j=0;j<4-i;j++){
       S.push(step(9,`Comparando v[${j}]=${arr[j]} com v[${j+1}]=${arr[j+1]}.`,fr([...arr],i,j,null),{},'',ss([...arr],[j,j+1],false,[...fin])));
       if(arr[j]>arr[j+1]){
         const tmp=arr[j];
         S.push(step(10,`${arr[j]} > ${arr[j+1]}: trocamos! tmp=${tmp}`,fr([...arr],i,j,tmp),{},'',ss([...arr],[j,j+1],true,[...fin])));
         [arr[j],arr[j+1]]=[arr[j+1],arr[j]];
         S.push(step(12,`Troca feita: v[${j}]=${arr[j]}, v[${j+1}]=${arr[j+1]}.`,fr([...arr],i,j,tmp),{},'',ss([...arr],null,false,[...fin])));
       }
     }
     fin.push(4-i);
     S.push(step(8,`Passagem ${i+1} concluída. v[${4-i}]=${arr[4-i]} está na posição correta! ✓`,fr([...arr],i+1,null,null),{},'',ss([...arr],null,false,[...fin])));
   }
   fin.push(0);
   S.push(step(18,'Array totalmente ordenado! Imprimindo resultado.',fr([...arr],null,null,null),{},arr.join(' ')+'\n',ss([...arr],null,false,fin)));
   return S;
 })()
},

// 8 ── SELECTION SORT
{group:'Ordenação',icon:'🎯',title:'Selection Sort',tag:'ordenação',sort:true,
 desc:'Procura o menor elemento restante e coloca na posição certa',
 code:`#include <stdio.h>

int main() {
    int v[5] = {64, 25, 12, 22, 11};
    int n=5, i, j, min, tmp;

    for (i = 0; i < n-1; i++) {
        min = i;
        for (j = i+1; j < n; j++) {
            if (v[j] < v[min])
                min = j;
        }
        tmp    = v[i];
        v[i]   = v[min];
        v[min] = tmp;
    }

    for (i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\\n");
    return 0;
}`,
 steps:(()=>{
   let arr=[64,25,12,22,11]; const fin=[];
   const fr=(a,i,j,mi,tmp)=>{
     const vars={};
     a.forEach((x,idx)=>vars['v'+idx]={name:`v[${idx}]`,value:String(x)});
     vars.n={name:'n',value:'5'};
     if(i!=null) vars.i={name:'i',value:String(i)};
     if(j!=null) vars.j={name:'j',value:String(j)};
     if(mi!=null) vars.min={name:'min',value:String(mi)};
     if(tmp!=null) vars.tmp={name:'tmp',value:String(tmp)};
     return [{name:'main()',vars}];
   };
   const S=[];
   S.push(step(4,'Array: [64,25,12,22,11]',fr([...arr],null,null,null,null),{},'',ss([...arr],null,false,[])));
   for(let i=0;i<4;i++){
     let mi=i;
     S.push(step(7,`Passagem ${i+1}: assumimos que o mínimo está em i=${i} (v[${i}]=${arr[i]}).`,fr([...arr],i,null,mi,null),{},'',ss([...arr],[i],false,[...fin])));
     for(let j=i+1;j<5;j++){
       S.push(step(9,`Comparamos v[${j}]=${arr[j]} com v[min=${mi}]=${arr[mi]}. ${arr[j]<arr[mi]?'✓ Novo mínimo!':'✗'}`,fr([...arr],i,j,mi,null),{},'',ss([...arr],[j,mi],false,[...fin])));
       if(arr[j]<arr[mi]){mi=j; S.push(step(10,`Novo mínimo: índice ${mi}, valor ${arr[mi]}.`,fr([...arr],i,j,mi,null),{},'',ss([...arr],[mi],false,[...fin])));}
     }
     const tmp=arr[i];
     S.push(step(12,`Trocamos v[${i}]=${arr[i]} com v[${mi}]=${arr[mi]}.`,fr([...arr],i,null,mi,tmp),{},'',ss([...arr],[i,mi],true,[...fin])));
     [arr[i],arr[mi]]=[arr[mi],arr[i]];
     fin.push(i);
     S.push(step(14,`v[${i}]=${arr[i]} na posição final! ✓`,fr([...arr],i+1,null,null,null),{},'',ss([...arr],null,false,[...fin])));
   }
   fin.push(4);
   S.push(step(17,'Ordenado!',fr([...arr],null,null,null,null),{},arr.join(' ')+'\n',ss([...arr],null,false,fin)));
   return S;
 })()
},

// 9 ── INSERTION SORT
{group:'Ordenação',icon:'🃏',title:'Insertion Sort',tag:'ordenação',sort:true,
 desc:'Insere cada elemento na posição correta — como ordenar cartas na mão',
 code:`#include <stdio.h>

int main() {
    int v[5] = {12, 11, 13, 5, 6};
    int n=5, i, j, key;

    for (i = 1; i < n; i++) {
        key = v[i];
        j = i - 1;

        while (j >= 0 && v[j] > key) {
            v[j+1] = v[j];
            j--;
        }
        v[j+1] = key;
    }

    for (i = 0; i < n; i++)
        printf("%d ", v[i]);
    printf("\\n");
    return 0;
}`,
 steps:(()=>{
   let arr=[12,11,13,5,6]; const fin=[0];
   const fr=(a,i,j,key)=>{
     const vars={};
     a.forEach((x,idx)=>vars['v'+idx]={name:`v[${idx}]`,value:String(x)});
     vars.n={name:'n',value:'5'};
     if(i!=null) vars.i={name:'i',value:String(i)};
     if(j!=null) vars.j={name:'j',value:String(j)};
     if(key!=null) vars.key={name:'key',value:String(key)};
     return [{name:'main()',vars}];
   };
   const S=[];
   S.push(step(4,'Array: [12,11,13,5,6]. v[0]=12 já está "ordenado" sozinho.',fr([...arr],null,null,null),{},'',ss([...arr],null,false,[...fin])));
   for(let i=1;i<5;i++){
     const key=arr[i];
     S.push(step(6,`i=${i}: pegamos key = v[${i}] = ${key}. Onde ele deve ser inserido?`,fr([...arr],i,i-1,key),{},'',ss([...arr],[i],false,[...fin])));
     let j=i-1;
     while(j>=0&&arr[j]>key){
       S.push(step(10,`v[${j}]=${arr[j]} > key=${key}: movemos v[${j}] uma posição para a direita.`,fr([...arr],i,j,key),{},'',ss([...arr],[j,j+1],true,[...fin])));
       arr[j+1]=arr[j]; j--;
       S.push(step(11,`j=${j}. Continuando...`,fr([...arr],i,j,key),{},'',ss([...arr],j>=0?[j+1]:null,false,[...fin])));
     }
     arr[j+1]=key; fin.push(i);
     S.push(step(13,`key=${key} inserido em v[${j+1}]. Posições 0..${i} agora ordenadas! ✓`,fr([...arr],i,j,key),{},'',ss([...arr],null,false,[...fin])));
   }
   S.push(step(16,'Array totalmente ordenado!',fr([...arr],null,null,null),{},arr.join(' ')+'\n',ss([...arr],null,false,[0,1,2,3,4])));
   return S;
 })()
},

// 10 ── WHILE
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

// 11 ── DO WHILE
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

// 12 ── OPERADOR TERNÁRIO
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

// 13 ── MATRIZ 2D
{group:'Estruturas',icon:'🔲',title:'Matrizes 2D',tag:'intermediário',matrix:true,
 desc:'Tabela de linhas e colunas — acesso por mat[linha][coluna]',
 matDef:{rows:3,cols:3},
 code:`#include <stdio.h>

int main() {
    int mat[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    int i, j, soma = 0;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            soma += mat[i][j];
            printf("mat[%d][%d] = %d\\n", i, j, mat[i][j]);
        }
    }

    printf("Soma total: %d\\n", soma);
    return 0;
}`,
 steps:(()=>{
   const mat=[[1,2,3],[4,5,6],[7,8,9]];
   const S=[];
   const ms=(hi,done)=>({cells:mat.map(r=>[...r]),hi:hi||null,done:done||[]});
   const fr=(i,j,soma)=>{
     const vars={soma:{name:'soma',value:String(soma)}};
     if(i!=null) vars.i={name:'i',value:String(i)};
     if(j!=null) vars.j={name:'j',value:String(j)};
     return [{name:'main()',vars}];
   };

   S.push(step(4,'mat[3][3] criada: 9 inteiros em memória contígua. Pense numa tabela 3×3!',
     fr(null,null,0),{},'',null,null,null,null,ms(null,[])));
   S.push(step(11,'Iniciamos: i=0 (primeira linha), j=0 (primeira coluna).',
     fr(0,0,0),{},'',null,null,null,null,ms(null,[])));

   let soma=0, done=[];
   for(let i=0;i<3;i++){
     for(let j=0;j<3;j++){
       S.push(step(13,`Linha ${i}, coluna ${j}: mat[${i}][${j}] = ${mat[i][j]}.`,
         fr(i,j,soma),{},'',null,null,null,null,ms({r:i,c:j},[...done])));
       soma+=mat[i][j];
       S.push(step(14,`soma += ${mat[i][j]} → soma = ${soma}.`,
         fr(i,j,soma),{},'',null,null,null,null,ms({r:i,c:j},[...done])));
       S.push(step(15,`printf: mat[${i}][${j}] = ${mat[i][j]}.`,
         fr(i,j,soma),{},`mat[${i}][${j}] = ${mat[i][j]}\n`,null,null,null,null,ms(null,[...done])));
       done.push({r:i,c:j});
     }
   }
   S.push(step(19,'printf: soma total = 45.',
     fr(null,null,45),{},'Soma total: 45\n',null,null,null,null,ms(null,done)));
   S.push(step(20,'return 0.',[],{},'',null,null,null,null,null));
   return S;
 })()
},

];