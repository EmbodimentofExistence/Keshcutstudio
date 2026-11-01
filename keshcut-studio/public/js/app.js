const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,CFG=window.SITE_CONFIG||{},WA=CFG.whatsappNumber||'9779769232638',track=(n,p)=>{window.track&&window.track(n,p)};
const wa=m=>`https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const CARDS=["/images/gallery/haircut-keshcut-cape.jpg","/images/gallery/keshcut-studio-graphic.jpg","/images/gallery/outdoor-haircut-training.jpg","/images/gallery/instructor-fade-demo.jpg","/images/gallery/back-view-fade-haircut.jpg","/images/gallery/kids-fade-haircut.jpg","/images/gallery/razor-practice-class.jpg"]; // one image per card; reorder or swap here
const SV=['Haircut & Modern Hairstyles','Beard Trimming & Styling','Hair Coloring & Highlights','Hair Perming','Dreadlocks (Locs) Styling','Hair Washing & Cleansing','Facial Treatments','Hair & Scalp Care','Hair Styling & Blow Dry','Professional Grooming','Barber Training & Academy Courses'];
$('#ac').href=wa('Hello KeshCut Studio, I would like to ask about the barber academy courses.');
const bk=(what,i)=>`Hello KeshCut Studio, I would like to book ${what}.\nService: ${SV[i]}\nDate: \nTime: \nName: `;
const MSG=[bk('a haircut or modern hairstyle',0),bk('beard trimming and styling',1),bk('hair coloring or highlights',2),bk('a hair perm',3),bk('dreadlocks (locs) styling',4),bk('a hair wash and cleansing',5),bk('a facial treatment',6),bk('a hair and scalp care treatment',7),bk('hair styling and blow dry',8),bk('a professional grooming session',9),
 'Hello KeshCut Studio, I would like to ask about barber training and academy courses.','Hello KeshCut Studio, I would like to ask if a service is available.\nService I need: '];
document.querySelectorAll('[data-m]').forEach(a=>a.href=wa(MSG[a.dataset.m]));
$('#wa3').href=wa('Hello KeshCut Studio, I would like to book.\nService: \nDate: \nTime: \nName: ');

/* analytics events: clicks only, never names, phone numbers, messages or booking details (track() does nothing unless the visitor agreed) */
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-m]');
 if(a){const i=+a.dataset.m;if(i<10){track('view_service',{service_name:SV[i]});track('whatsapp_booking_click',{link_location:'service_row'})}
  else if(i===10){track('view_service',{service_name:SV[10]});track('whatsapp_question_click',{link_location:'service_row'})}
  else track('whatsapp_question_click',{link_location:'others_row'})}
 if(e.target.closest('#ac'))track('whatsapp_question_click',{link_location:'academy'});
 if(e.target.closest('#wa3,#again'))track('whatsapp_booking_click',{link_location:'booking_fallback'});
 const p=e.target.closest('[data-product]');if(p)track('view_product',{product_name:p.dataset.product})});

/* booking */
$('#tk').onsubmit=e=>{e.preventDefault();track('whatsapp_booking_click',{link_location:'booking_form'});const d=new FormData(e.target),
 dt=d.get('d').trim(),
 tm=d.get('t').trim(),
 L=['Service: '+d.get('s'),'Date: '+dt,'Time: '+tm,'Name: '+d.get('n').trim()],
 u=wa('Hello KeshCut Studio, I would like to book.\n'+L.join('\n'));
 $('#sum').textContent=L.join('\n');$('#again').href=u;$('#ok').hidden=false;
 const w=window.open(u,'_blank');if(w)w.opener=null;else $('#ok').scrollIntoView({block:'nearest'})};
const T=$('#tk'),chk=()=>{if(T.offsetHeight&&T.getBoundingClientRect().top<innerHeight*.85){T.classList.add('in');removeEventListener('scroll',chk);removeEventListener('resize',chk)}};
RM?T.classList.add('in'):(addEventListener('scroll',chk,{passive:true}),addEventListener('resize',chk),chk());
T.addEventListener('animationend',()=>{T.style.animation='none';T.style.clipPath='none'});

/* navigation with comb and scissors */
const W=$('#wipe');for(let i=0;i<14;i++){const t=document.createElement('i');t.style.cssText=`top:${i*7.143}%;height:5.4%`;W.appendChild(t)}
let busy=0;
async function swapComb(fn){
 if(busy)return;busy=1;W.style.display='block';const S=$('#sc'),o={fill:'forwards',easing:'cubic-bezier(.7,0,.3,1)'};
 await W.animate([{transform:'translateX(-110%)'},{transform:'translateX(0)'}],{...o,duration:380}).finished;
 fn();S.style.opacity=1;
 const sn=(g,a)=>g.animate([{transform:'rotate(0deg)'},{transform:`rotate(${a}deg)`}],{duration:110,iterations:4,direction:'alternate',easing:'ease-in-out'}).finished;
 await Promise.all([sn($('#b1'),-14),sn($('#b2'),14)]);S.style.opacity=0;
 await W.animate([{transform:'translateX(0)'},{transform:'translateX(110%)'}],{...o,duration:380}).finished;
 W.style.display='none';busy=0}
/* paper cut transition: 3D scissors cut the sheet, both halves fold back to reveal the next page */
let cutGo=null;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function swap(fn){if(RM){fn();return}if(cutGo&&!busy)return cutGo(fn);return swapComb(fn)}
const BEND='uniform float uCut,uFold,uOut,uLag,uH;vec3 bend(vec3 p){float g=smoothstep(0.,1.,(uCut-p.x)/uLag)*mix(.16,1.,uFold);float s=uH-p.y;vec3 q=vec3(p.x,uH,0.);float ds=s/12.;for(int i=0;i<12;i++){float r=(float(i)+.5)/12.*s/uH;float a=3.14159*clamp(g*(.12+.88*r)*1.3,0.,1.);q+=vec3(0.,-cos(a),sin(a))*ds;}q.y+=uOut*uH*1.15;return q;}';
const CPV=BEND+'varying vec3 vN;varying float vY,vG;void main(){float e=uH*.01;vec3 p=position,b=bend(p);vec3 n=normalize(cross(bend(p+vec3(e,0.,0.))-b,bend(p+vec3(0.,e,0.))-b));vN=normalMatrix*n;vY=uH-p.y;vG=smoothstep(0.,1.,(uCut-p.x)/uLag);gl_Position=projectionMatrix*modelViewMatrix*vec4(b,1.);}';
const CPF='uniform float uH;varying vec3 vN;varying float vY,vG;float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec3 n=normalize(vN);bool f=gl_FrontFacing;if(!f)n=-n;float d=dot(n,normalize(vec3(-.4,.55,.75)))*.5+.5;vec3 c=(f?vec3(.97,.96,.94):vec3(.84,.83,.81))*(.48+.6*d*d)+(hs(floor(gl_FragCoord.xy*.7))-.5)*.03;c*=1.-.22*smoothstep(uH-.03,uH,vY)*smoothstep(0.,.15,vG);gl_FragColor=vec4(c,1.);}';
const CSV=BEND+'uniform float uSY;varying float vA;void main(){vec3 b=bend(position);vA=.34*(1.-clamp(b.z/3.,0.,1.));gl_Position=projectionMatrix*modelViewMatrix*vec4(b.xy+vec2(.35,-.45*uSY)*b.z,-.01,1.);}';
const CSF='varying float vA;void main(){gl_FragColor=vec4(0.,0.,0.,vA);}';
function prepCut(){try{
 const cv=document.createElement('canvas');if(!cv.getContext('webgl2'))return;
 cv.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;z-index:60;pointer-events:none;opacity:0;display:none;transition:opacity .22s';
 const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setClearColor(0,0);R.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;R.outputEncoding=THREE.sRGBEncoding;document.body.appendChild(cv);
 /* studio-style reflections for the steel */
 const ec=document.createElement('canvas');ec.width=512;ec.height=256;const e2=ec.getContext('2d'),gr=e2.createLinearGradient(0,0,0,256);
 gr.addColorStop(0,'#8d949e');gr.addColorStop(.5,'#2a2d33');gr.addColorStop(1,'#07080a');e2.fillStyle=gr;e2.fillRect(0,0,512,256);
 e2.fillStyle='#fff';e2.fillRect(60,30,120,50);e2.fillRect(300,20,160,36);e2.fillStyle='#cfd8e6';e2.fillRect(220,100,24,110);
 const et=new THREE.CanvasTexture(ec);et.encoding=THREE.sRGBEncoding;const pmg=new THREE.PMREMGenerator(R),env=pmg.fromEquirectangular(et).texture;pmg.dispose();
 const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,60),key=new THREE.DirectionalLight(0xffffff,1.6);key.position.set(-3,4,6);sc.add(key,new THREE.AmbientLight(0xffffff,.25));
 /* scissors, built from extruded blades, ring handles and a pivot screw */
 const ext=(pts,d,b)=>{const g=new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(q=>new THREE.Vector2(q[0],q[1]))),{depth:d,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:2});g.translate(0,0,-d/2);return g};
 const steel=new THREE.MeshStandardMaterial({color:0xdfe3e8,metalness:1,roughness:.17,envMap:env,envMapIntensity:1.5});
 const dark=new THREE.MeshPhysicalMaterial({color:0x0c0c0d,metalness:.25,roughness:.38,clearcoat:1,clearcoatRoughness:.12,envMap:env,envMapIntensity:1.2});
 const half=(z,sg)=>{const o=new THREE.Group(),bl=new THREE.Mesh(ext([[1.05,0],[.12,.085],[-.05,.095],[-.3,-.02],[-.3,-.075],[-.05,-.035],[0,0]],.035,.007),steel),
  ha=new THREE.Mesh(ext([[-.3,-.02],[-.3,-.075],[-.78,-.17],[-.78,-.1]],.035,.01),dark),ri=new THREE.Mesh(new THREE.TorusGeometry(.17,.034,14,40),dark);
  ri.position.set(-.9,-.25,0);ri.scale.y=.88;o.add(bl,ha,ri);o.position.z=z;o.scale.y=sg;return o};
 const S=new THREE.Group(),A=half(.03,1),B=half(-.03,-1),sw=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.19,24),steel),hd=new THREE.Mesh(new THREE.CylinderGeometry(.062,.062,.02,24),steel);
 sw.rotation.x=hd.rotation.x=Math.PI/2;hd.position.z=.1;S.add(A,B,sw,hd);sc.add(S);
 const draw=()=>R.render(sc,cam);
 /* paper: two halves that bend away from the cut, plus their soft shadows */
 const U={uCut:{value:-1e3},uFold:{value:0},uOut:{value:0},uLag:{value:2},uH:{value:3}};
 const pap=new THREE.ShaderMaterial({uniforms:U,vertexShader:CPV,fragmentShader:CPF,side:THREE.DoubleSide});
 const shd=sy=>new THREE.ShaderMaterial({uniforms:Object.assign({uSY:{value:sy}},U),vertexShader:CSV,fragmentShader:CSF,transparent:true,depthWrite:false,side:THREE.DoubleSide});
 const mk=(m,fl)=>{const o=new THREE.Mesh(new THREE.PlaneGeometry(1,1),m);o.frustumCulled=false;if(fl)o.scale.y=-1;sc.add(o);return o};
 const meshes=[mk(pap),mk(pap,1)];if(CFG.paperFoldShadow!==false)meshes.push(mk(shd(1)),mk(shd(-1),1));
 let pg,lastA=0,Hw=6,Ww=6,scl=1;
 const build=a=>{Ww=Hw*a;U.uH.value=Hw/2;U.uLag.value=Ww*.3+.6;pg&&pg.dispose();pg=new THREE.PlaneGeometry(Ww,Hw/2,110,36);pg.translate(0,Hw/4,0);meshes.forEach(m=>m.geometry=pg)};
 const setup=()=>{const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.position.set(0,0,3/Math.tan(THREE.MathUtils.degToRad(17.5)));cam.updateProjectionMatrix();
  if(Math.abs(w/h-lastA)>.001){lastA=w/h;build(lastA)}scl=Math.min(Ww*(isMob()?.5:.6),3.2)/2.15;S.scale.setScalar(scl)};
 const cl=v=>Math.min(1,Math.max(0,v)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 const upd=t=>{const tr=cl(t/.95),e=tr<.5?2*tr*tr:1-Math.pow(-2*tr+2,2)/2,xp=-(Ww/2+1.15*scl)+e*(Ww+2.3*scl);
  U.uCut.value=xp+.75*scl+U.uLag.value*cl((tr-.8)/.2);U.uFold.value=ease(cl((t-.78)/.55));U.uOut.value=Math.pow(cl((t-1.22)/.33),2);
  const c=.5+.5*Math.cos(t*Math.PI*8.4),th=.05+.27*Math.pow(c,1.4);A.rotation.z=th;B.rotation.z=-th;
  S.position.set(xp,Math.sin(t*14)*.012,.28);S.rotation.set(-.55,.16+Math.sin(t*6)*.03,Math.sin(t*9)*.015);};
 cutGo=async fn=>{busy=1;let done=0;
  try{setup();upd(0);draw();cv.style.display='block';void cv.offsetWidth;cv.style.opacity=1;await wait(240);fn();done=1;
   const t0=performance.now();
   await new Promise(res=>{const tk=n=>{try{const t=(n-t0)/1000;upd(t);draw();t<1.6?requestAnimationFrame(tk):res()}catch(x){cutGo=null;res()}};requestAnimationFrame(tk)})}
  catch(x){if(!done)fn();cutGo=null}
  finally{cv.style.opacity=0;cv.style.display='none';busy=0}};
}catch(x){cutGo=null}}

/* class videos: one player in a modal, the file loads only when a clip is chosen */
const VD=$('#vid'),VV=VD.querySelector('video');
function closeVid(){VD.close?VD.close():VD.removeAttribute('open');stopVid()}
function stopVid(){VV.pause();VV.removeAttribute('src');VV.load();document.documentElement.classList.remove('lock')}
document.addEventListener('click',e=>{const c=e.target.closest('.clip');if(!c)return;$('#vid-t').textContent=c.dataset.title;VV.poster=c.dataset.poster;VV.src=c.dataset.src;
 VD.showModal?VD.showModal():VD.setAttribute('open','');document.documentElement.classList.add('lock');VV.play().catch(()=>{})});
VD.addEventListener('close',stopVid);VD.addEventListener('click',e=>{if(e.target===VD)closeVid()});VD.querySelector('.lg-x').onclick=closeVid;

/* navigation: sections scroll with the transition, policies open in one modal (still one page) */
const LEGAL={privacy:'privacy',terms:'terms',cookies:'cookies','booking-policy':'booking'};
const LG=$('#legal'),TABS=[...LG.querySelectorAll('[role=tab]')],PANES=[...LG.querySelectorAll('[role=tabpanel]')];
function pick(id){TABS.forEach(t=>{const on=t.dataset.tab===id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});PANES.forEach(p=>p.hidden=p.dataset.tab!==id);LG.querySelector('.lg-body').scrollTop=0}
function openLegal(id){pick(id);if(!LG.open){LG.showModal?LG.showModal():LG.setAttribute('open','')}document.documentElement.classList.add('lock')}
function closeLegal(){LG.close?LG.close():LG.removeAttribute('open');document.documentElement.classList.remove('lock')}
LG.addEventListener('close',()=>document.documentElement.classList.remove('lock'));
LG.addEventListener('click',e=>{if(e.target===LG)closeLegal()});
LG.querySelector('.lg-x').onclick=closeLegal;
TABS.forEach((t,i)=>{t.onclick=()=>pick(t.dataset.tab);t.onkeydown=e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){const n=TABS[(i+d+TABS.length)%TABS.length];pick(n.dataset.tab);n.focus()}}});
const nav=h=>{const k=h.slice(1);if(LEGAL[k]){openLegal(LEGAL[k]);return}swap(()=>{const e=k&&document.getElementById(k);e?e.scrollIntoView():scrollTo(0,0)})};
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href^="#"]');if(a){e.preventDefault();nav(a.getAttribute('href'))}});
const fromHash=()=>{const k=location.hash.slice(1);if(LEGAL[k])openLegal(LEGAL[k])};
addEventListener('hashchange',fromHash);addEventListener('load',fromHash);

/* hero: visibility, tilt (mouse on desktop, gyroscope on phones; iPhone asks once on the first tap) */
const isMob=()=>document.documentElement.dataset.dev==='mobile';
let inView=true,sync=()=>{},PX=0,PY=0;
new IntersectionObserver(([e])=>{inView=e.isIntersecting;sync()}).observe($('#hero'));
document.addEventListener('visibilitychange',()=>sync());
if(!RM){
 const fg=$('.fg'),D=window.DeviceOrientationEvent,cl=v=>Math.max(-1,Math.min(1,v));let tx=0,ty=0,cx=0,cy=0;
 addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){tx=(e.clientX/innerWidth-.5)*2;ty=(e.clientY/innerHeight-.5)*2}});
 const on=e=>{if(e.gamma!=null){tx=cl(e.gamma/25);ty=cl((e.beta-45)/25)}};
 if(D&&typeof D.requestPermission==='function')$('#hero').addEventListener('click',()=>{D.requestPermission().then(s=>{if(s==='granted')addEventListener('deviceorientation',on)}).catch(()=>{})},{once:true});
 else if(D&&matchMedia('(pointer:coarse)').matches)addEventListener('deviceorientation',on);
 (function loop(){requestAnimationFrame(loop);if(!inView)return;cx+=(tx-cx)*.06;cy+=(ty-cy)*.06;PX=cx;PY=cy;fg.style.transform=`perspective(900px) rotateY(${cx*4}deg) rotateX(${-cy*4}deg)`})();
}

/* hero: 3D card gallery and glass title (loads after first paint, skipped on reduced motion or low power) */
const TXT='KeshCut Studio';
const VS='uniform float f;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z-=dot(p.xy,p.xy)*f*.6+sin(p.x*6.+f*3.)*.015*abs(f);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}';
const FS='uniform sampler2D map;uniform float o;varying vec2 vUv;void main(){vec4 c=texture2D(map,vUv);gl_FragColor=vec4(vec3(dot(c.rgb,vec3(.299,.587,.114))*.45),c.a*o);}';
const BGV='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const BGF='uniform sampler2D map;uniform vec2 fr;varying vec2 vUv;void main(){vec2 uv=vec2((1.-fr.x)*.5+vUv.x*fr.x,1.-((1.-fr.y)*.6+(1.-vUv.y)*fr.y));vec3 c=texture2D(map,uv).rgb;gl_FragColor=vec4(vec3(dot(c,vec3(.2126,.7152,.0722))*.38),1.);}';
const GV='varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
const GF='uniform sampler2D T,B,bg;uniform vec2 px,res;varying vec2 vUv;'+
'void main(){float a=texture2D(T,vUv).a;if(a<.004)discard;vec2 e=px;'+
'vec2 g=vec2(texture2D(B,vUv+vec2(e.x,0.)).a-texture2D(B,vUv-vec2(e.x,0.)).a,texture2D(B,vUv+vec2(0.,e.y)).a-texture2D(B,vUv-vec2(0.,e.y)).a);'+
'float h=clamp(texture2D(B,vUv).a*1.5,0.,1.);vec2 s=gl_FragCoord.xy/res;'+
'vec3 c=texture2D(bg,s+g*.2).rgb;float rim=1.-smoothstep(.15,.7,h);'+
'vec3 n=normalize(vec3(-g*9.,1.));float sp=pow(max(dot(n,normalize(vec3(-.5,.6,.65))),0.),28.);'+
'gl_FragColor=vec4(c*.9+vec3(.2+.5*rim+.55*sp),a);}';
function gl(){
 const host=$('#gl'),hero=$('#hero'),c=document.createElement('canvas');if(!c.getContext('webgl2'))return;
 const R=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});R.setClearColor(0,0);R.autoClear=false;R.setPixelRatio(Math.min(devicePixelRatio||1,isMob()?1.5:2));
 const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100),oc=new THREE.OrthographicCamera(0,1,1,0,-1,1),uRes=new THREE.Vector2();host.appendChild(c);
 const rt=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
 /* poster drawn into the refraction pass so the glass title can bend it */
 const bgS=new THREE.Scene(),pm=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{map:{value:null},fr:{value:new THREE.Vector2(1,1)}},vertexShader:BGV,fragmentShader:BGF}),bq=new THREE.Mesh(new THREE.PlaneGeometry(2,2),pm);
 bq.frustumCulled=false;bgS.add(bq);let pa=.56;
 const pu=(getComputedStyle(document.documentElement).getPropertyValue('--p1').match(/url\(["']?([^"')]+)/)||[])[1];
 if(pu)new THREE.TextureLoader().load(pu,t=>{pm.uniforms.map.value=t;pa=t.image.width/t.image.height;fit()});
 /* glass title */
 const gm=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,uniforms:{T:{value:null},B:{value:null},bg:{value:rt.texture},px:{value:new THREE.Vector2()},res:{value:uRes}},vertexShader:GV,fragmentShader:GF});
 const gq=new THREE.Mesh(new THREE.PlaneGeometry(1,1),gm),gS=new THREE.Scene();gq.visible=false;gq.frustumCulled=false;gS.add(gq);
 let sx=1,W=1,H=1,gx=0,gy=0,okF=false;
 function layout(){
  const fg=$('.fg'),h1=$('.fg h1');if(!okF||!fg.offsetWidth||!h1.offsetWidth)return;
  const cs=getComputedStyle(h1),fpx=parseFloat(cs.fontSize),s=Math.min(2,Math.max(1,R.getPixelRatio()));
  gx=fg.offsetLeft+h1.offsetLeft+h1.offsetWidth/2;gy=fg.offsetTop+h1.offsetTop+h1.offsetHeight/2;
  const F=`${cs.fontWeight} ${fpx*s}px "Cormorant Garamond",Georgia,serif`,m=document.createElement('canvas').getContext('2d');m.font=F;
  const k=Math.max(3,fpx*s*.05),pad=fpx*s*.3,w=Math.ceil(m.measureText(TXT).width+pad*2),h=Math.ceil(fpx*s*1.4+pad*2);
  const mk=bl=>{const q=document.createElement('canvas');q.width=w;q.height=h;const x=q.getContext('2d');x.font=F;x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';
   if(bl){x.shadowColor='#fff';x.shadowBlur=fpx*s*.1;x.shadowOffsetX=w*2;x.fillText(TXT,w/2-w*2,h/2)}else x.fillText(TXT,w/2,h/2);
   const t=new THREE.CanvasTexture(q);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t};
  ['T','B'].forEach(n=>gm.uniforms[n].value&&gm.uniforms[n].value.dispose());
  gm.uniforms.T.value=mk(0);gm.uniforms.B.value=mk(1);gm.uniforms.px.value.set(k/w,k/h);gq.scale.set(w/s,h/s,1);gq.visible=true}
 const fit=()=>{W=host.clientWidth;H=host.clientHeight;if(!W||!H)return;R.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();sx=Math.min(1,cam.aspect);
  const pr=R.getPixelRatio();rt.setSize(Math.max(2,W*pr*.6|0),Math.max(2,H*pr*.6|0));R.getDrawingBufferSize(uRes);
  oc.right=W;oc.top=H;oc.updateProjectionMatrix();const va=W/H;pm.uniforms.fr.value.set(Math.min(1,va/pa),Math.min(1,pa/va));layout()};
 new ResizeObserver(fit).observe(host);fit();
 Promise.all(document.fonts?['500','600'].map(w=>document.fonts.load(w+' 48px "Cormorant Garamond"')):[]).catch(()=>{}).then(()=>{okF=true;layout()});
 /* cards */
 const k=document.createElement('canvas');k.width=480;k.height=640;const g=k.getContext('2d');
 g.fillStyle='#8c8c8c';g.fillRect(0,0,480,640);g.strokeStyle='#d0d0d0';g.lineWidth=2;g.strokeRect(18,18,444,604);
 const P=new THREE.CanvasTexture(k),geo=new THREE.PlaneGeometry(1,1,16,16),RNG=40,XY=[[-3.6,1.2],[3.4,-1.4],[-1.4,-2.2],[4.2,2],[-4.4,-.6],[1.2,2.4],[2.4,-2.6]];
 const ps=CARDS.map((src,i)=>{
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{map:{value:P},o:{value:0},f:{value:0}},vertexShader:VS,fragmentShader:FS}),m=new THREE.Mesh(geo,mat);sc.add(m);
  const p={m,mat,a:.75,x:XY[i%7][0],y:XY[i%7][1],z:RNG/CARDS.length*i};
  if(src)new THREE.TextureLoader().load(src,t=>{mat.uniforms.map.value=t;p.a=t.image.width/t.image.height});
  return p});
 let v=0,last=0,lastY=0,run=false,f1=0,f2=0;
 const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
 const frame=t=>{if(!run)return;requestAnimationFrame(frame);
  const dt=Math.min((t-last)/1000,.1);last=t;const MS=isMob()?.8:1;
  v+=(scrollY-lastY)*.01+.3*dt;lastY=scrollY;v=Math.max(-3,Math.min(3,v))*Math.pow(.95,dt*60);
  ps.forEach(p=>{p.z=((p.z+v*dt*10)%RNG+RNG)%RNG;p.m.position.set(p.x*sx,p.y,p.z-RNG);p.m.scale.set(4*MS*p.a,4*MS,1);const n=p.z/RNG;
   p.mat.uniforms.o.value=sm(0,.25,n)*(1-sm(.78,.95,n));p.mat.uniforms.f.value=v*.5});
  gq.position.set(gx+PX*8,H-gy-PY*5,0);
  R.setRenderTarget(rt);R.clear();R.render(bgS,oc);R.render(sc,cam);
  R.setRenderTarget(null);R.clear();R.render(sc,cam);R.render(gS,oc);
  if(!f1){f1=1;host.classList.add('on')}
  if(gq.visible&&!f2){f2=1;hero.classList.add('glx')}};
 sync=()=>{const r=inView&&!document.hidden;if(r&&!run){run=true;last=performance.now();lastY=scrollY;requestAnimationFrame(frame)}else if(!r)run=false};
 sync()}
const low=(navigator.connection&&navigator.connection.saveData)||navigator.deviceMemory<=2||navigator.hardwareConcurrency<=2;
if(!RM&&!low)addEventListener('load',()=>{const go=()=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=()=>{gl();setTimeout(prepCut,500)};document.head.appendChild(s)};'requestIdleCallback' in window?requestIdleCallback(go,{timeout:2500}):setTimeout(go,800)});
