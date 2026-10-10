// ═══════════════════════════════════════════
// LIÇÕES — ORDENAÇÃO
// ═══════════════════════════════════════════

const LESSONS_ORDENACAO = [

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

// 8 ── SELECTION SORT,

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

// 9 ── INSERTION SORT,

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

// 10 ── WHILE,

];

if (typeof LESSONS !== "undefined") {
  LESSONS.push(...LESSONS_ORDENACAO);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LESSONS_ORDENACAO;
}
