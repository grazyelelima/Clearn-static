// ═══════════════════════════════════════════
// LIÇÕES — STRINGS
// ═══════════════════════════════════════════

const LESSONS_STRINGS = [

{group:'Strings',icon:'🔤',title:'Strings',tag:'básico',
 desc:'Vetor de caracteres (char[]), terminador \'\\0\' e contagem de vogais',
 code:`#include <stdio.h>

int main() {
    char str[7] = "Clearn";
    int i = 0, vogais = 0;

    while (str[i] != '\\0') {
        char c = str[i];
        if (c == 'e' || c == 'a') {
            vogais++;
        }
        printf("str[%d] = '%c'\\n", i, c);
        i++;
    }

    printf("Total: %d chars, %d vogais\\n", i, vogais);
    return 0;
}`,
 steps:(()=>{
   const S=[];
   const rawChars = ['C','l','e','a','r','n','\\0'];
   const fr = (ci, curr_c, v_count, hi_var) => {
     const vars={};
     rawChars.forEach((ch, idx)=>{
       vars['str'+idx] = { name: `str[${idx}]`, value: `'${ch}'`, hi: idx === ci };
     });
     if(ci !== null) vars.i = { name: 'i', value: String(ci), hi: hi_var === 'i' };
     vars.vogais = { name: 'vogais', value: String(v_count), hi: hi_var === 'vogais' };
     if(curr_c !== null) vars.c = { name: 'c', value: `'${curr_c}'`, hi: hi_var === 'c' };
     return [{ name: 'main()', vars }];
   };

   S.push(step(4, "str[7] criada no stack: 7 bytes com 'C','l','e','a','r','n' e o terminador '\\0'.",
     fr(null, null, 0, null), {}, ''));

   S.push(step(5, "Inicializamos os contadores i = 0 e vogais = 0.",
     fr(0, null, 0, null), {}, ''));

   let vCount = 0;
   const strChars = ['C','l','e','a','r','n'];

   for (let idx = 0; idx < strChars.length; idx++) {
     const ch = strChars[idx];
     S.push(step(7, `str[${idx}] ('${ch}') != '\\0'? ✓ VERDADEIRO! Caractere válido, entramos no laço.`,
       fr(idx, null, vCount, null), {}, ''));

     S.push(step(8, `Lemos str[${idx}] ('${ch}') e guardamos na variável c.`,
       fr(idx, ch, vCount, 'c'), {}, ''));

     const isVowel = (ch === 'e' || ch === 'a');
     if (isVowel) {
       S.push(step(9, `'${ch}' é vogal ('e' ou 'a')? ✓ VERDADEIRO!`,
         fr(idx, ch, vCount, null), {}, ''));
       vCount++;
       S.push(step(10, `Incrementamos vogais++ → agora temos ${vCount} vogal(is).`,
         fr(idx, ch, vCount, 'vogais'), {}, ''));
     } else {
       S.push(step(9, `'${ch}' é vogal ('e' ou 'a')? ✗ FALSO (consoante).`,
         fr(idx, ch, vCount, null), {}, ''));
     }

     S.push(step(12, `printf: exibe o caractere '${ch}' na posição str[${idx}].`,
       fr(idx, ch, vCount, null), {}, `str[${idx}] = '${ch}'\n`));

     S.push(step(13, `i++ → avança o índice para ${idx + 1}.`,
       fr(idx + 1, ch, vCount, 'i'), {}, ''));
   }

   S.push(step(7, "str[6] é '\\0'! str[6] != '\\0'? ✗ FALSO! O terminador nulo encerra a string.",
     fr(6, null, vCount, null), {}, ''));

   S.push(step(16, `printf final: 6 caracteres percorridos e ${vCount} vogais computadas.`,
     fr(6, null, vCount, null), {}, `Total: 6 chars, ${vCount} vogais\n`));

   S.push(step(17, "return 0. Programa finalizado com sucesso.", [], {}, ''));

   return S;
 })()
},

// 15 ── OPERAÇÃO SUBSTRING,

{group:'Strings',icon:'✂️',title:'Operação Substring',tag:'intermediário',
 desc:'Fatiamento de texto: cópia por deslocamento e fechamento seguro com \'\\0\'',
 code:`#include <stdio.h>

void sub(char *orig, char *dest, int ini, int tam) {
    int i = 0;
    while (i < tam && orig[ini + i] != '\\0') {
        dest[i] = orig[ini + i];
        i++;
    }
    dest[i] = '\\0';
}

int main() {
    char texto[7] = "Clearn";
    char parte[4];

    sub(texto, parte, 1, 3);
    printf("Sub: \\"%s\\"\\n", parte);

    return 0;
}`,
 steps:(()=>{
   const S=[];
   const textoChars = ['C','l','e','a','r','n','\\0'];
   let parteChars = ['?','?','?','?'];

   const frMain = (parteArr) => {
     const vars = {};
     textoChars.forEach((ch, idx) => {
       vars['texto' + idx] = { name: `texto[${idx}]`, value: `'${ch}'` };
     });
     parteArr.forEach((ch, idx) => {
       vars['parte' + idx] = { name: `parte[${idx}]`, value: ch === '?' ? '?' : `'${ch}'` };
     });
     return { name: 'main()', vars };
   };

   const frSub = (iVal, origIdx, destVal, hiVar) => {
     const vars = {
       orig: { name: 'orig', value: '&texto[0]' },
       dest: { name: 'dest', value: '&parte[0]' },
       ini:  { name: 'ini',  value: '1' },
       tam:  { name: 'tam',  value: '3' },
     };
     if (iVal !== null) vars.i = { name: 'i', value: String(iVal), hi: hiVar === 'i' };
     if (origIdx !== null) vars['orig[' + origIdx + ']'] = { name: `orig[1+${iVal}]`, value: `'${textoChars[origIdx]}'` };
     return { name: 'sub(texto, parte, 1, 3)', vars };
   };

   S.push(step(13, "texto[7] inicializado com \"Clearn\\0\" no frame de main().",
     [frMain(parteChars)], {}, ''));

   S.push(step(14, "parte[4] alocado no stack (buffer para receber 3 caracteres + '\\0').",
     [frMain(parteChars)], {}, ''));

   S.push(step(16, "Chamada sub(texto, parte, 1, 3). Um novo frame sub() é empilhado na Call Stack!",
     [frMain(parteChars), frSub(null, null, null, null)], {}, ''));

   S.push(step(4, "Dentro de sub: índice de cópia i = 0 inicializado.",
     [frMain(parteChars), frSub(0, null, null, 'i')], {}, ''));

   // i = 0 (copia texto[1] = 'l' para dest[0])
   S.push(step(5, "i (0) < tam (3) e orig[1+0] ('l') != '\\0'? ✓ VERDADEIRO! Entramos no laço.",
     [frMain(parteChars), frSub(0, 1, null, null)], {}, ''));

   parteChars[0] = 'l';
   S.push(step(6, "dest[0] = orig[1] ('l'). O caractere 'l' é copiado para parte[0]!",
     [frMain(parteChars), frSub(0, 1, 'l', null)], {}, ''));

   S.push(step(7, "i++ → avança i para 1.",
     [frMain(parteChars), frSub(1, null, null, 'i')], {}, ''));

   // i = 1 (copia texto[2] = 'e' para dest[1])
   S.push(step(5, "i (1) < tam (3) e orig[1+1] ('e') != '\\0'? ✓ VERDADEIRO!",
     [frMain(parteChars), frSub(1, 2, null, null)], {}, ''));

   parteChars[1] = 'e';
   S.push(step(6, "dest[1] = orig[2] ('e'). O caractere 'e' é copiado para parte[1]!",
     [frMain(parteChars), frSub(1, 2, 'e', null)], {}, ''));

   S.push(step(7, "i++ → avança i para 2.",
     [frMain(parteChars), frSub(2, null, null, 'i')], {}, ''));

   // i = 2 (copia texto[3] = 'a' para dest[2])
   S.push(step(5, "i (2) < tam (3) e orig[1+2] ('a') != '\\0'? ✓ VERDADEIRO!",
     [frMain(parteChars), frSub(2, 3, null, null)], {}, ''));

   parteChars[2] = 'a';
   S.push(step(6, "dest[2] = orig[3] ('a'). O caractere 'a' é copiado para parte[2]!",
     [frMain(parteChars), frSub(2, 3, 'a', null)], {}, ''));

   S.push(step(7, "i++ → avança i para 3.",
     [frMain(parteChars), frSub(3, null, null, 'i')], {}, ''));

   // fim do laço
   S.push(step(5, "i (3) < tam (3)? ✗ FALSO! Atingimos o tamanho pedido (3 caracteres).",
     [frMain(parteChars), frSub(3, null, null, null)], {}, ''));

   parteChars[3] = '\\0';
   S.push(step(9, "dest[3] = '\\0'! Ponto fundamental: fecha a substring com o terminador nulo.",
     [frMain(parteChars), frSub(3, null, '\\0', null)], {}, ''));

   S.push(step(10, "Fim da função sub(). O frame sub() é destruído da Call Stack e voltamos a main().",
     [frMain(parteChars)], {}, ''));

   S.push(step(17, "printf: exibe a substring fatiada \"lea\".",
     [frMain(parteChars)], {}, 'Sub: "lea"\n'));

   S.push(step(19, "return 0. Programa finalizado com sucesso.", [], {}, ''));

   return S;
 })()
},

// 16 ── INVERSÃO DE VETORES,

{group:'Strings',icon:'🔄',title:'Inversão de Vetores',tag:'intermediário',
 desc:'Inversão in-place de elementos usando dois índices (swap)',
 code:`#include <stdio.h>

int main() {
    int v[4] = {10, 20, 30, 40};
    int i = 0, j = 3, temp;

    while (i < j) {
        temp = v[i];
        v[i] = v[j];
        v[j] = temp;
        printf("Trocou v[%d] e v[%d]\\n", i, j);
        i++;
        j--;
    }

    printf("Fim: {%d, %d, %d, %d}\\n", v[0], v[1], v[2], v[3]);
    return 0;
}`,
 steps:(()=>{
   const S=[];
   let arr = [10, 20, 30, 40];

   const fr = (iVal, jVal, tempVal, hiIdx, hiVar) => {
     const vars = {};
     arr.forEach((val, idx) => {
       vars['v' + idx] = { name: `v[${idx}]`, value: String(val), hi: idx === hiIdx };
     });
     if (iVal !== null) vars.i = { name: 'i', value: String(iVal), hi: hiVar === 'i' };
     if (jVal !== null) vars.j = { name: 'j', value: String(jVal), hi: hiVar === 'j' };
     if (tempVal !== null) vars.temp = { name: 'temp', value: String(tempVal), hi: hiVar === 'temp' };
     return [{ name: 'main()', vars }];
   };

   S.push(step(4, "Vetor v[4] criado no stack com {10, 20, 30, 40}.",
     fr(null, null, null, null, null), {}, ''));

   S.push(step(5, "Inicializamos i = 0 (início) e j = 3 (fim). temp reservada.",
     fr(0, 3, '?', null, null), {}, ''));

   // Iteração 1: troca posições 0 e 3
   S.push(step(7, "i (0) < j (3)? ✓ VERDADEIRO! As pontas ainda não se cruzaram.",
     fr(0, 3, '?', null, null), {}, ''));

   S.push(step(8, "temp = v[0] (10). Guardamos o valor de v[0] em temp para não sobrescrever.",
     fr(0, 3, 10, 0, 'temp'), {}, ''));

   arr[0] = 40;
   S.push(step(9, "v[0] = v[3] (40). O valor da extremidade direita (40) vai para a esquerda.",
     fr(0, 3, 10, 0, null), {}, ''));

   arr[3] = 10;
   S.push(step(10, "v[3] = temp (10). O valor original guardado em temp vai para a direita.",
     fr(0, 3, 10, 3, null), {}, ''));

   S.push(step(11, "printf: exibe a primeira troca realizada.",
     fr(0, 3, 10, null, null), {}, 'Trocou v[0] e v[3]\n'));

   S.push(step(12, "i++ → avança o ponteiro esquerdo para 1.",
     fr(1, 3, 10, null, 'i'), {}, ''));

   S.push(step(13, "j-- → recua o ponteiro direito para 2.",
     fr(1, 2, 10, null, 'j'), {}, ''));

   // Iteração 2: troca posições 1 e 2
   S.push(step(7, "i (1) < j (2)? ✓ VERDADEIRO! Ainda há elementos centrais para inverter.",
     fr(1, 2, 10, null, null), {}, ''));

   S.push(step(8, "temp = v[1] (20). Salva o elemento central esquerdo em temp.",
     fr(1, 2, 20, 1, 'temp'), {}, ''));

   arr[1] = 30;
   S.push(step(9, "v[1] = v[2] (30). Copia v[2] para v[1].",
     fr(1, 2, 20, 1, null), {}, ''));

   arr[2] = 20;
   S.push(step(10, "v[2] = temp (20). Coloca temp em v[2]. Inversão completa!",
     fr(1, 2, 20, 2, null), {}, ''));

   S.push(step(11, "printf: exibe a segunda troca realizada.",
     fr(1, 2, 20, null, null), {}, 'Trocou v[1] e v[2]\n'));

   S.push(step(12, "i++ → avança i para 2.",
     fr(2, 2, 20, null, 'i'), {}, ''));

   S.push(step(13, "j-- → recua j para 1.",
     fr(2, 1, 20, null, 'j'), {}, ''));

   // Fim do laço
   S.push(step(7, "i (2) < j (1)? ✗ FALSO! Os índices se cruzaram (i >= j), encerramos o laço.",
     fr(2, 1, 20, null, null), {}, ''));

   S.push(step(16, "printf: exibe o vetor totalmente invertido {40, 30, 20, 10}.",
     fr(2, 1, 20, null, null), {}, 'Fim: {40, 30, 20, 10}\n'));

   S.push(step(17, "return 0. Programa finalizado com sucesso.", [], {}, ''));

   return S;
 })()
},

];

if (typeof LESSONS !== "undefined") {
  LESSONS.push(...LESSONS_STRINGS);
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = LESSONS_STRINGS;
}
