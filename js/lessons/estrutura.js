// ═══════════════════════════════════════════
// LIÇÕES — ESTRUTURAS DE DADOS
// ═══════════════════════════════════════════

const LESSONS_ESTRUTURA = [

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

// 4 ── PONTEIROS,

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

// 5 ── FUNÇÕES,

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

// 6 ── RECURSÃO — fatorial DETALHADO,

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

// 14 ── STRINGS (TERMINADOR \0 E VOGAIS),

];

if (typeof LESSONS !== "undefined") {
  LESSONS.push(...LESSONS_ESTRUTURA);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LESSONS_ESTRUTURA;
}
