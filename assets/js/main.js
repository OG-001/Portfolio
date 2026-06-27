/* =========================================================
   MultiChat LLM Portfolio — main.js
   Scroll animations · Tab switching · Counter animation · Nav
   ========================================================= */

"use strict";

// ── Scroll-triggered fade-in ───────────────────────────────
function initScrollAnimations() {
  const items = document.querySelectorAll(".fade-in");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

// ── Generic tab switching ─────────────────────────────────
function initAllTabGroups() {
  // Find every .arch-tabs container on the page
  document.querySelectorAll(".arch-tabs").forEach((tabBar) => {
    const container = tabBar.closest(".arch-container");
    if (!container) return;

    tabBar.querySelectorAll(".arch-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        // Deactivate all tabs in this bar
        tabBar.querySelectorAll(".arch-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Hide all panels in this container
        const panelId = tab.getAttribute("data-panel");
        container.querySelectorAll(".arch-panel").forEach((p) => p.classList.remove("active"));

        const target = document.getElementById("panel-" + panelId);
        if (target) target.classList.add("active");
      });
    });
  });
}

// ── Counter animation for hero stats ──────────────────────
function animateCounter(el, target, duration) {
  const isPercent = String(target).includes("%");
  const isPlus    = String(target).includes("+");
  const raw = parseInt(String(target).replace(/[^0-9]/g, ""), 10);
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * raw);
    el.textContent = current + (isPlus ? "+" : "") + (isPercent ? "%" : "");
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initCounters() {
  const statValues = document.querySelectorAll(".hero-stat-value");
  if (!statValues.length) return;

  const triggered = { done: false };
  const observer = new IntersectionObserver(
    (entries) => {
      if (triggered.done) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggered.done = true;
          statValues.forEach((el) => {
            const text = el.textContent.trim();
            animateCounter(el, text, 1200);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  // Observe the first stat value as the trigger
  observer.observe(statValues[0]);
}

// ── Navbar: add shadow on scroll ───────────────────────────
function initNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  let last = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > 30) {
        nav.classList.add("nav--scrolled");
      } else {
        nav.classList.remove("nav--scrolled");
      }

      // Hide nav on fast scroll down, show on scroll up
      if (y > last && y > 200) {
        nav.classList.add("nav--hidden");
      } else {
        nav.classList.remove("nav--hidden");
      }
      last = y;
    },
    { passive: true }
  );
}

// ── Smooth scroll for nav links ────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// ── Active nav link highlight ──────────────────────────────
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

// ── Entry point ────────────────────────────────────────────
function init() {
  initScrollAnimations();
  initAllTabGroups();
  initCounters();
  initNavScroll();
  initSmoothScroll();
  initActiveNavHighlight();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* ═══════════════════════════════════════════
   UNIFIED PORTFOLIO — RAGBRAIN + MULTICHAT
   ═══════════════════════════════════════════ */

// ── Hero canvas particles ──
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,102,241,0.55)';
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.18 * (1 - d / 100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Typewriter ──
function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrases = [
    'Frontend Engineer',
    'Microfrontend Architect',
    'React & TypeScript Developer',
    'AI Platform Builder'
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci >= phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci <= 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
    }
    setTimeout(tick, deleting ? 45 : 80);
  }
  setTimeout(tick, 600);
}

// ── Skill bars (scroll reveal) ──
function initSkillBars() {
  const fills = document.querySelectorAll('.sk-fill[data-w]');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
}

// ── Mobile nav ──
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

// ── Copy email ──
function copyEmail() {
  // Replace with actual email address before deploying
  const email = 'og.eleodimuo@gmail.com';
  const btn   = document.getElementById('emailBtnText');
  navigator.clipboard.writeText(email).then(() => {
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy Email'; }, 2500); }
  }).catch(() => {
    if (btn) { btn.textContent = 'See footer'; }
  });
}

// ── Wire up on DOMContentLoaded ──
(function extendInit() {
  document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initTypewriter();
    initSkillBars();
    initMobileNav();
  });
})();
