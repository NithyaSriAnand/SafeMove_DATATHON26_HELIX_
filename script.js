const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

// Global polish / scroll progress
const progress = $('#progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}, {passive:true});

// Smooth navigation + demo controls
function scrollToId(id){ const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); }
$('#heroSim')?.addEventListener('click', () => { scrollToId('simulation'); setTimeout(runAccidentSimulation, 650); });
$('#navSim')?.addEventListener('click', () => { scrollToId('simulation'); setTimeout(runAccidentSimulation, 650); });

// Interactive Red Zone prototype
const rider = $('#rider');
const mapAlert = $('#mapAlert');
const mapDistance = $('#mapDistance');
const zoneDistance = $('#zoneDistance');
let riderRunning = false;
let routeVisible = false;
function showRisk(distance='420 m'){
  mapAlert.classList.add('show');
  mapDistance.textContent = `Distance: ${distance}`;
  zoneDistance.textContent = distance.replace(' ','');
}
function moveRider(){
  if(riderRunning) return;
  riderRunning = true;
  mapAlert.classList.remove('show');
  const points = [
    ['15%','77%','900 m'],['26%','69%','720 m'],['38%','59%','520 m'],['50%','48%','420 m'],['62%','38%','210 m'],['67%','34%','80 m']
  ];
  let i=0;
  function step(){
    if(i >= points.length){ riderRunning=false; showRisk('80 m'); return; }
    rider.style.left=points[i][0]; rider.style.top=points[i][1];
    zoneDistance.textContent=points[i][2].replace(' ','');
    if(i>=3) showRisk(points[i][2]);
    setTimeout(()=>{i++;step()}, i<3?650:800);
  }
  step();
}
$('#riderSim')?.addEventListener('click', moveRider);
$('#safeRoute')?.addEventListener('click', () => {
  routeVisible=!routeVisible;
  $('.route')?.classList.toggle('show', routeVisible);
  $('#safeRoute').textContent = routeVisible ? 'HIDE SAFER ROUTE' : 'VIEW SAFER ROUTE';
});
$('#zoomIn')?.addEventListener('click',()=>$('#riskMap').style.transform='scale(1.08)');
$('#zoomOut')?.addEventListener('click',()=>$('#riskMap').style.transform='scale(1)');
$$('.zone').forEach(z=>z.addEventListener('click',()=>{
  const high=z.dataset.zone==='high';
  mapAlert.classList.add('show');
  mapAlert.querySelector('b').textContent = high ? '⚠ RED ZONE AHEAD' : 'RISK AREA';
  $('#mapAlertText').textContent = high ? 'High accident-risk area detected' : 'Moderate/low accident-risk area';
  mapDistance.textContent = high ? 'Distance: 420 m' : 'Distance: 760 m';
}));

// End-to-end accident simulation
let simulationRunning=false;
const flowNodes=$$('.flow-node');
const timeline=$$('#timeline article');
function setFlowStep(n){
  flowNodes.forEach((node,i)=>node.classList.toggle('active',i===n-1));
  $('#systemFlow')?.scrollIntoView({behavior:'smooth',block:'center'});
  $('#systemFlow')?.classList.add('running');
}
function runAccidentSimulation(){
  if(simulationRunning) return;
  simulationRunning=true;
  timeline.forEach(x=>x.classList.remove('active','done'));
  $('#simStatus').textContent='SIMULATION RUNNING';
  $('#responseStatus').textContent='Processing event…';
  $('#simTime').textContent='—';
  $('#simResult').style.opacity='.65';
  $('#systemFlow')?.classList.add('running');
  let step=0;
  const advance=()=>{
    step++;
    timeline[step-1]?.classList.add('active');
    if(step>1) timeline[step-2]?.classList.add('done');
    setFlowStep(Math.min(step,6));
    if(step===3) showRisk('80 m');
    if(step<7){ setTimeout(advance, 780); }
    else {
      timeline[6]?.classList.add('done');
      $('#simStatus').textContent='ACCIDENT ALERT SENT';
      $('#responseStatus').textContent='Simulated responder notification';
      $('#simTime').textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
      $('#simResult').style.opacity='1';
      simulationRunning=false;
    }
  };
  advance();
}
$('#simButton')?.addEventListener('click',runAccidentSimulation);
$('#resetSim')?.addEventListener('click',()=>{
  simulationRunning=false; timeline.forEach(x=>x.classList.remove('active','done')); flowNodes.forEach(x=>x.classList.remove('active')); $('#systemFlow')?.classList.remove('running');
  $('#simStatus').textContent='SYSTEM READY'; $('#responseStatus').textContent='Awaiting simulation'; $('#simTime').textContent='—'; $('#simResult').style.opacity='.65';
});

// 360 helmet viewer (192 frames preserved)
const canvas=$('#helmetCanvas');
if(canvas){
  const ctx=canvas.getContext('2d'); const counter=$('#frameCounter'); const spinButton=$('#spinButton'); const TOTAL=192; const images=[];
  let frame=0,dragging=false,lastX=0,velocity=0,autoSpin=true;
  function resizeCanvas(){const dpr=Math.min(devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  function loadImages(){for(let i=1;i<=TOTAL;i++){const img=new Image();img.src=`assets/helmet/${String(i).padStart(3,'0')}.jpg`;img.onload=()=>{if(i===1)draw()};images.push(img)}}
  function draw(){const img=images[Math.round(frame)%TOTAL];if(!img||!img.complete)return;const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);const ratio=Math.min(w/img.naturalWidth,h/img.naturalHeight)*.91,iw=img.naturalWidth*ratio,ih=img.naturalHeight*ratio,x=(w-iw)/2,y=(h-ih)/2;ctx.drawImage(img,x,y,iw,ih);counter.textContent=`${String((Math.round(frame)%TOTAL)+1).padStart(2,'0')} / ${TOTAL}`}
  function tick(){if(autoSpin&&!dragging)frame=(frame+.18+velocity)%TOTAL;velocity*=.92;draw();requestAnimationFrame(tick)}
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX;lastX=e.clientX;frame=(frame-dx*.32+TOTAL)%TOTAL;velocity=-dx*.015;draw()});
  ['pointerup','pointercancel'].forEach(t=>canvas.addEventListener(t,()=>dragging=false));
  spinButton?.addEventListener('click',()=>{autoSpin=!autoSpin;spinButton.textContent=autoSpin?'AUTO SPIN':'PAUSED'});
  window.addEventListener('resize',resizeCanvas);loadImages();resizeCanvas();tick();
}

// Helmet component explorer
const parts={
  mpu:['01 · MPU6050','Impact sensing','Detects acceleration and abnormal impact for the accident-detection workflow.'],
  strap:['02 · CHIN-STRAP SENSOR','Helmet compliance','Checks chin-strap state and contributes to dual verification.'],
  camera:['03 · CAMERA','Computer vision','Supports simulated rider-state and helmet-presence analysis.'],
  gps:['04 · GPS','Location capture','Attaches the simulated accident location to the incident event.'],
  esp:['05 · ESP32 / EDGE PROCESSOR','Edge processing','Processes sensor data close to the point of impact.'],
  alert:['06 · ALERT SYSTEM','Emergency workflow','Triggers the communication path from verified incident to dashboard alert.']
};
const panel=$('#partPanel');
$$('.hotspot').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.hotspot').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const [title,label,desc]=parts[btn.dataset.part];panel.innerHTML=`<span>${label}</span><b>${title}</b><p>${desc}</p>`;
}));

// Subtle pointer tilt and reveal animations
const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(finePointer&&!reduced){window.addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',`${e.clientX/innerWidth*100}%`);document.body.style.setProperty('--my',`${e.clientY/innerHeight*100}%`)},{passive:true})}
if('IntersectionObserver' in window&&!reduced){
  const revealEls=$$('.section-heading,.problem-stat,.problem-points article,.story-photo,.story-copy,.component-card,.map-panel,.feature-card,.flow-node,.simulator,.viewer,.vision-grid,.tech-grid>div,.metrics>div');
  revealEls.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(22px)';el.style.transition='opacity .7s ease, transform .7s ease'});
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='none';io.unobserve(e.target)}}),{threshold:.12});
  revealEls.forEach(el=>io.observe(el));
  const navLinks=$$('.nav nav a');
  const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const navIO=new IntersectionObserver(entries=>{const v=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;navLinks.forEach(a=>a.style.color=a.getAttribute('href')===`#${v.target.id}`?'var(--gold2)':'')},{threshold:[.2,.5],rootMargin:'-15% 0 -60% 0'});
  sections.forEach(s=>navIO.observe(s));
}
