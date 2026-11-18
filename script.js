const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* 3D starfield: stars fly toward the viewer, warp speed on page change */
const cv=document.getElementById('sky'),cx=cv.getContext('2d'),root=document.documentElement;let W,H,S=[],mx=0,my=0,warp=0;
const mk=(z)=>({x:(Math.random()-.5)*2*W,y:(Math.random()-.5)*2*H,z:z??Math.random()*W+1,c:['#fff','#cdbdff','#8fdcff'][Math.random()*3|0]});
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;S=Array.from({length:Math.min(420,W*H/4500|0)},()=>mk())}
addEventListener('resize',size);
addEventListener('pointermove',e=>{mx=e.clientX/W-.5;my=e.clientY/H-.5;root.style.setProperty('--px',mx.toFixed(3));root.style.setProperty('--py',my.toFixed(3))});
function draw(){cx.clearRect(0,0,W,H);warp*=.93;const sp=.7+warp,ox=W/2-mx*90,oy=H/2-my*90;
for(const s of S){const px=ox+s.x/s.z*W/2,py=oy+s.y/s.z*W/2;s.z-=sp;if(s.z<1){Object.assign(s,mk(W));continue}
const nx=ox+s.x/s.z*W/2,ny=oy+s.y/s.z*W/2,d=1-s.z/W;cx.globalAlpha=Math.min(1,.15+d*1.1)*(d>.9&&warp<1.5?.4:1);cx.strokeStyle=cx.fillStyle=s.c;
if(warp>1.5){cx.lineWidth=d*2.2+.3;cx.beginPath();cx.moveTo(px,py);cx.lineTo(nx,ny);cx.stroke()}else{cx.beginPath();cx.arc(nx,ny,d*2.2+.3+(d>.9?(d-.9)*50:0),0,6.28);cx.fill()}}
if(!rm)requestAnimationFrame(draw)}
size();draw();
/* tabs + page transitions */
const pages=[...document.querySelectorAll('.page')],links=[...document.querySelectorAll('#tabs a')],pill=document.getElementById('pill'),wipe=document.getElementById('wipe');
let cur=null,timer;
function movePill(){const a=document.querySelector('#tabs a.on');if(a){pill.style.left=a.offsetLeft+'px';pill.style.width=a.offsetWidth+'px'}}
function go(){
const id=pages.some(p=>'#'+p.id===location.hash)?location.hash.slice(1):'home',nxt=document.getElementById(id);
links.forEach(a=>a.classList.toggle('on',a.hash==='#'+id));movePill();
if(nxt===cur)return;
const d=cur?Math.sign(pages.indexOf(nxt)-pages.indexOf(cur)):1;
const show=()=>{pages.forEach(p=>p.classList.remove('on','out'));nxt.style.setProperty('--d',d);nxt.classList.add('on');cur=nxt;scrollTo(0,0)};
clearTimeout(timer);
if(!cur||rm){show();return}
cur.style.setProperty('--d',d);cur.classList.add('out');
wipe.classList.remove('go');void wipe.offsetWidth;wipe.classList.add('go');warp=28;
timer=setTimeout(show,330)}
addEventListener('hashchange',go);addEventListener('resize',movePill);
document.fonts&&document.fonts.ready.then(movePill);go();
/* projects */
const P=[
{n:'CurVitae',s:'live',t:'AI-powered CV builder',d:'Upload your resume or enter your details, and Nyxara AI analyses and optimises it into a recruiter-ready CV you can download as a PDF. Built with Flutter, Firebase and Nyxara AI.',feat:1,i:'curvitae-logo.png',m:'curvitae.jpg',c:1,light:1},
{n:'TWELVEND: The Thirteenth Room',s:'soon',t:'Psychological horror mystery',d:'A house has twelve rooms, so why is there a thirteenth? A story of Kerala’s hidden paths, made with Godot.',i:'twelvend'},
{n:'Celestify',s:'soon',t:'A cosmic pet for your dynamic island',d:'Luna lives in your dynamic island, reacts to your day and travels with you between Android and Windows 11.',i:'celestify'},
{n:'ESVRO',s:'soon',t:'Bookkeeping for shops and accountants',d:'Two apps for shop owners and accountants, built on a deterministic financial core. AI suggests; people approve.',i:'esvro',c:1},
{n:'SKEIN',s:'soon',t:'Every thread, one connection',d:'A unified messaging, team communication and automation platform across WhatsApp, email and chat.',i:'skein'},
{n:'AVYRON',s:'soon',t:'Universal robotics intelligence',d:'One intelligence for every robot: unified, adaptive and safe across different robot forms.',i:'avyron'},
{n:'SENTINEL',s:'soon',t:'Consumer protection shield',d:'AI-powered compliance checks for the Legal Metrology (Packaged Commodities) Rules, 2011. Built for Smart India Hackathon 2026.',i:'sentinel'},
{n:'Nyxara Learning App',s:'soon',t:'Learn, think, grow',d:'Socratic guidance that scans your work, finds your real mistakes and helps you improve. Not just answers, but the right thinking.',i:'learn'},
{n:'LUNA NAV',s:'soon',t:'Lunar landing-site explorer',d:'Mission planning for the lunar south pole using NASA open data, with interactive terrain and illumination analysis.',i:'lunanav.svg',c:1},
{n:'Nyxara AI',s:'soon',t:'Our own language model',d:'An early-stage research project building a language model from the ground up: architecture, tokenizer, training and evaluation.'}];
const grid=document.getElementById('grid'),dlg=document.getElementById('dlg');
const src=n=>'assets/'+n+(n.includes('.')?'':'.jpg'),art=p=>p.i?`<img src="${src(p.i)}" alt="${p.n}" class="${p.c?'c':''}">`:`<b>${p.n}</b>`;
function render(f){grid.innerHTML='';P.filter(p=>f==='all'||p.s===f).forEach((p,k)=>{const b=document.createElement('button');b.className='card'+(p.feat?' feat':'');b.style.animationDelay=k*70+'ms';
b.innerHTML=`<div class="art${p.light?' light':''}">${art(p)}</div><div class="t"><span class="chip ${p.s}">${p.s==='live'?'Released':'Upcoming'}</span><h3>${p.n}</h3><p>${p.t}</p></div>`;
b.onclick=()=>{dlg.querySelector('.dimg').innerHTML=p.i?`<img src="${src(p.m||p.i)}" alt="${p.n}">`:`<b>${p.n}</b>`;dlg.querySelector('.dtxt').innerHTML=`<span class="chip ${p.s}">${p.s==='live'?'Released':'Upcoming'}</span><h3>${p.n}</h3><p>${p.d}</p>`;dlg.showModal()};
grid.append(b)})}
document.querySelectorAll('.f').forEach(b=>b.onclick=()=>{document.querySelectorAll('.f').forEach(x=>x.classList.toggle('on',x===b));render(b.dataset.f)});
render('all');
dlg.querySelector('.x').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
/* contact */
document.getElementById('form').onsubmit=e=>{e.preventDefault();const f=e.target;location.href='mailto:nyxarasupport.in@gmail.com?subject='+encodeURIComponent('Message from '+f.n.value)+'&body='+encodeURIComponent(f.m.value)};

/* 3D tilt + glare on cards and team */
const mainEl=document.querySelector('main');
mainEl.addEventListener('pointermove',e=>{const el=e.target.closest('.card,.member');if(!el||e.pointerType==='touch')return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
el.style.setProperty('--ry',((x-.5)*16).toFixed(1)+'deg');el.style.setProperty('--rx',((.5-y)*16).toFixed(1)+'deg');el.style.setProperty('--gx',x*100+'%');el.style.setProperty('--gy',y*100+'%')});
mainEl.addEventListener('mouseout',e=>{const el=e.target.closest('.card,.member');if(el&&!el.contains(e.relatedTarget)){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')}});

/* team photos: not tappable, draggable, saveable via menu, or zoomable */
document.addEventListener('contextmenu',e=>{if(e.target.closest('.pic'))e.preventDefault()});
document.addEventListener('dragstart',e=>{if(e.target.closest&&e.target.closest('.pic'))e.preventDefault()});
/* realistic 3D moon: procedural craters, rotating sphere, lit by your pointer */
(()=>{const c=document.getElementById('moon'),g=c.getContext('2d'),N=c.width,R=N/2-5,TW=512,TH=256,tex=new Float32Array(TW*TH);
const h=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
const vn=(x,y,p)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=xi%p,b=(xi+1)%p;return h(a,yi)*(1-u)*(1-v)+h(b,yi)*u*(1-v)+h(a,yi+1)*(1-u)*v+h(b,yi+1)*u*v};
for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){let v=0,a=.5;for(let o=0;o<5;o++){const p=8<<o;v+=a*vn(x/TW*p,y/TH*p/2,p);a/=2}tex[y*TW+x]=.3+.6*v}
for(let k=0;k<170;k++){const cu=Math.random()*TW,cv=Math.random()*TH,r=2+Math.pow(Math.random(),2.4)*20;
for(let dy=-r*1.2|0;dy<=r*1.2;dy++)for(let dx=-r*1.2|0;dx<=r*1.2;dx++){const d=Math.hypot(dx,dy)/r,y=(cv|0)+dy,x=(((cu|0)+dx)%TW+TW)%TW;if(y<0||y>=TH)continue;const i=y*TW+x;
if(d<1)tex[i]-=.2*(1-d*d);else if(d<1.18)tex[i]+=.14*(1.18-d)/.18}}
const px=[],lon=[],row=[],nx=[],ny=[],nz=[],al=[];
for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i-N/2)/R,y=(j-N/2)/R,r2=x*x+y*y;if(r2>1)continue;const z=Math.sqrt(1-r2);
px.push((j*N+i)*4);lon.push(Math.atan2(x,z)/6.2832+.5);row.push(Math.min(TH-1,(.5-Math.asin(-y)/Math.PI)*TH|0)*TW);nx.push(x);ny.push(y);nz.push(z);al.push(r2>.96?(1-r2)/.04*255:255)}
const img=g.createImageData(N,N),d=img.data;let ro=0;
function render(){const lx0=-.55+mx*1.4,ly0=-.3+my*1.2,lz0=.75,m=Math.hypot(lx0,ly0,lz0),lx=lx0/m,ly=ly0/m,lz=lz0/m;
for(let k=0;k<px.length;k++){const t=tex[row[k]+(((lon[k]+ro)%1)*TW|0)],dif=nx[k]*lx+ny[k]*ly+nz[k]*lz,lit=.04+.96*Math.pow(Math.max(dif,0),.8),rim=Math.pow(1-nz[k],3),cc=lit*(.2+.8*Math.min(1,Math.max(0,t))),o=px[k];
d[o]=Math.min(255,cc*232+rim*70);d[o+1]=Math.min(255,cc*228+rim*90);d[o+2]=Math.min(255,cc*255+rim*190);d[o+3]=al[k]}
g.putImageData(img,0,0)}
const ab=document.getElementById('about');
function loop(){if(ab.classList.contains('on')){ro=(ro+.0007)%1;render()}requestAnimationFrame(loop)}
render();if(!rm)loop();
})();
