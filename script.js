/* ═══════════════════════════════════════════
   script.js — Aditya's Portfolio
   Clean, minimal, no cursor effects
═══════════════════════════════════════════ */


// ── TYPING EFFECT ──────────────────────────
// Edit this array to change the typed phrases
const PHRASES = [
  "AI Developer",
  "LLM Engineer",
  "Open-Source Contributor",
  "Full Stack Developer",
  "Machine Learning Enthusiast"
];

const typedEl = document.getElementById('typed');
let pIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const phrase = PHRASES[pIdx];

  typedEl.textContent = deleting
    ? phrase.slice(0, --cIdx)
    : phrase.slice(0, ++cIdx);

  let delay = deleting ? 55 : 110;

  if (!deleting && cIdx === phrase.length) {
    delay = 2000; // pause at end
    deleting = true;
  } else if (deleting && cIdx === 0) {
    deleting = false;
    pIdx = (pIdx + 1) % PHRASES.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();


// ── NAVBAR SCROLL ──────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 70);
  updateActiveNav();
}, { passive: true });


// ── MOBILE NAV (hamburger) ─────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

// Backdrop that dims the page while the menu is open
const navBackdrop = document.createElement('div');
navBackdrop.className = 'nav-backdrop';
document.body.appendChild(navBackdrop);

function openMenu() {
  navLinks.classList.add('open');
  navToggle.classList.add('open');
  navBackdrop.classList.add('show');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navBackdrop.classList.remove('show');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });
  navBackdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}


// ── SMOOTH SCROLL ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    closeMenu(); // close the mobile menu if a nav link was tapped
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
    }
  });
});


// ── ACTIVE NAV HIGHLIGHT ───────────────────
function updateActiveNav() {
  const scrollY = window.scrollY;
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop - 160;
    const bottom = top + sec.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${sec.id}`);
      });
    }
  });
}


// ── SCROLL REVEAL ──────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ── STAGGER CHILD CARDS ON REVEAL ──────────
const staggerObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const cards = entry.target.querySelectorAll(
      '.proj-card, .skill-card, .hl-card, .edu-card, .hire-card'
    );

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';

      setTimeout(() => {
        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease, border-color 0.25s, box-shadow 0.25s';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 75 + 30);
    });

    staggerObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.proj-group, .skills-layout, .highlights, .about-grid, .hire-container')
  .forEach(el => staggerObserver.observe(el));


// ── GITHUB STAR COUNTS ─────────────────────
// Fetches live star counts from GitHub API for each project card.
// Each card with class .star-count needs: data-repo="username/repo-name"

async function fetchStarCount(el) {
  const repo = el.dataset.repo;
  if (!repo) return;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`);
    if (!res.ok) { el.textContent = '0'; return; }
    const data = await res.json();
    el.textContent = (data.stargazers_count ?? 0).toLocaleString();
  } catch {
    el.textContent = '0';
  }
}

// Stagger fetches to avoid hitting rate limit
document.querySelectorAll('.star-count[data-repo]').forEach((el, i) => {
  setTimeout(() => fetchStarCount(el), i * 120);
});


// ── PAGE LOAD POLISH ───────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

console.log(
  '%c  < ADITYA />  ',
  'background:#00a86b;color:#fff;font-size:14px;font-weight:bold;padding:8px 16px;border-radius:4px'
);
console.log('%c Portfolio loaded. Built with JetBrains Mono & curiosity.', 'color:#00a86b;font-size:12px');

// ── THEME TOGGLE ───────────────────────────
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});


// ── VISIT COUNTER & CLAP COUNTER ───────────
// Uses CounterAPI (free, no signup) for a shared, global count.
// Falls back to localStorage if the network call fails, so the UI
// always shows a number.
const COUNTER_NS = 'adii0906-portfolio';
const COUNTER_BASE = 'https://api.counterapi.dev/v1';

// Pull a numeric count out of whatever shape the API returns.
function readCount(data) {
  if (data == null) return null;
  if (typeof data === 'number') return data;
  return data.count ?? data.value ?? data.Count ?? null;
}

async function counter(key, action /* 'up' | '' */) {
  const url = `${COUNTER_BASE}/${COUNTER_NS}/${key}${action ? '/' + action : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('counter request failed');
  return readCount(await res.json());
}

function fmt(n) {
  return Number(n).toLocaleString();
}

// ── Visits: count once per browser session ──
(async function initVisits() {
  const el = document.getElementById('visit-count');
  if (!el) return;

  const alreadyCounted = sessionStorage.getItem('visit-counted') === '1';
  try {
    const count = await counter('visits', alreadyCounted ? '' : 'up');
    if (count != null) {
      el.textContent = fmt(count);
      sessionStorage.setItem('visit-counted', '1');
      localStorage.setItem('visit-count-cache', count);
      return;
    }
    throw new Error('no count');
  } catch {
    // Offline / blocked fallback — show last known or a local tally.
    const cached = Number(localStorage.getItem('visit-count-cache') || 0) + 1;
    localStorage.setItem('visit-count-cache', cached);
    el.textContent = fmt(cached);
  }
})();

// ── Claps: one clap per visitor ─────────────
(function initClaps() {
  const btn = document.getElementById('clap-btn');
  const countEl = document.getElementById('clap-count');
  if (!btn || !countEl) return;

  const hasClapped = () => localStorage.getItem('has-clapped') === '1';

  if (hasClapped()) btn.classList.add('clapped');

  // Show current total without incrementing.
  (async () => {
    try {
      const count = await counter('claps', '');
      if (count != null) {
        countEl.textContent = fmt(count);
        localStorage.setItem('clap-count-cache', count);
        return;
      }
      throw new Error('no count');
    } catch {
      countEl.textContent = fmt(localStorage.getItem('clap-count-cache') || 0);
    }
  })();

  function burst() {
    const rect = btn.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'clap-burst';
    span.textContent = '+1';
    span.style.left = (rect.left + rect.width / 2 - 8) + 'px';
    span.style.top = (rect.top - 6) + 'px';
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 800);
  }

  btn.addEventListener('click', async () => {
    if (hasClapped()) {
      // Already clapped — give a little nudge animation but don't count.
      btn.classList.remove('pop');
      void btn.offsetWidth;
      btn.classList.add('pop');
      return;
    }

    // Optimistic UI
    localStorage.setItem('has-clapped', '1');
    btn.classList.add('clapped', 'pop');
    burst();
    const optimistic = Number(String(countEl.textContent).replace(/,/g, '')) + 1;
    countEl.textContent = fmt(optimistic);

    try {
      const count = await counter('claps', 'up');
      if (count != null) {
        countEl.textContent = fmt(count);
        localStorage.setItem('clap-count-cache', count);
      }
    } catch {
      // Keep optimistic value; nothing else to do.
      localStorage.setItem('clap-count-cache', optimistic);
    }
  });

  btn.addEventListener('animationend', () => btn.classList.remove('pop'));
})();