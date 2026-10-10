// ═══════════════════════════════════════════
// LIÇÕES — AVANÇADO
// ═══════════════════════════════════════════

const LESSONS_AVANCADO = [

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

// 7 ── BUBBLE SORT,

];

if (typeof LESSONS !== "undefined") {
  LESSONS.push(...LESSONS_AVANCADO);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LESSONS_AVANCADO;
}
