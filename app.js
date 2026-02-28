/* ========================================
   Phantom-User — App Controller
   ======================================== */

(function () {
  'use strict';

  // ── DOM Elements ──
  const seedInput = document.getElementById('seed-input');
  const vibeSelect = document.getElementById('vibe-select');
  const caseSelect = document.getElementById('case-select');
  const lengthSelect = document.getElementById('length-select');
  const generateBtn = document.getElementById('generate-btn');
  const regenerateBtn = document.getElementById('regenerate-btn');
  const resultsSection = document.getElementById('results');
  const namesGrid = document.getElementById('names-grid');
  const toast = document.getElementById('toast');

  // ── Ghost Background Animation ──
  function initGhostBg() {
    const canvas = document.getElementById('ghost-bg');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((width * height) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const opacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 92, 252, ${opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  // ── Generate Names ──
  function generateNames() {
    const options = {
      seed: seedInput.value.trim(),
      vibe: vibeSelect.value,
      caseStyle: caseSelect.value,
      lengthPref: lengthSelect.value,
      count: 12
    };

    const names = PhantomGenerator.generate(options);
    renderNames(names);

    // Show results section
    resultsSection.classList.add('visible');

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Animate button
    generateBtn.querySelector('.btn-text').textContent = 'Regenerate';
  }

  // ── Render Names ──
  function renderNames(names) {
    namesGrid.innerHTML = '';

    names.forEach((name, i) => {
      const card = document.createElement('div');
      card.className = 'name-card';
      card.style.animationDelay = `${i * 0.04}s`;
      card.innerHTML = `
        <span class="name-text">${escapeHtml(name)}</span>
        <span class="name-length">${name.length} chars</span>
        <span class="copy-check">✓</span>
      `;

      card.addEventListener('click', () => copyName(name, card));
      namesGrid.appendChild(card);

      // Stagger animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(8px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 40);
    });
  }

  // ── Copy to Clipboard ──
  async function copyName(name, card) {
    try {
      await navigator.clipboard.writeText(name);

      // Visual feedback on card
      card.classList.add('copied');
      setTimeout(() => card.classList.remove('copied'), 1500);

      // Show toast
      showToast(`Copied "${name}"`);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = name;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      card.classList.add('copied');
      setTimeout(() => card.classList.remove('copied'), 1500);
      showToast(`Copied "${name}"`);
    }
  }

  // ── Toast Notification ──
  let toastTimeout;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // ── Escape HTML ──
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Event Listeners ──
  generateBtn.addEventListener('click', generateNames);
  regenerateBtn.addEventListener('click', generateNames);

  // Enter key on seed input
  seedInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generateNames();
    }
  });

  // ── Keyboard shortcut: Space to regenerate when not in input ──
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === ' ' && resultsSection.classList.contains('visible')) {
      e.preventDefault();
      generateNames();
    }
  });

  // ── Initialize ──
  initGhostBg();

  // Auto-generate on load for instant gratification
  generateNames();
})();
