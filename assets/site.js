/* =========================================================
   SHAU'S INDUSTRIES — motion engine
   3D page shutter · 3D scroll stages · tilt · nav
   ========================================================= */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));

  /* ---------- 3D SHUTTER PAGE TRANSITION ---------- */
  // The shutter markup sits at the top of <body> so it covers the page before first paint.
  const sh = document.querySelector('.shutter');
  const slats = [...sh.querySelectorAll('i')];
  const SLATS = slats.length;
  slats.forEach((s,i) => s.style.transitionDelay = (i*45)+'ms');
  const open = () => sh.classList.add('open');
  // open as soon as the DOM is ready — don't wait for fonts, thumbnails or the 3D scene
  setTimeout(open, 350);
  setTimeout(open, 1500); // safety
  addEventListener('pageshow', e => { if(e.persisted) sh.classList.add('open'); });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if(!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const href = a.getAttribute('href');
    if(!/\.html(#.*)?$/.test(href) || reduce) return;
    e.preventDefault();
    sh.classList.remove('open');
    setTimeout(() => { location.href = href; }, 750 + SLATS*45);
  });

  /* ---------- 3D SCROLL STAGES ---------- */
  const stages = [...document.querySelectorAll('.stage3d')];
  function onScroll(){
    if(reduce) return;
    const H = innerHeight;
    stages.forEach(el => {
      const r = el.getBoundingClientRect();
      const pin = clamp((H - r.top) / (H * .55), 0, 1);           // entering from below
      const pout = clamp(r.bottom / (H * .45), 0, 1);             // leaving at top
      const ei = 1 - Math.pow(1 - pin, 3), eo = 1 - Math.pow(1 - pout, 3);
      const rx = (1 - ei) * 22 - (1 - eo) * 10;
      const ty = (1 - ei) * 110;
      const sc = .9 + .1 * Math.min(ei, eo);
      el.style.transform = `perspective(1400px) translate3d(0,${ty}px,0) rotateX(${rx}deg) scale(${sc})`;
      el.style.opacity = (.15 + .85 * Math.min(ei, eo)).toFixed(3);
    });
    const secs = [...document.querySelectorAll('section[id]')];
    let cur = '';
    secs.forEach(s => { if(s.getBoundingClientRect().top < H * .45) cur = s.id; });
    document.querySelectorAll('.nav ul a[href^="#"]').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    document.dispatchEvent(new CustomEvent('site:scroll'));
  }
  addEventListener('scroll', () => requestAnimationFrame(onScroll), {passive:true});
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- TILT ---------- */
  window.SITE_tilt = function(root){
    if(reduce || !matchMedia('(hover:hover)').matches) return;
    (root || document).querySelectorAll('.tilt').forEach(el => {
      if(el._tilt) return; el._tilt = 1;
      const max = +(el.dataset.tilt || 8);
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1000px) rotateY(${px*max}deg) rotateX(${-py*max}deg)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  };
  SITE_tilt();

  /* ---------- NAV ---------- */
  const tog = document.querySelector('.nav-toggle'), ul = document.querySelector('.nav ul');
  if(tog){ tog.onclick = () => ul.classList.toggle('open'); ul.addEventListener('click', () => ul.classList.remove('open')); }

  /* ---------- PARTICLES (site-wide, difference blend) ---------- */
  window.SITE_particles = function(){
    if(typeof particlesJS === 'undefined') return;
    const d = document.createElement('div'); d.id = 'pfx'; d.className = 'pfx'; document.body.appendChild(d);
    particlesJS('pfx', {
      particles:{
        number:{value: innerWidth < 700 ? 34 : 70, density:{enable:true, value_area:1100}},
        color:{value:'#ffffff'},
        shape:{type:['circle','edge'], stroke:{width:0}},
        opacity:{value:.55, random:true, anim:{enable:true, speed:.4, opacity_min:.15}},
        size:{value:1.9, random:true},
        line_linked:{enable:true, distance:140, color:'#ffffff', opacity:.16, width:1},
        move:{enable:!reduce, speed:.55, direction:'none', random:true, out_mode:'out'}
      },
      interactivity:{
        detect_on:'window',
        events:{onhover:{enable:true, mode:['grab','bubble']}, onclick:{enable:true, mode:'repulse'}, resize:true},
        modes:{grab:{distance:180, line_linked:{opacity:.5}}, bubble:{distance:120, size:3.4, duration:1.2, opacity:.9}, repulse:{distance:160, duration:.6}}
      },
      retina_detect:true
    });
  };

  /* ---------- SPLIT TEXT INTO 3D LETTERS ---------- */
  window.SITE_split = function(el){
    let i = 0;
    (function walk(node){
      [...node.childNodes].forEach(n => {
        if(n.nodeType === 3){
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if(!part) return;
            if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            [...part].forEach(c => { const ch = document.createElement('span'); ch.className = 'ch'; ch.style.setProperty('--i', i++); ch.textContent = c; w.appendChild(ch); });
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if(n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
    el.classList.add('split3d');
  };
  document.querySelectorAll('[data-split]').forEach(SITE_split);

  /* ---------- ODOMETER ---------- */
  document.querySelectorAll('[data-odo]').forEach((el, k) => {
    const txt = el.textContent; el.textContent = ''; el.classList.add('odo');
    [...txt].forEach((c, j) => {
      if(/\d/.test(c)){
        const r = document.createElement('span'); r.className = 'reel';
        const st = document.createElement('span'); st.className = 'strip'; st.style.setProperty('--d', (j*90)+'ms');
        for(let n=0;n<=9;n++){ const s = document.createElement('span'); s.textContent = n; st.appendChild(s); }
        st.dataset.v = c; r.appendChild(st); el.appendChild(r);
      } else { const s = document.createElement('span'); s.textContent = c; el.appendChild(s); }
    });
  });

  /* ---------- 3D REVEAL OBSERVER ---------- */
  document.querySelectorAll('[data-stagger]').forEach(p => {
    const step = +p.dataset.stagger || 80;
    [...p.children].forEach((c, i) => c.style.setProperty('--d', (i*step)+'ms'));
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target; el.classList.add('in');
    el.querySelectorAll('.strip').forEach(st => st.style.transform = 'translateY(-' + st.dataset.v + 'em)');
    io.unobserve(el);
  }), {threshold:.18, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('[data-r3d],[data-split],.odo').forEach(el => io.observe(el));
  window.SITE_observe = el => io.observe(el);

  /* ---------- NAV TEXT ROLL ---------- */
  document.querySelectorAll('.nav ul a').forEach(a => {
    const t = a.textContent; a.innerHTML = '<span class="roll" data-t="' + t.replace(/"/g,'&quot;') + '">' + t + '</span>';
  });

  /* ---------- SCROLL CUBE ---------- */
  const sc = document.createElement('div'); sc.className = 'scube';
  sc.innerHTML = '<span class="pct">000</span><div class="c"><i></i><i></i><i></i><i></i><i></i><i></i></div>';
  document.body.appendChild(sc);
  const cube = sc.querySelector('.c'), pct = sc.querySelector('.pct');
  function cubeTick(){
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    cube.style.transform = `rotateX(${-25 + p*360}deg) rotateY(${45 + p*540}deg)`;
    pct.textContent = String(Math.round(p*100)).padStart(3,'0');
  }
  addEventListener('scroll', () => requestAnimationFrame(cubeTick), {passive:true}); cubeTick();
})();
