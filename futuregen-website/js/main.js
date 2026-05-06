// =============================================
// FUTUREGEN — main.js
// =============================================

// ===== INTRO GLOBE =====
(function () {
  const canvas = document.getElementById('globe-canvas');
  const ctx = canvas.getContext('2d');
  const SIZE = 220;
  canvas.width = SIZE;
  canvas.height = SIZE;

  const cx = SIZE / 2, cy = SIZE / 2, r = 90;
  let angle = 0;
  let running = true;

  function drawGlobe() {
    if (!running) return;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.1);
    glow.addColorStop(0, 'rgba(200,16,46,0.08)');
    glow.addColorStop(1, 'rgba(200,16,46,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Pulsing ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(200,16,46,${0.3 + 0.2 * Math.sin(angle * 2)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Clip sphere
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Base
    const grad = ctx.createRadialGradient(cx - 28, cy - 28, 10, cx, cy, r);
    grad.addColorStop(0, '#2a2a2a');
    grad.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Longitude lines
    for (let i = 0; i < 10; i++) {
      const a = angle + (i / 10) * Math.PI * 2;
      const cosA = Math.cos(a);
      const xOff = r * cosA;
      const scaleX = Math.abs(cosA);
      const alpha = 0.1 + 0.3 * Math.abs(cosA);
      ctx.beginPath();
      ctx.save();
      ctx.translate(cx + xOff * 0.05, cy);
      ctx.scale(scaleX * 0.15 + 0.01, 1);
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.restore();
      ctx.strokeStyle = `rgba(200,16,46,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Latitude lines
    for (let i = 1; i < 7; i++) {
      const y = cy - r + (i / 7) * r * 2;
      const latR = Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
      if (latR < 2) continue;
      ctx.beginPath();
      ctx.ellipse(cx, y, latR, latR * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200,16,46,0.2)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Highlight
    ctx.beginPath();
    ctx.arc(cx - 28, cy - 20, r * 0.55, -Math.PI * 0.7, -Math.PI * 0.1);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 18;
    ctx.stroke();

    ctx.restore();

    // Outer dashed ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,16,46,0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.lineDashOffset = -angle * 40;
    ctx.stroke();
    ctx.setLineDash([]);

    angle += 0.018;
    requestAnimationFrame(drawGlobe);
  }
  drawGlobe();

  // ===== INTRO STARS =====
  const sc = document.getElementById('intro-stars');
  const sctx = sc.getContext('2d');
  sc.width = window.innerWidth;
  sc.height = window.innerHeight;
  const iStars = Array.from({length: 180}, () => ({
    x: Math.random() * sc.width,
    y: Math.random() * sc.height,
    r: Math.random() * 1.1,
    a: Math.random(),
    spd: Math.random() * 0.4 + 0.1,
    dir: Math.random() > 0.5 ? 1 : -1
  }));
  function drawIntroStars() {
    if (!running) return;
    sctx.clearRect(0, 0, sc.width, sc.height);
    iStars.forEach(s => {
      s.a += s.spd * 0.01 * s.dir;
      if (s.a > 1 || s.a < 0) s.dir *= -1;
      sctx.beginPath();
      sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sctx.fillStyle = `rgba(255,255,255,${s.a})`;
      sctx.fill();
    });
    requestAnimationFrame(drawIntroStars);
  }
  drawIntroStars();

  // ===== DISMISS INTRO after 3.8s =====
  setTimeout(() => {
    const overlay = document.getElementById('intro-overlay');
    overlay.classList.add('hide');
    running = false;
    setTimeout(() => { overlay.style.display = 'none'; }, 900);
  }, 3800);
})();

// ===== MAIN STARS CANVAS =====
(function () {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height,
        r: Math.random()*1.2, a: Math.random(), speed: Math.random()*0.3+0.1, dir: Math.random()>0.5?1:-1 });
    }
  }
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.speed * 0.01 * s.dir;
      if (s.a > 1 || s.a < 0) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  window.addEventListener('resize', () => { resize(); createStars(200); });
  resize(); createStars(200); drawStars();
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = ''; spans[1].style.opacity = ''; spans[2].style.transform = '';
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.service-card, .package-card, .stat-item, .work-item, .process-step, .about-card, .value-item'
);
revealEls.forEach(el => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80 * Array.from(revealEls).indexOf(entry.target) % 6);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      const step = target / (1800 / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 16);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== FORM SUBMIT =====
function handleSubmit(btn) {
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "✓ Message Sent! We'll be in touch soon.";
    btn.style.background = '#1a7a3a';
    btn.style.borderColor = '#1a7a3a';
  }, 1500);
}

// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const scrolled = window.scrollY;
    heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
    heroContent.style.opacity = Math.max(0, 1 - scrolled / 500);
  }
});





function submitForm(btn) {
  const inputs   = document.querySelectorAll('.form-input');
  const name     = inputs[0].value.trim();
  const email    = inputs[1].value.trim();
  const business = inputs[2].value.trim();
  const service  = inputs[3].value;
  const message  = inputs[4].value.trim();

  if (!name || !email) {
    alert('Please fill in your name and email.');
    return;
  }

  // ── Show thank you to client immediately ──
  btn.textContent = '✓ Thank you for enquiring! We will get back to you shortly.';
  btn.style.background = '#1a1a1a';
  btn.style.borderColor = '#333';
  btn.style.fontSize = '13px';
  btn.style.letterSpacing = '1px';
  btn.disabled = true;
  inputs.forEach(i => { i.disabled = true; i.style.opacity = '0.4'; });

  // ── Silently send details to YOUR WhatsApp in background ──
  const waText =
    `🔔 *NEW FUTUREGEN ENQUIRY*%0A%0A` +
    `👤 *Name:* ${encodeURIComponent(name)}%0A` +
    `📧 *Email:* ${encodeURIComponent(email)}%0A` +
    `🏢 *Business:* ${encodeURIComponent(business || 'Not provided')}%0A` +
    `📌 *Service:* ${encodeURIComponent(service || 'Not selected')}%0A%0A` +
    `💬 *Message:*%0A${encodeURIComponent(message || 'No message')}`;

  // Opens WhatsApp silently in a hidden iframe so client never sees it
  const hidden = document.createElement('iframe');
  hidden.style.display = 'none';
  hidden.src = `https://wa.me/94785777901?text=${waText}`;
  document.body.appendChild(hidden);

  // Backup: also try opening in a tiny hidden window that closes itself
  setTimeout(() => {
    const popup = window.open(
      `https://wa.me/94785777901?text=${waText}`,
      '_blank',
      'width=1,height=1,left=-9999,top=-9999'
    );
    if (popup) setTimeout(() => popup.close(), 3000);
  }, 500);
}


// ===== PORTFOLIO FILTER, LOAD MORE & INSTAGRAM THUMBNAIL FETCHER =====

const allItems = document.querySelectorAll('.wi');
const SHOW_INIT = 12;
let currentFilter = 'all';
let showing = SHOW_INIT;

// --- Filter & Load More ---
function applyFilter(filter) {
  currentFilter = filter;
  showing = SHOW_INIT;
  let count = 0;
  allItems.forEach(item => {
    const match = filter === 'all' || item.dataset.type === filter;
    item.style.display = match ? 'block' : 'none';
    if (match) count++;
  });
  let shown = 0;
  allItems.forEach(item => {
    if (item.style.display === 'block') {
      shown++;
      if (shown > SHOW_INIT) item.style.display = 'none';
    }
  });
  document.getElementById('loadMoreBtn').style.display = count > SHOW_INIT ? 'inline-flex' : 'none';
}

function loadMore() {
  showing += 8;
  let shown = 0;
  allItems.forEach(item => {
    const match = currentFilter === 'all' || item.dataset.type === currentFilter;
    if (match) {
      shown++;
      item.style.display = shown <= showing ? 'block' : 'none';
    }
  });
  const total = [...allItems].filter(i => currentFilter === 'all' || i.dataset.type === currentFilter).length;
  if (showing >= total) document.getElementById('loadMoreBtn').style.display = 'none';
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

// --- Instagram Thumbnail Fetcher via oEmbed ---
// Uses api.allorigins.win as a CORS proxy to call Instagram's public oEmbed endpoint.
// No access token needed for public posts.
async function fetchInstagramThumb(postUrl) {
  try {
    const cleanUrl = postUrl.split('?')[0].replace(/\/$/, '');
    const oembedTarget = `https://www.instagram.com/oembed/?url=${encodeURIComponent(cleanUrl)}&maxwidth=640`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(oembedTarget)}`;

    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.contents) return null;

    const parsed = JSON.parse(data.contents);
    return parsed.thumbnail_url || null;
  } catch (e) {
    return null;
  }
}

function injectThumb(card, thumbUrl) {
  const thumbDiv = card.querySelector('.wi-thumb');
  if (!thumbDiv) return;

  // Remove existing img if any
  const existingImg = thumbDiv.querySelector('img');
  if (existingImg) existingImg.remove();

  const img = document.createElement('img');
  img.src = thumbUrl;
  img.alt = '';
  img.loading = 'lazy';

  // If image fails to load, just keep the gradient background
  img.onerror = () => img.remove();

  // Insert as first child so it sits behind the play icon
  thumbDiv.insertBefore(img, thumbDiv.firstChild);
}

async function loadAllThumbnails() {
  const igCards = [...allItems].filter(card => {
    return card.dataset.type === 'reel' || card.dataset.type === 'post';
  });

  // Process in batches of 4 to avoid hammering the proxy
  const BATCH = 4;
  for (let i = 0; i < igCards.length; i += BATCH) {
    const batch = igCards.slice(i, i + BATCH);
    await Promise.all(batch.map(async card => {
      const postUrl = card.dataset.url;
      if (!postUrl) return;
      const thumb = await fetchInstagramThumb(postUrl);
      if (thumb) injectThumb(card, thumb);
    }));
    // Small delay between batches to be polite to the proxy
    await new Promise(r => setTimeout(r, 300));
  }
}

// Init
applyFilter('all');
loadAllThumbnails();