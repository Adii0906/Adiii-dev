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

  let delay = deleting ? 40 : 90;

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


// ── SMOOTH SCROLL ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
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