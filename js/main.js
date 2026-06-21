// ============================================
// PORTFOLIO JS - Rakesh Akunuri
// ============================================

// ---- Nav Active State & Mobile Toggle ----
function initNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  const links     = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

// ---- Scroll Reveal ----
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ---- Skill Bars ----
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
}

// ---- Typewriter Effect ----
function typewriter(el, texts, speed = 80, pause = 2200) {
  let ti = 0, ci = 0, deleting = false;
  function tick() {
    const text = texts[ti];
    el.textContent = deleting ? text.slice(0, ci--) : text.slice(0, ci++);
    if (!deleting && ci > text.length) {
      deleting = true;
      setTimeout(tick, pause);
      return;
    }
    if (deleting && ci < 0) {
      deleting = false;
      ti = (ti + 1) % texts.length;
      ci = 0;
    }
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
}

// ---- Particle / Matrix Rain Canvas ----
function initMatrixCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const cols  = Math.floor(canvas.width / 18);
  const drops = Array(cols).fill(1);
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@!<>{}[]\\/*&^%';

  function draw() {
    ctx.fillStyle = 'rgba(2,4,8,0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '13px Share Tech Mono, monospace';

    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const x  = i * 18;
      // Head char: brighter
      const brightness = Math.random();
      if (brightness > 0.96) {
        ctx.fillStyle = '#ffffff';
      } else if (brightness > 0.85) {
        ctx.fillStyle = '#00f5ff';
      } else {
        ctx.fillStyle = 'rgba(0,245,255,0.35)';
      }
      ctx.fillText(ch, x, y * 18);
      if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  let raf;
  function loop() { draw(); raf = requestAnimationFrame(loop); }
  loop();

  // pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
}

// ---- 3D Hex Globe (Three.js style via CSS 3D) ----
function initHexOrbCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let angle = 0;
  const cx = () => canvas.width / 2;
  const cy = () => canvas.height / 2;
  const R  = () => Math.min(canvas.width, canvas.height) * 0.38;

  // Generate lat/lon points on sphere
  const points = [];
  for (let lat = -80; lat <= 80; lat += 20) {
    for (let lon = 0; lon < 360; lon += 20) {
      points.push({ lat: lat * Math.PI / 180, lon: lon * Math.PI / 180 });
    }
  }

  function project(lat, lon, rotY) {
    const x3 = Math.cos(lat) * Math.sin(lon + rotY);
    const y3 = Math.sin(lat);
    const z3 = Math.cos(lat) * Math.cos(lon + rotY);
    return { x: cx() + R() * x3, y: cy() - R() * y3, z: z3 };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw globe wireframe lines
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath();
      let first = true;
      for (let lon = 0; lon <= 360; lon += 5) {
        const p = project(lat * Math.PI/180, lon * Math.PI/180, angle);
        if (p.z < 0) { first = true; continue; }
        if (first) { ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `rgba(0,245,255,${lat === 0 ? 0.3 : 0.12})`;
      ctx.lineWidth = lat === 0 ? 1.5 : 0.8;
      ctx.stroke();
    }
    // Longitude lines
    for (let lon = 0; lon < 360; lon += 20) {
      ctx.beginPath();
      let first = true;
      for (let lat = -90; lat <= 90; lat += 5) {
        const p = project(lat * Math.PI/180, lon * Math.PI/180, angle);
        if (p.z < 0) { first = true; continue; }
        if (first) { ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(0,245,255,0.1)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Draw dots at intersections
    points.forEach(pt => {
      const p = project(pt.lat, pt.lon, angle);
      if (p.z < 0) return;
      const size = (p.z + 1) * 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${0.2 + p.z * 0.5})`;
      ctx.fill();
    });

    // Glow center
    const grad = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), R());
    grad.addColorStop(0, 'rgba(0,245,255,0.04)');
    grad.addColorStop(0.7, 'transparent');
    ctx.beginPath();
    ctx.arc(cx(), cy(), R(), 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    angle += 0.003;
    requestAnimationFrame(draw);
  }
  draw();
}

// ---- Floating Particles ----
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const N = 60;
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 0.5
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,245,255,0.5)';
      ctx.fill();
    });
    // Connect nearby
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${0.15 * (1 - d / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ---- Terminal Typing Effect ----
function initTerminal(elId, lines, speed = 40) {
  const el = document.getElementById(elId);
  if (!el) return;
  let li = 0, ci = 0;
  el.innerHTML = '';

  function nextLine() {
    if (li >= lines.length) return;
    const line = lines[li];
    const span = document.createElement('div');
    span.className = 'terminal-line';
    el.appendChild(span);

    function typeChar() {
      if (ci < line.length) {
        span.innerHTML = escapeHtml(line.slice(0, ++ci)) + '<span class="cursor">█</span>';
        el.scrollTop = el.scrollHeight;
        setTimeout(typeChar, speed);
      } else {
        span.innerHTML = escapeHtml(line);
        li++;
        ci = 0;
        setTimeout(nextLine, 150);
      }
    }
    typeChar();
  }
  nextLine();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ---- Counter Animation ----
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.count));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ---- Init on DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initSkillBars();
  initCounters();
});
