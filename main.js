/* ═══════════════════════════════════════════
   GSAP (нативный скролл — без Lenis)
═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* Navbar scrolled class */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ═══════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════ */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.set(cursor, { x: mx, y: my, xPercent: -50, yPercent: -50 });
});

gsap.ticker.add(() => {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  gsap.set(follower, { x: fx, y: fy, xPercent: -50, yPercent: -50 });
});

document.querySelectorAll('a, button, input[type="range"], .service-card, .case-card, .price-card')
  .forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

/* ═══════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════ */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ═══════════════════════════════════════════
   NEURAL CANVAS
═══════════════════════════════════════════ */
const canvas = document.getElementById('neural-canvas');
const ctx    = canvas.getContext('2d');
let nodes = [], mouseX = 0, mouseY = 0;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.getElementById('hero').addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
});

class Node {
  constructor() { this.reset(); this.y = Math.random() * canvas.height; }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = -10;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = Math.random() * 0.3 + 0.1;
    this.r  = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.6 + 0.2;
  }
  update() {
    const dx = mouseX - this.x, dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) { this.vx += (dx / dist) * 0.02; this.vy += (dy / dist) * 0.02; }
    this.x += this.vx; this.y += this.vy;
    this.vx *= 0.99;   this.vy *= 0.99;
    if (this.y > canvas.height + 10) this.reset();
  }
}

for (let i = 0; i < 80; i++) nodes.push(new Node());

function drawNeural() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].update();
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${(1 - d / 130) * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${nodes[i].opacity})`;
    ctx.fill();
  }
  requestAnimationFrame(drawNeural);
}
drawNeural();

/* ═══════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════ */
const words = ['воронку продаж', 'клиентский сервис', 'маркетинг', 'колл-центр', 'CRM процессы', 'контент'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeLoop() {
  const word = words[wi];
  if (!deleting) {
    tw.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 80);
  } else {
    tw.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(typeLoop, 300); return; }
    setTimeout(typeLoop, 40);
  }
}
typeLoop();

/* ═══════════════════════════════════════════
   SCRAMBLE TEXT
═══════════════════════════════════════════ */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

function scramble(el) {
  const original = el.textContent;
  let iter = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < iter)  return original[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iter >= original.length) clearInterval(interval);
    iter += 0.5;
  }, 30);
}

document.querySelectorAll('.service-title').forEach(el => {
  el.addEventListener('mouseenter', () => scramble(el));
});

/* ═══════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ═══════════════════════════════════════════
   RIPPLE EFFECT
═══════════════════════════════════════════ */
function addRipple(e, btn) {
  const r      = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(r.width, r.height);
  ripple.style.width  = ripple.style.height = size + 'px';
  ripple.style.left   = e.clientX - r.left - size / 2 + 'px';
  ripple.style.top    = e.clientY - r.top  - size / 2 + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

/* ═══════════════════════════════════════════
   3D TILT CARDS
═══════════════════════════════════════════ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((x / r.width)  - 0.5) * 14;
    const ry = ((y / r.height) - 0.5) * 14;
    card.style.transform = `perspective(600px) rotateY(${rx}deg) rotateX(${-ry}deg)`;
    card.style.setProperty('--mx', `${(x / r.width)  * 100}%`);
    card.style.setProperty('--my', `${(y / r.height) * 100}%`);
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ═══════════════════════════════════════════
   ROI CALCULATOR
═══════════════════════════════════════════ */
function fmt(n) { return Math.round(n).toLocaleString('ru-RU') + ' ₽'; }

function calcROI() {
  const emp    = +document.getElementById('range-emp').value;
  const hours  = +document.getElementById('range-hours').value;
  const salary = +document.getElementById('range-salary').value;

  document.getElementById('val-emp').textContent    = emp;
  document.getElementById('val-hours').textContent  = hours + ' ч';
  document.getElementById('val-salary').textContent = salary.toLocaleString('ru-RU') + ' ₽';

  const hourlyRate    = salary / 160;
  document.getElementById('hourly-rate').textContent = Math.round(hourlyRate).toLocaleString('ru-RU') + ' ₽/ч';

  const lossPerMonth  = emp * hours * hourlyRate * 22;
  const savePerMonth  = lossPerMonth * 0.85;
  const paybackDays   = Math.round(189000 / (savePerMonth / 30));

  animateValue(document.getElementById('result-loss'),    lossPerMonth, fmt);
  animateValue(document.getElementById('result-save'),    savePerMonth, fmt);
  document.getElementById('result-payback').textContent = paybackDays + ' дней';
}

function animateValue(el, target, format) {
  const startTime = performance.now();
  function update(now) {
    const t    = Math.min((now - startTime) / 600, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = format(target * ease);
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

['range-emp', 'range-hours', 'range-salary'].forEach(id => {
  document.getElementById(id).addEventListener('input', calcROI);
});
calcROI();

/* ═══════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════ */
const techs  = ['GPT-4o', 'Claude', 'Gemini', 'LangChain', 'n8n', 'Make', 'Telegram API', 'WhatsApp', 'Bitrix24', 'AmoCRM', 'Whisper', 'ElevenLabs'];
const track  = document.getElementById('marquee-track');
[...techs, ...techs].forEach(t => {
  const el = document.createElement('div');
  el.className = 'marquee-item';
  el.innerHTML = `<span class="marquee-dot"></span>${t}`;
  track.appendChild(el);
});

/* ═══════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
═══════════════════════════════════════════ */

// Generic reveal
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.fromTo(el, { opacity: 0, y: 50 }, {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
  });
});

// Service cards stagger
gsap.fromTo('.service-card', { opacity: 0, y: 60 }, {
  opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
});

// Case cards stagger
gsap.fromTo('.case-card', { opacity: 0, y: 50 }, {
  opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
  scrollTrigger: { trigger: '.cases-grid', start: 'top 80%' }
});

// Price cards stagger
gsap.fromTo('.price-card', { opacity: 0, y: 50, scale: 0.97 }, {
  opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%' }
});

// Steps slide from left
gsap.utils.toArray('.step').forEach((el, i) => {
  gsap.fromTo(el, { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.12,
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

// Stats scale up
gsap.fromTo('.stat-item', { opacity: 0, scale: 0.85 }, {
  opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.1,
  scrollTrigger: { trigger: '#stats', start: 'top 80%' }
});

// Hero parallax
gsap.to('#neural-canvas', {
  yPercent: 25, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

gsap.to('.hero-content', {
  yPercent: -15, opacity: 0.3, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: '30% top', end: 'bottom top', scrub: true }
});

// How-visual slide from right
gsap.fromTo('.how-visual', { opacity: 0, x: 60 }, {
  opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.how-visual', start: 'top 80%' }
});

// Metric fills
gsap.utils.toArray('.metric-fill').forEach(bar => {
  gsap.fromTo(bar, { width: '0%' }, {
    width: bar.dataset.width + '%', duration: 1.4, ease: 'power2.out',
    scrollTrigger: { trigger: bar, start: 'top 90%' }
  });
});

// FAQ stagger
gsap.fromTo('.faq-item', { opacity: 0, y: 20 }, {
  opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08,
  scrollTrigger: { trigger: '#faq-list', start: 'top 85%' }
});

/* ═══════════════════════════════════════════
   COUNTING NUMBERS
═══════════════════════════════════════════ */
function startCount(el) {
  const target = +el.dataset.target;
  gsap.fromTo({ val: 0 }, { val: target }, {
    duration: 1.8, ease: 'power2.out',
    onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
  });
}

document.querySelectorAll('.count').forEach(el => {
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => startCount(el)
  });
});

/* ═══════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════ */
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ═══════════════════════════════════════════
   PRICING TOGGLE
═══════════════════════════════════════════ */
function setPricing(mode) {
  document.getElementById('toggle-monthly').classList.toggle('active', mode === 'monthly');
  document.getElementById('toggle-annual').classList.toggle('active',  mode === 'annual');
  document.querySelectorAll('.price-amount[data-monthly]').forEach(el => {
    el.textContent = el.dataset[mode === 'monthly' ? 'monthly' : 'annual'];
  });
}

/* ═══════════════════════════════════════════
   EASTER EGG  –  Konami Code
═══════════════════════════════════════════ */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki = 0;

document.addEventListener('keydown', e => {
  ki = (e.key === konami[ki]) ? ki + 1 : 0;
  if (ki === konami.length) { ki = 0; showEasterEgg(); }
});

function showEasterEgg() {
  document.getElementById('easter-egg').classList.add('show');
  spawnParticles();
}

document.getElementById('ee-close').addEventListener('click', () => {
  document.getElementById('easter-egg').classList.remove('show');
});

function spawnParticles() {
  const colors = ['#7c3aed', '#00d4ff', '#00ff88', '#a855f7', '#ff4757'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const p    = document.createElement('div');
      p.className = 'particle';
      const size  = Math.random() * 12 + 4;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}vw; top:${Math.random()*30}vh;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation-duration:${Math.random()+1}s;
        animation-delay:${Math.random()*0.5}s;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }, i * 30);
  }
}
