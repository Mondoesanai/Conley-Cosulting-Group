/* Conley Consulting Group — interactions
   scroll reveal · count-up · magnetic buttons · cursor glow ·
   tilt/pointer cards · engine tabs · blog filter · mobile nav   */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll progress ---------- */
  const bar = document.querySelector('.scroll-progress');
  const onScrollProgress = () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (bar) bar.style.width = (p * 100) + '%';
  };

  /* ---------- nav shrink + mobile menu ---------- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => nav && nav.classList.toggle('shrink', window.scrollY > 20);
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
      const open = document.body.classList.contains('menu-open');
      toggle.setAttribute('aria-expanded', open);
    });
    links && links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }

  window.addEventListener('scroll', () => { onScrollProgress(); onScrollNav(); }, { passive: true });
  onScrollProgress(); onScrollNav();

  /* ---------- active nav link ---------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === 'index.html' && href === 'index.html'))
      a.setAttribute('aria-current', 'page');
  });

  /* ---------- reveal on scroll ---------- */
  const revEls = document.querySelectorAll('.reveal, .reveal-list, .enginecard, .timeline__row');
  if (revEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revEls.forEach(el => io.observe(el));
  }

  /* ---------- count-up ---------- */
  const countUp = (el) => {
    const raw = el.dataset.count;
    const num = parseFloat(raw);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dec = (raw.split('.')[1] || '').length;
    if (reduce || isNaN(num)) { el.textContent = prefix + raw + suffix; return; }
    const dur = 1400; const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = prefix + (num * eased).toFixed(dec) + suffix;
      if (k < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + raw + suffix;
    };
    requestAnimationFrame(tick);
  };
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- cursor glow ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let gx = innerWidth / 2, gy = innerHeight / 2, cx = gx, cy = gy;
    addEventListener('mousemove', (e) => {
      gx = e.clientX; gy = e.clientY;
      document.body.classList.add('cursor-ready');
    });
    const loop = () => {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 0.3;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- pointer-tracked card glow ---------- */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------- tilt on [data-tilt] ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 6}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- engine tabs ---------- */
  const tabs = document.querySelectorAll('.engine__tab');
  const panes = document.querySelectorAll('.engine__pane');
  if (tabs.length) {
    const select = (i) => {
      tabs.forEach((t, k) => t.setAttribute('aria-selected', k === i));
      panes.forEach((p, k) => { p.hidden = k !== i; });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('mouseenter', () => { if (window.matchMedia('(hover:hover)').matches) select(i); });
    });
    select(0);
  }

  /* ---------- blog filter ---------- */
  const fbar = document.querySelector('.filterbar');
  if (fbar) {
    const posts = document.querySelectorAll('.post');
    fbar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        fbar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        const f = btn.dataset.filter;
        posts.forEach(p => {
          const match = f === 'all' || (p.dataset.cat || '').split(' ').includes(f);
          p.classList.toggle('hide', !match);
        });
      });
    });
  }

  /* ---------- forms (demo only) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = f.querySelector('[type="submit"]');
      if (btn) { const t = btn.textContent; btn.textContent = 'Sent ✓'; btn.disabled = true;
        setTimeout(() => { btn.textContent = t; btn.disabled = false; f.reset(); }, 2600); }
    });
  });

  /* ---------- parallax drift ---------- */
  const drifts = document.querySelectorAll('.drift');
  if (drifts.length && !reduce) {
    const onDrift = () => {
      const vh = innerHeight;
      drifts.forEach(el => {
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const k = (mid - vh / 2) / vh;              // -1 .. 1 across viewport
        const amt = parseFloat(el.dataset.drift || '26');
        el.style.transform = `translate3d(0, ${(-k * amt).toFixed(1)}px, 0)`;
      });
    };
    addEventListener('scroll', onDrift, { passive: true });
    onDrift();
  }

  /* ---------- self-assessment quiz ---------- */
  const quiz = document.querySelector('[data-quiz]');
  if (quiz) {
    const steps = [...quiz.querySelectorAll('.quiz__step')];
    const result = quiz.querySelector('.quiz__result');
    const fill = quiz.querySelector('.quiz__progress i');
    const count = quiz.querySelector('.quiz__count');
    const back = quiz.querySelector('.quiz__back');
    const answers = new Array(steps.length).fill(null);
    let cur = 0;

    const render = () => {
      steps.forEach((s, i) => { s.hidden = i !== cur; });
      result.hidden = true;
      fill.style.width = ((cur) / steps.length * 100) + '%';
      count.textContent = `Question ${cur + 1} of ${steps.length}`;
      back.hidden = cur === 0;
    };

    const finish = () => {
      steps.forEach(s => s.hidden = true);
      back.hidden = true;
      fill.style.width = '100%';
      count.textContent = 'Your result';
      const score = answers.reduce((a, b) => a + (b || 0), 0);
      const max = steps.length * 3;
      const pct = Math.round(score / max * 100);
      let tier, blurb;
      if (pct < 40) {
        tier = 'Founder-dependent';
        blurb = 'Revenue still runs through you. The biggest unlock is taking yourself off the critical path — productizing the offer and building a pipeline that does not need you in every deal.';
      } else if (pct < 70) {
        tier = 'Partially systemized';
        blurb = 'You have real structure, but there are leaks — pricing, hand-offs, or an operating rhythm that slips under pressure. Tightening those turns good months into predictable ones.';
      } else {
        tier = 'Close to predictable';
        blurb = 'The engine mostly runs on mechanics. The work now is precision: margin, velocity, and a forecast you can take to a board or a buyer.';
      }
      result.querySelector('.quiz__tier').textContent = tier;
      result.querySelector('p').textContent = blurb;
      result.hidden = false;
      requestAnimationFrame(() => { const m = result.querySelector('.quiz__meter i'); if (m) m.style.width = pct + '%'; });
    };

    quiz.querySelectorAll('.quiz__opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const step = opt.closest('.quiz__step');
        const idx = steps.indexOf(step);
        step.querySelectorAll('.quiz__opt').forEach(o => o.setAttribute('aria-pressed', 'false'));
        opt.setAttribute('aria-pressed', 'true');
        answers[idx] = parseInt(opt.dataset.val, 10);
        setTimeout(() => {
          if (cur < steps.length - 1) { cur++; render(); }
          else finish();
        }, 220);
      });
    });
    back && back.addEventListener('click', () => { if (cur > 0) { cur--; render(); } });
    render();
  }

  /* ---------- book page: 3-step wizard → demo scheduler ---------- */
  const wiz = document.querySelector('[data-bookwiz]');
  const calMount = document.getElementById('bookCal');
  if (wiz && calMount) {
    const steps = [...wiz.querySelectorAll('.bookwiz__step')];
    const bar = wiz.querySelector('.bookwiz__bar i');
    const count = wiz.querySelector('.bookwiz__count');
    let cur = 0, built = false;

    const summary = () => {
      const picks = [...wiz.querySelectorAll('input[name="need"]:checked')].map(i => i.value.replace(/&amp;/g, '&'));
      const note = (document.getElementById('bookNote') || {}).value || '';
      let s = picks.length ? picks.join(', ') : 'Intro call';
      if (note.trim()) s += ' · ' + note.trim().slice(0, 90);
      return s;
    };

    /* ---- demo scheduler: looks like Calendly, books nothing ---- */
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DOW = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const SLOTS = (() => { const a = []; for (let h = 9; h <= 16; h++) { a.push(h + ':00'); if (h < 16) a.push(h + ':30'); } return a; })();
    const fmtT = (t) => { let [h, m] = t.split(':'); h = +h; return (h % 12 || 12) + ':' + m + ' ' + (h < 12 ? 'am' : 'pm'); };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today); cutoff.setDate(cutoff.getDate() + 2);
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    let selDate = null, selTime = null;
    const isOpen = (d) => d.getDay() !== 0 && d.getDay() !== 6 && d >= cutoff;

    const drawCal = () => {
      const y = view.getFullYear(), mo = view.getMonth();
      const lead = new Date(y, mo, 1).getDay();
      const dim = new Date(y, mo + 1, 0).getDate();
      let cells = '';
      for (let i = 0; i < lead; i++) cells += '<span></span>';
      for (let d = 1; d <= dim; d++) {
        const dt = new Date(y, mo, d);
        const open = isOpen(dt);
        const sel = selDate && selDate.getTime() === dt.getTime();
        cells += `<button class="mockcal__day${open ? ' has' : ''}" ${open ? '' : 'disabled'} data-d="${d}" aria-pressed="${sel}">${d}</button>`;
      }
      const canPrev = !(y === today.getFullYear() && mo <= today.getMonth());
      calMount.innerHTML = `
        <div class="mockcal">
          <div class="mockcal__head">
            <span class="mockcal__tag">Demo</span>
            <h3>Conley Consulting Group</h3>
            <p>Intro call · 60 min · video · times shown in your local timezone</p>
          </div>
          <div class="mockcal__grid">
            <div class="mockcal__cal">
              <div class="mockcal__month">
                <button class="mockcal__mnav" data-nav="-1" ${canPrev ? '' : 'disabled'} aria-label="Previous month">&#8249;</button>
                <span>${MONTHS[mo]} ${y}</span>
                <button class="mockcal__mnav" data-nav="1" aria-label="Next month">&#8250;</button>
              </div>
              <div class="mockcal__days">
                ${DOW.map((x) => `<span class="mockcal__dow">${x}</span>`).join('')}
                ${cells}
              </div>
            </div>
            <div class="mockcal__times">
              ${selDate
                ? `<div class="mockcal__tzhdr">${DOW[selDate.getDay()]}, ${MONTHS[selDate.getMonth()]} ${selDate.getDate()}</div>` +
                  SLOTS.map((t) => `<button class="mockcal__slot${selTime === t ? ' sel' : ''}" data-t="${t}">${fmtT(t)}</button>`).join('')
                : `<p class="hint">Select a day to see open times.</p>`}
            </div>
          </div>
          ${selDate && selTime ? `
          <div class="mockcal__confirm">
            <div class="mockcal__sum">
              <b>${DOW[selDate.getDay()]}, ${MONTHS[selDate.getMonth()]} ${selDate.getDate()} · ${fmtT(selTime)}</b>
              <span>${summary()}</span>
            </div>
            <button type="button" class="btn" data-confirm>Schedule event</button>
          </div>` : ''}
        </div>`;

      calMount.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => {
        view = new Date(view.getFullYear(), view.getMonth() + (+b.dataset.nav), 1);
        selDate = null; selTime = null; drawCal();
      }));
      calMount.querySelectorAll('.mockcal__day:not([disabled])').forEach((b) => b.addEventListener('click', () => {
        selDate = new Date(view.getFullYear(), view.getMonth(), +b.dataset.d); selTime = null; drawCal();
      }));
      calMount.querySelectorAll('.mockcal__slot').forEach((b) => b.addEventListener('click', () => {
        selTime = b.dataset.t; drawCal();
      }));
      const cf = calMount.querySelector('[data-confirm]');
      cf && cf.addEventListener('click', () => {
        calMount.innerHTML = `
          <div class="mockcal">
            <div class="mockcal__done">
              <div class="mockcal__check">&#10003;</div>
              <h3>You're on the calendar</h3>
              <p>${DOW[selDate.getDay()]}, ${MONTHS[selDate.getMonth()]} ${selDate.getDate()} at ${fmtT(selTime)} · 60 minutes</p>
              <p class="mockcal__note">Attached: ${summary()}</p>
              <p class="mockcal__mini">This is a demo scheduler for the preview site. Connect Calendly or GoHighLevel and this confirms straight into Cam's calendar with the details above.</p>
            </div>
          </div>`;
      });
    };

    const render = (scroll) => {
      steps.forEach((s, i) => { s.hidden = i !== cur; });
      if (bar) bar.style.width = ((cur + 1) / steps.length * 100) + '%';
      if (count) count.textContent = 'Step ' + (cur + 1) + ' of ' + steps.length;
      if (cur === steps.length - 1 && !built) { built = true; drawCal(); }
      if (scroll) {
        const y = wiz.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    wiz.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', () => {
      if (cur < steps.length - 1) { cur++; render(true); }
    }));
    wiz.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => {
      if (cur > 0) { cur--; render(true); }
    }));
    render(false);
  }

  /* ---------- article page router ---------- */
  const articleWrap = document.getElementById('articles');
  if (articleWrap) {
    const slug = new URLSearchParams(location.search).get('p');
    const all = [...articleWrap.querySelectorAll('.article')];
    let shown = all.find(a => a.dataset.slug === slug) || all[0];
    all.forEach(a => { a.hidden = a !== shown; });
    if (shown) {
      const h = shown.querySelector('h1');
      if (h) document.title = h.textContent + ' — Conley Consulting Group';
      window.scrollTo(0, 0);
    }
  }

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
