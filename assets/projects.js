/* =========================================================
   SHAU'S INDUSTRIES — project registry + 3D project cards
   Edit PROJECTS to add / reorder projects. `page` is relative to the site root.
   ========================================================= */
window.PROJECTS = [
  { id:'mips32', code:'P-01', kind:'silicon', viz:'chip', page:'projects/mips32.html',
    title:'MIPS32 Core', line:'A 32-bit processor that grows from single-cycle to Tomasulo out-of-order, with SIMD lanes and an L1 cache.',
    tags:['Verilog','Sky130','Yosys'], stat:['6','generations'], repo:'https://github.com/shausindustries/Mips_32_processor' },
  { id:'m32', code:'P-02', kind:'silicon', viz:'soc', page:'projects/m32-mcu.html',
    title:'M32 Microcontroller', line:'A tape-out-ready 32-bit microcontroller SoC — pipelined core plus UART, I2C, timers and GPIO — taken from RTL to GDSII.',
    tags:['OpenLane','Sky130','RTL→GDSII'], stat:['10,476','std cells'], repo:'https://github.com/shausindustries/M32_MCU' },
  { id:'sram', code:'P-03', kind:'silicon', viz:'cell', page:'projects/sram-6t.html',
    title:'6T SRAM Bitcell', line:'A full-custom, transistor-level layout of a six-transistor memory cell, drawn by hand in Magic VLSI.',
    tags:['Magic VLSI','Ngspice','Sky130'], stat:['6','transistors'], repo:'https://github.com/shausindustries/6TSRAMBitcell' },
  { id:'toy', code:'P-04', kind:'silicon', viz:'bits', page:'projects/toy-processor.html',
    title:'Toy Processor', line:'A custom 8-bit processor with its own instruction set and datapath — published on Zenodo.',
    tags:['Verilog','Vivado','DOI'], stat:['8','bit ISA'], repo:'https://github.com/shausindustries/ToyProcessor' },
  { id:'arm', code:'Y-01', kind:'youtube', viz:'arm', page:'projects/robotic-arm.html',
    title:'Robotic Arm', line:'A 3D-printed, six-servo arm — gesture-controlled over ESP-NOW, then driven from a phone gamepad.',
    tags:['ESP32-C3','ESP-NOW','3D printed'], stat:['6','servos'], yt:'pII1wAtHmyI' },
  { id:'lumin', code:'Y-02', kind:'youtube', viz:'hilt', page:'projects/lumin-hilt.html',
    title:'Lumin — The Hilt', line:'Chapter I: an electronic light-and-sound hilt with an Arduino Nano, a DFPlayer, a custom KiCad PCB and a PVC body.',
    tags:['Arduino','KiCad','PVC'], stat:['I','chapter'], yt:'Q3F3UJN1tBo' }
];

(function(){
  const V = {
    chip:`<g class="l1"><path d="M100 30 L170 70 L100 110 L30 70 Z" class="fill"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${36+i*8} ${73+i*4.5} l-6 3.5" /><path d="M${164-i*8} ${73+i*4.5} l6 3.5"/>`).join('')}</g>
          <g class="l2">${[0,1,2,3,4,5].map(i=>`<path class="blk" style="--i:${i}" d="M${70+i*6} ${58+i*4} l14 -8 l14 8 l-14 8 Z"/>`).join('')}</g>
          <g class="l3"><path d="M100 46 L148 70 L100 94 L52 70 Z" class="dash"/></g>`,
    soc:`<g class="l1"><rect x="35" y="22" width="130" height="106" class="fill"/></g>
         <g class="l2"><rect x="45" y="32" width="44" height="34"/><text x="67" y="53">CPU</text><rect x="111" y="32" width="44" height="34"/><text x="133" y="53">RAM</text>
         <rect x="45" y="86" width="22" height="32"/><rect x="72" y="86" width="22" height="32"/><rect x="106" y="86" width="22" height="32"/><rect x="133" y="86" width="22" height="32"/>
         <path d="M45 76 H155" class="bus"/><path d="M67 66 V76 M133 66 V76 M56 76 V86 M83 76 V86 M117 76 V86 M144 76 V86"/></g>
         <g class="l3">${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect class="pin" style="--i:${i}" x="${41+i*12}" y="128" width="5" height="8"/>`).join('')}</g>`,
    cell:`<g class="l1"><rect x="30" y="20" width="140" height="110" class="fill"/></g>
          <g class="l2"><path d="M70 40 V60 M70 90 V110 M130 40 V60 M130 90 V110 M60 60 H80 M60 90 H80 M120 60 H140 M120 90 H140"/>
          <path d="M70 60 V90 M130 60 V90" class="dash"/><path d="M70 75 H95 L105 75 M130 75 H105" /><path d="M80 75 C100 60 110 90 120 75" class="dash"/>
          <path d="M40 30 V120 M160 30 V120" class="bus"/><path d="M40 75 H60 M140 75 H160"/></g>
          <g class="l3"><circle cx="70" cy="75" r="3" class="dot"/><circle cx="130" cy="75" r="3" class="dot d2"/><text x="40" y="26">BL</text><text x="148" y="26">BLB</text></g>`,
    bits:`<g class="l1"><rect x="20" y="50" width="160" height="50" class="fill"/></g>
          <g class="l2">${[0,1,2,3,4,5,6,7].map(i=>`<rect class="bit b${i}" x="${26+i*19}" y="58" width="15" height="34"/>`).join('')}</g>
          <g class="l3"><path d="M26 104 H83" /><path d="M88 104 H121"/><path d="M126 104 H178"/><text x="54" y="118">OP</text><text x="104" y="118">RA</text><text x="152" y="118">IMM</text></g>`,
    arm:`<g class="l1"><ellipse cx="100" cy="128" rx="46" ry="8" class="fill"/><rect x="82" y="104" width="36" height="24"/></g>
         <g class="l2"><g class="armr"><path d="M100 104 L84 64 L124 40" class="link"/><circle cx="100" cy="104" r="5"/><circle cx="84" cy="64" r="5"/><circle cx="124" cy="40" r="4"/>
         <path d="M124 40 l14 4 M124 40 l10 12"/></g></g>
         <g class="l3"><circle cx="150" cy="118" r="7" class="dash"/><text x="150" y="140">TAPE</text></g>`,
    hilt:`<g class="l1"><rect x="34" y="66" width="104" height="18" class="fill"/></g>
          <g class="l2"><rect x="40" y="64" width="40" height="22" class="solid"/>${[0,1,2,3,4,5,6].map(i=>`<path d="M${44+i*5} 64 V86" class="rib"/>`).join('')}<rect x="92" y="63" width="8" height="24"/><rect x="112" y="63" width="8" height="24"/><path d="M138 64 L148 60 V90 L138 86"/><rect x="24" y="64" width="10" height="22"/></g>
          <g class="l3"><path d="M150 75 H190" class="beam"/><circle cx="104" cy="60" r="2.5" class="rec"/></g>`,
    video:`<g class="l1"><rect x="30" y="28" width="140" height="94" class="fill"/></g>
           <g class="l2"><path d="M88 55 L120 75 L88 95 Z" class="solid"/><path d="M30 110 H170" class="dash"/></g>
           <g class="l3"><rect x="30" y="28" width="140" height="94" class="scanbox"/><circle cx="44" cy="40" r="3" class="rec"/><text x="52" y="43">REC</text></g>`
  };
  const css = `
  .pcards{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:20px}
  .pcard{display:flex;flex-direction:column;border:1px solid currentColor;position:relative;transform-style:preserve-3d;background:inherit}
  .pcard .viz{aspect-ratio:4/3;border-bottom:1px solid currentColor;position:relative;overflow:hidden;perspective:900px}
  .pcard .viz svg{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.2;transform-style:preserve-3d;transition:transform .8s var(--ease)}
  .pcard .viz svg g{transition:transform .8s var(--ease)}
  .pcard:hover .viz svg{transform:rotateX(28deg) rotateZ(-8deg) scale(.92)}
  .pcard:hover .viz .l1{transform:translate(0,10px)}
  .pcard:hover .viz .l3{transform:translate(0,-12px)}
  .pcard .viz text{fill:currentColor;stroke:none;font:7px var(--f-mono);letter-spacing:.1em;text-anchor:middle}
  .pcard .viz .fill{fill:currentColor;fill-opacity:.05}
  .pcard .viz .dash{stroke-dasharray:4 4;animation:dash 1.6s linear infinite}
  .pcard .viz .bus{stroke-width:2.4;stroke-dasharray:10 8;animation:dash 1s linear infinite}
  .pcard .viz .blk{animation:blk 3s var(--ease) infinite;animation-delay:calc(var(--i)*.25s);fill:currentColor;fill-opacity:.08}
  .pcard .viz .pin{animation:pin 1.4s steps(2) infinite;animation-delay:calc(var(--i)*.13s);fill:currentColor}
  .pcard .viz .bit{animation:bit 2.4s steps(1) infinite}
  ${[0,1,2,3,4,5,6,7].map(i=>`.pcard .viz .b${i}{animation-delay:${(i*0.37)%2.4}s}`).join('')}
  .pcard .viz .dot{fill:currentColor;animation:pin 2s steps(2) infinite}.pcard .viz .dot.d2{animation-delay:1s}
  .pcard .viz .solid{fill:currentColor}
  .pcard .viz .rec{fill:#e5322d;stroke:none;animation:pin 1.2s steps(2) infinite}
  .pcard .viz .scanbox{stroke-opacity:.2}
  .pcard .viz .link{stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.85}
  .pcard .viz .armr{transform-origin:100px 104px;animation:armr 4s ease-in-out infinite}
  @keyframes armr{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(14deg)}}
  .pcard .viz .rib{stroke:#f4f4f1;stroke-opacity:.35}
  .pcard .viz .beam{stroke-width:6;stroke-linecap:round;stroke:#e5322d;stroke-dasharray:40 40;stroke-dashoffset:40;animation:beam 3s ease-in-out infinite;filter:drop-shadow(0 0 4px #e5322d)}
  @keyframes beam{0%{stroke-dashoffset:40}40%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:40}}
  .pcard .viz::after{content:"";position:absolute;left:0;right:0;height:1px;background:currentColor;opacity:.35;animation:scanv 3.2s linear infinite}
  @keyframes dash{to{stroke-dashoffset:-16}}
  @keyframes blk{0%,100%{fill-opacity:.08}50%{fill-opacity:.6}}
  @keyframes pin{50%{opacity:.15}}
  @keyframes bit{0%{fill:currentColor;fill-opacity:.85}50%{fill-opacity:0}}
  @keyframes scanv{from{top:0}to{top:100%}}
  .pcard .meta{display:flex;justify-content:space-between;font:11px var(--f-mono);letter-spacing:.14em;opacity:.65;padding:16px 20px 0}
  .pcard .bd{padding:10px 20px 22px;display:flex;flex-direction:column;gap:10px;flex:1}
  .pcard h3{font:800 clamp(18px,1.55vw,23px)/1.08 var(--f-head);font-stretch:106%;text-transform:uppercase;overflow-wrap:anywhere;hyphens:auto}
  .pcard p{font-size:15px;opacity:.75}
  .pcard .tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;padding-top:8px}
  .pcard .tg span{font:10px var(--f-mono);letter-spacing:.1em;border:1px solid currentColor;padding:4px 8px;opacity:.75}
  .pcard .go{display:flex;justify-content:space-between;align-items:center;border-top:1px solid currentColor;padding:14px 20px;font:11px var(--f-mono);letter-spacing:.16em}
  .pcard .go b{font:800 20px var(--f-head);font-stretch:118%}
  .pcard .go i{font-style:normal;transition:transform .4s var(--ease)}
  .pcard:hover .go i{transform:translateX(6px)}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  window.renderProjects = function(box, root, filter){
    const list = PROJECTS.filter(p => !filter || filter === 'all' || p.kind === filter);
    box.classList.add('pcards');
    box.innerHTML = list.map((p,i) => `
      <a class="pcard tilt" data-tilt="6" data-r3d="up" style="--d:${i*90}ms" href="${root}${p.page}">
        <div class="viz"><svg viewBox="0 0 200 150">${V[p.viz]}</svg></div>
        <div class="meta"><span>${p.code}</span><span>${p.kind === 'youtube' ? 'YOUTUBE' : 'SILICON'}</span></div>
        <div class="bd"><h3>${p.title}</h3><p>${p.line}</p><div class="tg">${p.tags.map(t=>'<span>'+t+'</span>').join('')}</div></div>
        <div class="go"><span><b>${p.stat[0]}</b> ${p.stat[1].toUpperCase()}</span><i>OPEN →</i></div>
      </a>`).join('');
    box.querySelectorAll('[data-r3d]').forEach(el => window.SITE_observe && SITE_observe(el));
    window.SITE_tilt && SITE_tilt(box);
  };
})();
