// ═══════════════════════════════════════════
// STEP BUILDER & ENGINE HELPERS
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
// REGISTRO CENTRAL DE LIÇÕES
// As lições são carregadas modularmente a partir de js/lessons/:
//  - fundamentos.js
//  - estrutura.js
//  - avancado.js
//  - ordenacao.js
//  - strings.js
// ═══════════════════════════════════════════
const LESSONS = [];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LESSONS, step, ss, rs, REC_NODES, REC_EDGES, buildRecSVG, updateRecSVG };
}