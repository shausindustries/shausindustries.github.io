/* =========================================================
   SHAU'S INDUSTRIES — project page engine
   Stepper: sticky scroll steps + CRT / decode / scan-wipe card
   Stage:   three.js boilerplate (renderer, resize, visibility, loop)
   ========================================================= */
(function(){
  const GLYPHS = '01ABCDEF<>/#*$%&=+';

  window.Stepper = function(o){
    const card = o.card, count = o.count, ledBox = o.leds, sc = o.scroller, steps = o.steps, N = steps.length;
    ledBox.innerHTML = steps.map(() => '<i></i>').join('');
    const leds = [...ledBox.children];
    let cur = -1, prog = 0, decodeRaf = 0, typeTimer = 0;

    function render(i){
      const g = steps[i];
      card.innerHTML = `<div class="name"></div><div class="para"></div><p class="wipe">${g.text}</p><div class="mods">${(g.tags||[]).map((m,k)=>'<span class="tag" style="--d:'+(700+k*120)+'ms">'+m+'</span>').join('')}</div>`;
      const name = card.querySelector('.name');
      const chars=[]; { let k=0; const ws=g.name.toUpperCase().split(' '); ws.forEach((w,wi)=>{ const wd=document.createElement('span'); wd.className='wd'; [...w].forEach(c=>{ const sp=document.createElement('span'); sp.className='g'; sp.textContent=c; wd.appendChild(sp); chars.push({sp,c,at:120+k*38+Math.random()*90,done:false}); k++; }); name.appendChild(wd); if(wi<ws.length-1) name.appendChild(document.createTextNode(' ')); }); }
      cancelAnimationFrame(decodeRaf); const t0 = performance.now();
      (function tick(){
        const el = performance.now() - t0; let left = 0;
        chars.forEach(c => {
          if(c.done) return;
          if(el >= c.at){ c.done = true; c.sp.textContent = c.c; c.sp.classList.remove('noise'); c.sp.classList.add('lock'); }
          else { left++; c.sp.classList.add('noise'); c.sp.textContent = GLYPHS[Math.random()*GLYPHS.length|0]; }
        });
        if(left) decodeRaf = requestAnimationFrame(tick);
      })();
      const para = card.querySelector('.para'), txt = g.k + ' · ' + g.sub; let n = 0;
      clearInterval(typeTimer);
      typeTimer = setInterval(() => {
        n++; para.innerHTML = txt.slice(0,n) + '<span class="caret"></span>';
        if(n >= txt.length){ clearInterval(typeTimer); setTimeout(() => { const c = para.querySelector('.caret'); if(c) c.remove(); }, 1400); }
      }, 22);
    }

    function set(i){
      if(i === cur) return;
      const first = cur < 0; cur = i;
      count.textContent = steps[i].k + ' / ' + String(N).padStart(2,'0');
      leds.forEach((l,k) => { l.classList.toggle('on', k < i); l.classList.toggle('cur', k === i); });
      o.onChange && o.onChange(i);
      if(first){ render(i); return; }
      card.classList.remove('on'); card.classList.add('off');
      setTimeout(() => { render(i); card.classList.remove('off'); void card.offsetWidth; card.classList.add('on'); }, 300);
    }

    function update(){
      const r = sc.getBoundingClientRect(), total = r.height - innerHeight;
      prog = total > 0 ? Math.max(0, Math.min(.999, -r.top/total)) : 0;
      set(Math.floor(prog*N));
    }
    const mobile = innerWidth <= 980 && !o.forceScroll;
    if(mobile){
      set(0); let k = 0;
      setInterval(() => { k = (k+1)%N; set(k); }, o.interval || 3800);
      if(o.wrap) o.wrap.addEventListener('click', () => { k = (k+1)%N; set(k); });
    } else {
      document.addEventListener('site:scroll', update); addEventListener('scroll', update, {passive:true}); update();
    }
    return { get cur(){ return cur; }, get prog(){ return prog; }, set };
  };

  window.Stage = function(canvas, wrap, o){
    o = o || {};
    if(typeof THREE === 'undefined') return null;
    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(o.fov || 32, 1, .1, 400);
    if(o.fog) scene.fog = new THREE.Fog(o.fog[0], o.fog[1], o.fog[2]);
    const st = { renderer, scene, cam, mx:0, my:0, visible:true, w:1, h:1 };
    function resize(){
      const r = wrap.getBoundingClientRect(); st.w = r.width; st.h = r.height;
      renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height;
      if(o.onResize) o.onResize(st); cam.updateProjectionMatrix();
    }
    resize(); addEventListener('resize', resize);
    addEventListener('mousemove', e => { st.mx = e.clientX/innerWidth - .5; st.my = e.clientY/innerHeight - .5; });
    new IntersectionObserver(es => st.visible = es[0].isIntersecting).observe(wrap);
    const clock = new THREE.Clock();
    st.run = fn => (function loop(){
      requestAnimationFrame(loop);
      if(!st.visible) return;
      const dt = Math.min(clock.getDelta(), .05);
      fn(dt, clock.elapsedTime);
      if(o.shift){
        if(st.w > 900){ const p = window.HERO_P || 0, s = o.shift * (Math.min(1, p*1.8)*2 - 1); st.shiftNow = (st.shiftNow == null ? s : st.shiftNow + (s - st.shiftNow)*.08); cam.setViewOffset(st.w, st.h, st.w*st.shiftNow, 0, st.w, st.h); }
        else cam.clearViewOffset();
      }
      renderer.render(scene, cam);
    })();
    st.edges = (mesh, c, op) => { const l = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({color:c, transparent:true, opacity:op})); mesh.add(l); return l; };
    st.box = (w,h,d,c,opts) => new THREE.Mesh(new THREE.BoxGeometry(w,h,d), new THREE.MeshStandardMaterial(Object.assign({color:c, roughness:.75, metalness:.1}, opts||{})));
    st.label = (el, v3, offY) => {
      const v = v3.clone().project(cam);
      el.style.transform = `translate(${(v.x*.5+.5)*st.w}px,${(-v.y*.5+.5)*st.h}px) translate(-50%,${offY||-140}%)`;
    };
    return st;
  };
})();
