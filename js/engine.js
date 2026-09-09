// ── MATRIX VISUALIZATION ────────────────────────────────
function renderMatrix(state){
  const sec = document.getElementById('lesson-matrix-section');
  if(!sec || !state) return;
  sec.classList.add('on');
  const {cells, hi, done} = state;
  const rows = cells.length, cols = cells[0].length;

  // Build col headers
  let colHdr = document.getElementById('mat-col-hdrs');
  let matBody = document.getElementById('mat-body');
  if(!colHdr || matBody.children.length === 0){
    // first render — build structure
    const wrap = document.getElementById('mat-body');
    wrap.innerHTML = '';
    // col headers
    const chRow = document.createElement('div');
    chRow.className = 'matrix-col-headers';
    cells[0].forEach((_,c)=>{
      const ch = document.createElement('div');
      ch.className = 'matrix-col-hdr';
      ch.textContent = `[${c}]`;
      chRow.appendChild(ch);
    });
    document.getElementById('mat-col-hdrs').innerHTML = '';
    document.getElementById('mat-col-hdrs').appendChild(chRow);

    cells.forEach((row,r)=>{
      const rowDiv = document.createElement('div');
      rowDiv.className = 'matrix-row';
      const rhdr = document.createElement('div');
      rhdr.className = 'matrix-row-hdr';
      rhdr.textContent = `[${r}]`;
      rowDiv.appendChild(rhdr);
      row.forEach((val,c)=>{
        const cell = document.createElement('div');
        cell.className = 'mcell-mat';
        cell.id = `mcel-${r}-${c}`;
        cell.innerHTML = `<div class="mval">${val}</div><div class="midx">[${r}][${c}]</div>`;
        rowDiv.appendChild(cell);
      });
      wrap.appendChild(rowDiv);
    });
  }

  // Update cell states
  cells.forEach((row,r)=>{
    row.forEach((val,c)=>{
      const el = document.getElementById(`mcel-${r}-${c}`);
      if(!el) return;
      el.querySelector('.mval').textContent = val;
      el.className = 'mcell-mat';
      if(hi && hi.r===r && hi.c===c) el.classList.add('hot');
      else if(done && done.find(d=>d.r===r&&d.c===c)) el.classList.add('done');
    });
  });
}

// ── TERNARY VISUALIZATION ────────────────────────────────
function renderTernary(state, def){
  const sec = document.getElementById('lesson-tern-section');
  if(!sec) return;
  if(!state){ sec.classList.remove('on'); return; }
  sec.classList.add('on');

  const {testing, trueVal, falseVal, result} = state;

  // Update expression display
  const exCond  = document.getElementById('tern-expr-cond');
  const exTrue  = document.getElementById('tern-expr-true');
  const exFalse = document.getElementById('tern-expr-false');
  if(exCond  && def) exCond.textContent  = def.expr;
  if(exTrue  && def) exTrue.textContent  = def.trueVal;
  if(exFalse && def) exFalse.textContent = def.falseVal;

  const condPart  = document.getElementById('tern-cond');
  const truePart  = document.getElementById('tern-true');
  const falsePart = document.getElementById('tern-false');
  const resPart   = document.getElementById('tern-result');

  if(!condPart) return;

  // condition box
  condPart.className = 'tern-part cond-part' + (testing==='testing' ? ' active' : '');
  document.getElementById('tern-cond-val').textContent = def ? def.expr : '—';

  // true branch
  const trueSkip = result !== null && result !== undefined && testing !== 'testing' && testing !== 'true';
  truePart.className  = 'tern-part true-part'  + (testing==='true'  ? ' active' : trueSkip  ? ' skip' : '');
  document.getElementById('tern-true-val').textContent  = def ? '✓  ' + def.trueVal  : '—';

  // false branch
  const falseSkip = result !== null && result !== undefined && testing !== 'testing' && testing !== 'false';
  falsePart.className = 'tern-part false-part' + (testing==='false' ? ' active' : falseSkip ? ' skip' : '');
  document.getElementById('tern-false-val').textContent = def ? '✗  ' + def.falseVal : '—';

  // result badge
  if(result !== null && result !== undefined){
    resPart.className   = 'tern-result show';
    resPart.textContent = '→ resultado: ' + result;
  } else {
    resPart.className = 'tern-result';
  }
}


// ═══════════════════════════════════════════
// LESSON LIST
// ═══════════════════════════════════════════
const TAG={
  básico:       {bg:'var(--green-d)',c:'var(--green)'},
  intermediário:{bg:'var(--yellow-d)',c:'var(--yellow)'},
  avançado:     {bg:'var(--red-d)',c:'var(--red)'},
  ordenação:    {bg:'var(--purple-d)',c:'var(--purple)'},
};
(function(){
  const list=document.getElementById('lesson-list');
  const groups={};
  LESSONS.forEach((l,i)=>{(groups[l.group]=groups[l.group]||[]).push({l,i});});
  Object.entries(groups).forEach(([g,items])=>{
    const h=document.createElement('div');h.className='lg-hdr';h.textContent=g;list.appendChild(h);
    items.forEach(({l,i})=>{
      const ts=TAG[l.tag]||TAG.básico;
      const d=document.createElement('div');d.className='lcard';
      d.innerHTML=`<div class="lc-icon">${l.icon}</div>
        <div class="lc-body"><div class="lc-title">${l.title}</div><div class="lc-desc">${l.desc}</div></div>
        <div class="lc-tag" style="background:${ts.bg};color:${ts.c}">${l.tag}</div>`;
      d.onclick=()=>loadLesson(i);
      list.appendChild(d);
    });
  });
})();

// ═══════════════════════════════════════════
// SPEED
// ═══════════════════════════════════════════
function updateSpeed(){
  const v=parseInt(document.getElementById('spd').value);
  document.getElementById('spd-lbl').textContent=(v/1000).toFixed(1)+'s';
}
updateSpeed();

// ═══════════════════════════════════════════
// EDITOR
// ═══════════════════════════════════════════
function syncScroll(){
  const ed=document.getElementById('editor');
  const ln=document.getElementById('line-nums');
  ln.scrollTop=ed.scrollTop;
}
function syncLines(){
  const ed=document.getElementById('editor');
  const count=ed.value.split('\n').length;
  document.getElementById('line-nums').textContent=
    Array.from({length:count},(_,i)=>i+1).join('\n');
}

// ═══════════════════════════════════════════
// ENGINE
// ═══════════════════════════════════════════
let STEPS=[],stepIdx=-1,playing=false,playTimer=null;
let isSort=false,isRec=false,isBranch=false,isMatrix=false,isTernary=false,sortInit=false;
let currentBranchDef=null,currentTernDef=null;

// ═══════════════════════════════════════════
// BRANCH SVG ENGINE
// ═══════════════════════════════════════════
function buildBranchSVG(def){
  currentBranchDef=def;
  const svg=document.getElementById('branch-svg');
  svg.innerHTML=`<defs>
    <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#2a3347"/></marker>
    <marker id="arr-blue" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#4f9eff"/></marker>
    <marker id="arr-green" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#3ecf6c"/></marker>
    <marker id="arr-red" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#f06060"/></marker>
  </defs>`;
  const ns='http://www.w3.org/2000/svg';
  const branches=def.branches;
  const n=branches.length;

  // Layout: diamond (condition) → rect (body) vertically, side by side
  // For ifelse: chain down-left to down-right
  // We'll do a vertical list layout — clean and easy to read
  const SVG_W=460;
  const ROW_H=64;       // height per branch row
  const COND_W=130;     // condition box width
  const COND_H=36;
  const BODY_W=100;     // body box width
  const BODY_H=32;
  const START_Y=20;
  const COND_X=10;      // left column: conditions
  const BODY_X=SVG_W-BODY_W-10; // right column: bodies
  const SVG_H=START_Y+n*ROW_H+30;

  svg.setAttribute('viewBox',`0 0 ${SVG_W} ${SVG_H}`);
  svg.setAttribute('height',String(SVG_H));

  // Header: expr label
  const isSwitch=def.type==='switch';
  const hdr=document.createElementNS(ns,'text');
  hdr.setAttribute('x',SVG_W/2); hdr.setAttribute('y',12);
  hdr.setAttribute('font-family','JetBrains Mono,monospace');
  hdr.setAttribute('font-size','10');
  hdr.setAttribute('fill','#4a5568');
  hdr.setAttribute('text-anchor','middle');
  hdr.textContent=isSwitch?`switch (${def.expr})`:'if / else if / else';
  svg.appendChild(hdr);

  // vertical spine line on left
  const spine=document.createElementNS(ns,'line');
  spine.setAttribute('x1',COND_X+COND_W/2); spine.setAttribute('y1',START_Y+10);
  spine.setAttribute('x2',COND_X+COND_W/2); spine.setAttribute('y2',START_Y+n*ROW_H-10);
  spine.setAttribute('stroke','#2a3347'); spine.setAttribute('stroke-width','1.5');
  svg.appendChild(spine);

  branches.forEach((b,i)=>{
    const cy=START_Y+i*ROW_H+ROW_H/2;
    const condCX=COND_X+COND_W/2;
    const bodyCX=BODY_X+BODY_W/2;

    // condition box
    const rect=document.createElementNS(ns,'rect');
    rect.setAttribute('x',COND_X); rect.setAttribute('y',cy-COND_H/2);
    rect.setAttribute('width',COND_W); rect.setAttribute('height',COND_H);
    rect.setAttribute('rx','7'); rect.setAttribute('class','bnode-box idle');
    rect.id='bcond-'+b.id;
    svg.appendChild(rect);

    // condition text
    const ct=document.createElementNS(ns,'text');
    ct.setAttribute('x',condCX); ct.setAttribute('y',cy-6);
    ct.setAttribute('class','bnode-text idle');
    ct.setAttribute('font-size','9.5');
    ct.id='bcond-text-'+b.id;
    ct.textContent=b.cond;
    svg.appendChild(ct);

    // result badge inside condition box
    const badge=document.createElementNS(ns,'text');
    badge.setAttribute('x',condCX); badge.setAttribute('y',cy+8);
    badge.setAttribute('class','bnode-badge');
    badge.setAttribute('font-size','9');
    badge.setAttribute('opacity','0');
    badge.id='bcond-badge-'+b.id;
    svg.appendChild(badge);

    // arrow condition → body
    const arrow=document.createElementNS(ns,'line');
    arrow.setAttribute('x1',COND_X+COND_W); arrow.setAttribute('y1',cy);
    arrow.setAttribute('x2',BODY_X-2);       arrow.setAttribute('y2',cy);
    arrow.setAttribute('class','bedge');
    arrow.id='bedge-'+b.id;
    svg.appendChild(arrow);

    // YES/NO label on arrow
    const elbl=document.createElementNS(ns,'text');
    elbl.setAttribute('x',(COND_X+COND_W+BODY_X)/2);
    elbl.setAttribute('y',cy-5);
    elbl.setAttribute('class','bedge-lbl');
    elbl.setAttribute('opacity','0');
    elbl.id='bedge-lbl-'+b.id;
    svg.appendChild(elbl);

    // body box
    const brect=document.createElementNS(ns,'rect');
    brect.setAttribute('x',BODY_X); brect.setAttribute('y',cy-BODY_H/2);
    brect.setAttribute('width',BODY_W); brect.setAttribute('height',BODY_H);
    brect.setAttribute('rx','6'); brect.setAttribute('class','bnode-box idle');
    brect.id='bbody-'+b.id;
    svg.appendChild(brect);

    // body label
    const bt=document.createElementNS(ns,'text');
    bt.setAttribute('x',bodyCX); bt.setAttribute('y',cy);
    bt.setAttribute('class','bnode-text idle'); bt.setAttribute('font-size','10');
    bt.id='bbody-text-'+b.id;
    bt.textContent=b.label;
    svg.appendChild(bt);
  });
}

function updateBranchSVG(state){
  if(!state||!currentBranchDef) return;
  const{testing,results,exec}=state;
  currentBranchDef.branches.forEach(b=>{
    const res=results[b.id];
    const isTest=testing===b.id;
    const isExec=exec===b.id;

    // condition box state
    let condCls='bnode-box ';
    let condTxt='bnode-text ';
    let badgeOp='0', badgeTxt='', badgeFill='';
    if(isTest){
      condCls+='testing'; condTxt+='testing';
    } else if(res==='pass'){
      condCls+='passed'; condTxt+='passed';
      badgeOp='1'; badgeTxt='✓'; badgeFill='var(--green)';
    } else if(res==='fail'){
      condCls+='failed'; condTxt+='failed';
      badgeOp='1'; badgeTxt='✗'; badgeFill='var(--red)';
    } else if(res==='skip'){
      condCls+='skipped'; condTxt+='skipped';
    } else {
      condCls+='idle'; condTxt+='idle';
    }

    const condEl=document.getElementById('bcond-'+b.id);
    const condTxtEl=document.getElementById('bcond-text-'+b.id);
    const condBadge=document.getElementById('bcond-badge-'+b.id);
    if(condEl) condEl.setAttribute('class',condCls);
    if(condTxtEl) condTxtEl.setAttribute('class',condTxt);
    if(condBadge){
      condBadge.setAttribute('opacity',badgeOp);
      condBadge.textContent=badgeTxt;
      condBadge.setAttribute('fill',badgeFill);
    }

    // arrow
    const arrow=document.getElementById('bedge-'+b.id);
    const elbl=document.getElementById('bedge-lbl-'+b.id);
    if(arrow){
      if(isExec||res==='pass'){
        arrow.setAttribute('class','bedge taken');
        if(elbl){elbl.setAttribute('opacity','1');elbl.setAttribute('class','bedge-lbl yes');elbl.textContent='✓ executa';}
      } else if(res==='fail'){
        arrow.setAttribute('class','bedge skip');
        if(elbl){elbl.setAttribute('opacity','1');elbl.setAttribute('class','bedge-lbl no');elbl.textContent='✗ pula';}
      } else if(res==='skip'){
        arrow.setAttribute('class','bedge skip');
        if(elbl){elbl.setAttribute('opacity','.6');elbl.setAttribute('class','bedge-lbl no');elbl.textContent='ignorado';}
      } else if(isTest){
        arrow.setAttribute('class','bedge active');
        if(elbl){elbl.setAttribute('opacity','0');}
      } else {
        arrow.setAttribute('class','bedge');
        if(elbl){elbl.setAttribute('opacity','0');}
      }
    }

    // body box
    const bodyEl=document.getElementById('bbody-'+b.id);
    const bodyTxt=document.getElementById('bbody-text-'+b.id);
    if(bodyEl){
      if(isExec){
        bodyEl.setAttribute('class','bnode-box exec');
        if(bodyTxt) bodyTxt.setAttribute('class','bnode-text exec');
      } else if(res==='skip'){
        bodyEl.setAttribute('class','bnode-box skipped');
        if(bodyTxt) bodyTxt.setAttribute('class','bnode-text skipped');
      } else if(res==='pass'){
        bodyEl.setAttribute('class','bnode-box exec');
        if(bodyTxt) bodyTxt.setAttribute('class','bnode-text exec');
      } else {
        bodyEl.setAttribute('class','bnode-box idle');
        if(bodyTxt) bodyTxt.setAttribute('class','bnode-text idle');
      }
    }
  });
}

function loadLesson(idx){
  const l=LESSONS[idx];
  isSort=!!l.sort; isRec=!!l.rec; isBranch=!!l.branch;
  isMatrix=!!l.matrix; isTernary=!!l.ternary;
  if(isTernary) currentTernDef=l.ternDef||null;
  document.getElementById('editor').value=l.code;
  document.getElementById('file-name').textContent=l.title.toLowerCase().replace(/\s+/g,'-')+'.c';
  document.getElementById('status-msg').textContent=l.title;
  syncLines();
  STEPS=l.steps; stepIdx=-1;
  document.getElementById('sort-section').classList.toggle('on',isSort);
  document.getElementById('rec-section').classList.toggle('on',isRec);
  document.getElementById('branch-section').classList.toggle('on',isBranch);
  document.getElementById('lesson-matrix-section').classList.toggle('on',isMatrix);
  document.getElementById('lesson-tern-section').classList.toggle('on',isTernary);
  if(isBranch){
    document.getElementById('branch-lbl').textContent=
      l.branchDef.type==='switch'?'🎛️ Switch / Case':'🔀 Fluxo if / else if / else';
    buildBranchSVG(l.branchDef);
  }
  if(isMatrix){
    document.getElementById('mat-col-hdrs').innerHTML='';
    document.getElementById('mat-body').innerHTML='';
  }
  document.getElementById('out-section').style.display='block';
  document.getElementById('mem-section').style.display='none';
  if(isRec) buildRecSVG();
  clearViz();
  enableCtrl(true);
  updateProgress();
  goPage('play',document.querySelector('.tab-btn'));
}

function enableCtrl(on){
  ['playbtn','prevbtn','nextbtn','resetbtn'].forEach(id=>document.getElementById(id).disabled=!on);
}
function togglePlay(){
  if(!STEPS.length) return;
  if(playing){pausePlay();return;}
  playing=true;
  document.getElementById('playbtn').textContent='⏸ Pausar';
  tick();
}
function pausePlay(){
  playing=false;clearTimeout(playTimer);
  document.getElementById('playbtn').textContent='▶ Play';
}
function tick(){
  if(!playing) return;
  const done=applyStep(stepIdx+1);
  if(done){pausePlay();}
  else{playTimer=setTimeout(tick,parseInt(document.getElementById('spd').value));}
}
function stepFwd(){if(playing)pausePlay();applyStep(stepIdx+1);}
function stepBack(){
  if(playing)pausePlay();
  if(stepIdx<=0)return;
  const t=stepIdx-1;
  clearViz();
  for(let i=0;i<=t;i++) replaySilent(i);
  stepIdx=t;updateProgress();paintStep(STEPS[stepIdx]);
}
function resetPlay(){
  pausePlay();stepIdx=-1;
  clearViz();updateProgress();
  document.getElementById('exp-tag').textContent='—';
  document.getElementById('exp-text').textContent='Pressione ▶ Play para iniciar.';
  document.getElementById('step-hint').textContent='';
  document.getElementById('playbtn').textContent='▶ Play';
}

function applyStep(idx){
  if(idx>=STEPS.length) return true;
  stepIdx=idx;
  const s=STEPS[idx];
  paintStep(s);
  if(s.output) appendOut(s.output);
  updateProgress();
  return idx>=STEPS.length-1;
}
function replaySilent(idx){if(STEPS[idx].output)appendOut(STEPS[idx].output);}

function paintStep(s){
  highlightLine(s.line);
  renderStack(s.frames);
  if(isSort&&s.sort_state)       renderSort(s.sort_state);
  if(isRec&&s.rec_state)         updateRecSVG(s.rec_state);
  if(isBranch&&s.branch_state)   updateBranchSVG(s.branch_state);
  if(isMatrix&&s.mat_state)      renderMatrix(s.mat_state);
  if(isTernary&&s.tern_state)    renderTernary(s.tern_state, currentTernDef);
  if(s.mem&&Object.keys(s.mem).length) renderMem(s.mem);
  showExp(s.desc,s.line);
  document.getElementById('step-hint').textContent=`passo ${stepIdx+1} / ${STEPS.length}`;
}

// ── CALL STACK ──────────────────────────────────────────
function findFrame(name){
  return Array.from(document.getElementById('stack-list').querySelectorAll('.sframe'))
    .find(el=>el.dataset.frame===name)||null;
}
function renderStack(frames){
  const list=document.getElementById('stack-list');
  const empty=document.getElementById('stack-empty');
  if(!frames||!frames.length){
    Array.from(list.querySelectorAll('.sframe')).forEach(el=>el.remove());
    empty.style.display='block';
    document.getElementById('stack-count').textContent='0';
    return;
  }
  empty.style.display='none';
  document.getElementById('stack-count').textContent=String(frames.length);

  const keys=frames.map(f=>f.name);
  Array.from(list.querySelectorAll('.sframe')).forEach(el=>{
    if(!keys.includes(el.dataset.frame)){
      el.classList.add('returning');
      setTimeout(()=>{if(el.parentNode)el.remove();},350);
    }
  });

  frames.forEach((f,fi)=>{
    const isActive=fi===frames.length-1;
    const isBase=f.returning&&f.name==='fat(1)';
    let el=findFrame(f.name);
    if(!el){
      el=document.createElement('div');
      el.dataset.frame=f.name;
      list.appendChild(el);
    }
    let cls='sframe';
    if(f.returning) cls+=' returning';
    else if(isBase)  cls+=' base';
    else if(isActive)cls+=' active';
    el.className=cls;

    const depth=fi+1;
    let html=`<div class="sframe-fn">${f.name}</div><div class="depth-badge">#${depth}</div>`;
    if(f.vars){
      Object.entries(f.vars).forEach(([,vr])=>{
        html+=`<div class="sframe-row${vr.hi?' hi':''}"><span class="k">${vr.name}</span><span class="val">${vr.value}</span></div>`;
      });
    }
    if(f.retVal!==undefined){
      html+=`<div class="sframe-ret">↩ ${f.retVal}</div>`;
    }
    el.innerHTML=html;
  });
}

// ── SORT VIS ──────────────────────────────────────────────
function renderSort(st){
  const arena=document.getElementById('sort-arena');
  if(!st||!st.array) return;
  const arr=st.array,n=arr.length;
  const W=arena.clientWidth||220;
  const bw=Math.floor((W-16)/n)-4,gap=4;
  const maxH=82,maxV=Math.max(...arr,1);
  if(!sortInit){
    arena.innerHTML='';
    arr.forEach((_,i)=>{
      const b=document.createElement('div');
      b.className='sbar';b.id='sb'+i;
      b.innerHTML=`<div class="sbar-val"></div><div class="sbar-inner"></div><div class="sbar-lbl">v[${i}]</div>`;
      b.style.width=bw+'px';arena.appendChild(b);
    });
    sortInit=true;
  }
  arr.forEach((v,pos)=>{
    const b=document.getElementById('sb'+pos);if(!b)return;
    b.style.left=(8+pos*(bw+gap))+'px';
    b.querySelector('.sbar-inner').style.height=Math.round((v/maxV)*maxH)+'px';
    b.querySelector('.sbar-val').textContent=v;
    b.className='sbar';
    if(st.swapping&&st.comparing&&(pos===st.comparing[0]||pos===st.comparing[1]))b.classList.add('swp');
    else if(st.comparing&&(pos===st.comparing[0]||pos===st.comparing[1]))b.classList.add('cmp');
    if(st.sorted_indices&&st.sorted_indices.includes(pos))b.classList.add('fin');
  });
}

// ── MEMORY ─────────────────────────────────────────────────
let lastMem={};
function renderMem(mem){
  document.getElementById('mem-section').style.display='block';
  const grid=document.getElementById('mem-grid');
  Object.entries(mem).forEach(([key,v])=>{
    let el=document.getElementById('mc-'+key);
    if(!el){el=document.createElement('div');el.id='mc-'+key;el.className='mcell';grid.appendChild(el);}
    const changed=lastMem[key]?.value!==v.value;
    let cls='mcell ';
    if(v.kind==='pointer')cls+='ptr';
    else if(changed)cls+='hot';
    else if(el.className.includes('hi'))cls+='hi';
    el.className=cls;
    el.innerHTML=`<div class="mn">${v.name||key}</div><div class="mv">${String(v.value).slice(0,9)}</div><div class="ma">${v.address||''}</div>`;
    el.classList.add('pop');
    setTimeout(()=>{el.classList.remove('pop');if(el.className.includes('hot')){el.classList.remove('hot');el.classList.add('hi');}},350);
  });
  lastMem=JSON.parse(JSON.stringify(mem));
}

// ── LINE HIGHLIGHT ─────────────────────────────────────────
function highlightLine(n){
  if(!n)return;
  const ed=document.getElementById('editor');
  const top=(n-1)*22+10;
  const hl=document.getElementById('line-hl');
  hl.style.display='block';hl.style.top=top+'px';
  if(top-ed.clientHeight/2>0)ed.scrollTop=top-ed.clientHeight/2;
}

// ── OUTPUT ─────────────────────────────────────────────────
function appendOut(txt){
  const b=document.getElementById('out-box');
  const sp=document.createElement('span');sp.className='out-line';sp.textContent=txt;
  b.appendChild(sp);b.scrollTop=b.scrollHeight;
}

// ── EXPLAIN ────────────────────────────────────────────────
function showExp(desc,line){
  document.getElementById('exp-tag').textContent='Linha '+line;
  document.getElementById('exp-text').textContent=desc||'';
}

// ── PROGRESS ───────────────────────────────────────────────
function updateProgress(){
  const t=STEPS.length,c=Math.max(0,stepIdx+1);
  document.getElementById('prg-fill').style.width=(t>0?(c/t)*100:0)+'%';
  document.getElementById('prg-lbl').textContent=`${c} / ${t}`;
}

// ── CLEAR ──────────────────────────────────────────────────
function clearViz(){
  Array.from(document.getElementById('stack-list').querySelectorAll('.sframe')).forEach(el=>el.remove());
  document.getElementById('stack-empty').style.display='block';
  document.getElementById('stack-count').textContent='0';
  document.getElementById('mem-grid').innerHTML='';
  document.getElementById('ptr-area').innerHTML='';
  document.getElementById('sort-arena').innerHTML='';
  sortInit=false; lastMem={};
  document.getElementById('out-box').innerHTML='<span class="out-prompt">$ ./main\n</span>';
  document.getElementById('line-hl').style.display='none';
  if(isRec) buildRecSVG();
  if(isBranch&&currentBranchDef) buildBranchSVG(currentBranchDef);
  // limpa matriz
  const mb=document.getElementById('mat-body'); if(mb) mb.innerHTML='';
  const mc=document.getElementById('mat-col-hdrs'); if(mc) mc.innerHTML='';
  // limpa ternário
  const tr=document.getElementById('tern-result'); if(tr) tr.className='tern-result';
  const tc=document.getElementById('tern-cond'); if(tc) tc.className='tern-part cond-part';
  const tt=document.getElementById('tern-true'); if(tt) tt.className='tern-part true-part';
  const tf=document.getElementById('tern-false'); if(tf) tf.className='tern-part false-part';
}

// ── PAGE ───────────────────────────────────────────────────
function goPage(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('on'));
  document.getElementById('pg-'+id).classList.add('on');
  if(btn)btn.classList.add('on');
}