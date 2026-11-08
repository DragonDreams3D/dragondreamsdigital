(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const htmlEl = document.documentElement;
  const bodyEl = document.body;

  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  const slideDots = document.getElementById('slideDots');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const chapterBtns = Array.from(document.querySelectorAll('.chapter-btn'));

  const btnModeSlides = document.getElementById('btnModeSlides');
  const btnModeScroll = document.getElementById('btnModeScroll');
  const btnTheme = document.getElementById('btnTheme');
  const themeIcon = document.getElementById('themeIcon');

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  const slideTitles = [
    'Обо мне и стек',
    'РК 360° · Покупка частями',
    'РК 360° · А знаешь, можно (AI)',
    'РК 360° · Носители в городе и лифтах',
    'Ивенты · Фестиваль Alfa Jazz',
    'Ивенты · Ultima Guide Сочи',
    'Ивенты · Презентация Trouver Москва',
    'Брендинг · Osstem Implant (Система)',
    'Брендинг · Osstem Implant (Шаблоны)',
    'Ценность для команды и контакты'
  ];

  let current = 0;
  let mode = 'slides';
  let wheelLock = false;

  // Build slide dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Слайд ${idx + 1}: ${slideTitles[idx]}`);
    dot.title = `${String(idx + 1).padStart(2, '0')} · ${slideTitles[idx]}`;
    dot.addEventListener('click', () => goToSlide(idx));
    slideDots.appendChild(dot);
  });
  const dots = Array.from(slideDots.querySelectorAll('.slide-dot'));

  function updateUI() {
    const activeSlide = slides[current];
    const chapter = activeSlide.dataset.chapter || 'intro';
    htmlEl.setAttribute('data-accent', chapter);

    slides.forEach((s, idx) => {
      const isActive = idx === current;
      s.classList.toggle('active', isActive);
      s.querySelectorAll('video').forEach((v) => {
        if (mode === 'scroll' || isActive) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    });

    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === current);
    });

    chapterBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.chapter === chapter);
    });

    const pct = ((current + 1) / total) * 100;
    progressFill.style.width = `${pct}%`;

    const numStr = String(current + 1).padStart(2, '0');
    slideCounter.textContent = `${numStr} / ${total} — ${slideTitles[current]}`;

    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  function goToSlide(idx) {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    current = clamped;
    updateUI();
    if (mode === 'scroll') {
      if (current === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      slides[current].scrollTop = 0;
    }
  }

  function setMode(nextMode) {
    mode = nextMode;
    bodyEl.classList.toggle('mode-slides', mode === 'slides');
    bodyEl.classList.toggle('mode-scroll', mode === 'scroll');
    btnModeSlides.classList.toggle('active', mode === 'slides');
    btnModeScroll.classList.toggle('active', mode === 'scroll');
    if (mode === 'scroll') {
      slides.forEach((s) => s.classList.add('in-view'));
      setTimeout(() => {
        slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    } else {
      updateUI();
    }
  }

  // Check URL query (?mode=scroll)
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'scroll') {
    setMode('scroll');
  }

  btnPrev.addEventListener('click', () => goToSlide(current - 1));
  btnNext.addEventListener('click', () => goToSlide(current + 1));

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIdx = parseInt(el.getAttribute('data-goto'), 10);
      if (!Number.isNaN(targetIdx)) {
        goToSlide(targetIdx);
      }
    });
  });

  btnModeSlides.addEventListener('click', () => setMode('slides'));
  btnModeScroll.addEventListener('click', () => setMode('scroll'));

  // Theme Switch
  btnTheme.addEventListener('click', () => {
    const curTheme = htmlEl.getAttribute('data-theme') || 'dark';
    const nextTheme = curTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', nextTheme);
    themeIcon.textContent = nextTheme === 'dark' ? '☀' : '☾';
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('open')) {
      if (e.key === 'Escape') closeModals();
      return;
    }
    if (mode === 'slides') {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goToSlide(current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(current - 1);
      }
    }
  });

  // Gentle Wheel Navigation in Slide Mode (only on wide screens when inner slide isn't scrolling)
  window.addEventListener(
    'wheel',
    (e) => {
      if (mode !== 'slides' || window.innerWidth <= 1120) return;
      if (lightboxModal.classList.contains('open')) return;

      const activeSlide = slides[current];
      const canScrollDown =
        activeSlide.scrollTop + activeSlide.clientHeight < activeSlide.scrollHeight - 6;
      const canScrollUp = activeSlide.scrollTop > 6;

      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
        return;
      }

      if (Math.abs(e.deltaY) < 32 || wheelLock) return;
      wheelLock = true;
      if (e.deltaY > 0 && current < total - 1) {
        goToSlide(current + 1);
      } else if (e.deltaY < 0 && current > 0) {
        goToSlide(current - 1);
      }
      setTimeout(() => {
        wheelLock = false;
      }, 620);
    },
    { passive: true }
  );

  // Scroll Spy when in Scroll Mode
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (mode === 'scroll') {
            const idx = parseInt(entry.target.dataset.index, 10);
            if (!Number.isNaN(idx)) {
              current = idx;
              const chapter = entry.target.dataset.chapter || 'intro';
              htmlEl.setAttribute('data-accent', chapter);
              chapterBtns.forEach((btn) =>
                btn.classList.toggle('active', btn.dataset.chapter === chapter)
              );
              progressFill.style.width = `${((current + 1) / total) * 100}%`;
            }
          }
        }
      });
    },
    { threshold: 0.42 }
  );
  slides.forEach((s) => observer.observe(s));

  // Lightbox (Images & 3D Videos)
  document.querySelectorAll('[data-lightbox]').forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-lightbox');
      const cap = card.getAttribute('data-caption') || '';
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.style.display = 'none';
      lightboxImg.style.display = 'block';
      lightboxImg.src = src;
      lightboxImg.alt = cap;
      lightboxCaption.textContent = cap;
      lightboxModal.classList.add('open');
    });
  });

  document.querySelectorAll('[data-video]').forEach((card) => {
    card.addEventListener('click', () => {
      const vsrc = card.getAttribute('data-video');
      const cap = card.getAttribute('data-caption') || '';
      lightboxImg.src = '';
      lightboxImg.style.display = 'none';
      lightboxVideo.style.display = 'block';
      lightboxVideo.src = vsrc;
      lightboxVideo.muted = false;
      lightboxCaption.textContent = cap;
      lightboxModal.classList.add('open');
      lightboxVideo.play().catch(() => {
        lightboxVideo.muted = true;
        lightboxVideo.play().catch(() => {});
      });
    });
  });

  function closeModals() {
    lightboxModal.classList.remove('open');
    lightboxImg.src = '';
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
  }

  btnCloseLightbox.addEventListener('click', closeModals);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeModals();
  });

  updateUI();
})();
