/* =========================================================
   DHANNOOOO ❤️ — script.js  (Vanilla JS, no dependencies)
   ========================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     0. EDITABLE CONTENT — tweak these freely
  --------------------------------------------------------- */
  const loveLetterText =
`I don't know how to fit everything I feel about you into one page, but I wanted to try.

You showed up in my life and somehow made even ordinary days feel like something worth remembering. Your smile, your voice, the way you get excited about the smallest things — I notice all of it, and I love all of it.

I made this little website because words in a text message never feel like enough for how much you mean to me. So here it is: proof, in pixels and code, that you are loved — completely, patiently, and forever.

Thank you for being you, Dhannoooo. I love you more than I know how to say.`;

  const quotes = [
    "You are my today and all of my tomorrows.",
    "In a sea of people, my eyes will always search for you.",
    "You are the poem I never knew how to write.",
    "Every love story is beautiful, but ours is my favorite.",
    "I fall for you a little more every single day.",
    "Home isn't a place. It's you.",
    "Forever is a long time, but I'd spend all of it with you."
  ];

  const playlist = [
    { title: "Our Song, One", artist: "for Dhannoooo", src: "songs/song1.mp3" },
    { title: "Our Song, Two", artist: "for Dhannoooo", src: "songs/song2.mp3" },
    // Add more songs here — { title, artist, src: 'songs/filename.mp3' }
  ];

  /* ---------------------------------------------------------
     1. LOADER
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 900);
  });

  /* ---------------------------------------------------------
     2. ENTRY GATE
  --------------------------------------------------------- */
  const gate = document.getElementById('gate');
  const gateBtn = document.getElementById('gateBtn');
  gateBtn.addEventListener('click', () => {
    gate.classList.add('hidden');
    document.body.style.overflow = 'auto';
    spawnBurstHearts(18);
    if (playlist.length > 0) loadTrack(trackIndex, true);
  });
  document.body.style.overflow = 'hidden';
  setTimeout(() => { if (!gate.classList.contains('hidden')) {} }, 0);

  /* ---------------------------------------------------------
     3. CUSTOM CURSOR
  --------------------------------------------------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });
  (function loopRing(){
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(loopRing);
  })();
  document.querySelectorAll('a, button, .gallery-card, .heart3d').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('grow'));
  });

  /* ---------------------------------------------------------
     4. SCROLL PROGRESS + BACK TO TOP
  --------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    backToTop.classList.toggle('show', h.scrollTop > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------------------------------------------------
     5. SECTION REVEAL ON SCROLL
  --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section, .timeline-item').forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     6. STARFIELD CANVAS
  --------------------------------------------------------- */
  const starsCanvas = document.getElementById('stars-canvas');
  const sCtx = starsCanvas.getContext('2d');
  let stars = [];
  function sizeStars(){
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = document.documentElement.scrollHeight;
    const count = Math.floor((starsCanvas.width * starsCanvas.height) / 9000);
    stars = Array.from({ length: Math.min(count, 260) }, () => ({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2
    }));
  }
  sizeStars();
  window.addEventListener('resize', debounce(sizeStars, 300));
  let t = 0;
  function drawStars(){
    t += 1;
    sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(255,247,241,${0.15 + twinkle * 0.65})`;
      sCtx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  if (!reduceMotion) drawStars(); else { drawStars = () => {}; sCtx.globalAlpha = 0.4; stars.forEach(s=>{sCtx.beginPath();sCtx.arc(s.x,s.y,s.r,0,7);sCtx.fillStyle='#fff7f1';sCtx.fill();}); }

  /* ---------------------------------------------------------
     7. FLOATING HEARTS + GLOW PARTICLES
  --------------------------------------------------------- */
  const floatingHeartsEl = document.getElementById('floatingHearts');
  function spawnHeart(){
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = Math.random() > 0.5 ? '❤️' : '💕';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    h.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    const dur = 8 + Math.random() * 8;
    h.style.animationDuration = dur + 's';
    floatingHeartsEl.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
  }
  if (!reduceMotion) setInterval(spawnHeart, 1400);

  function spawnBurstHearts(n){
    for (let i = 0; i < n; i++) setTimeout(spawnHeart, i * 80);
  }

  const glowParticlesEl = document.getElementById('glowParticles');
  for (let i = 0; i < 14; i++) {
    const d = document.createElement('div');
    d.className = 'glow-dot';
    const size = 40 + Math.random() * 80;
    d.style.width = size + 'px';
    d.style.height = size + 'px';
    d.style.left = Math.random() * 100 + 'vw';
    d.style.top = Math.random() * 100 + 'vh';
    d.style.animationDelay = (Math.random() * 8) + 's';
    d.style.opacity = 0.15 + Math.random() * 0.2;
    glowParticlesEl.appendChild(d);
  }

  /* ---------------------------------------------------------
     8. 3D GALLERY (coverflow)
  --------------------------------------------------------- */
  const galleryTrack = document.getElementById('galleryTrack');
  const cards = Array.from(galleryTrack.children);
  let activeIndex = 0;
  function layoutGallery(){
    const isMobile = window.innerWidth < 640;
    const spread = isMobile ? 130 : 230;
    cards.forEach((card, i) => {
      const offset = i - activeIndex;
      const abs = Math.abs(offset);
      card.style.transform = `translateX(${offset * spread}px) translateZ(${-abs * 140}px) rotateY(${offset * -28}deg) scale(${1 - abs * 0.14})`;
      card.style.zIndex = 10 - abs;
      card.style.opacity = abs > 2 ? 0 : 1 - abs * 0.18;
      card.style.filter = abs === 0 ? 'brightness(1)' : 'brightness(0.65)';
    });
  }
  layoutGallery();
  window.addEventListener('resize', debounce(layoutGallery, 200));

  const gallery3dEl = document.getElementById('gallery3d');
  let galleryAutoplay = null;
  function startGalleryAutoplay(){
    if (reduceMotion) return;
    clearInterval(galleryAutoplay);
    galleryAutoplay = setInterval(() => {
      activeIndex = (activeIndex + 1) % cards.length;
      layoutGallery();
    }, 2800);
  }
  function stopGalleryAutoplay(){
    clearInterval(galleryAutoplay);
  }
  function restartGalleryAutoplay(){
    stopGalleryAutoplay();
    startGalleryAutoplay();
  }

  document.getElementById('galleryPrev').addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length; layoutGallery();
    restartGalleryAutoplay();
  });
  document.getElementById('galleryNext').addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % cards.length; layoutGallery();
    restartGalleryAutoplay();
  });
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i !== activeIndex) { activeIndex = i; layoutGallery(); restartGalleryAutoplay(); }
      else openLightbox(card.dataset.full);
    });
  });
  // swipe support
  attachSwipe(gallery3dEl, () => {
    activeIndex = (activeIndex + 1) % cards.length; layoutGallery();
    restartGalleryAutoplay();
  }, () => {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length; layoutGallery();
    restartGalleryAutoplay();
  });
  gallery3dEl.addEventListener('mouseenter', stopGalleryAutoplay);
  gallery3dEl.addEventListener('mouseleave', startGalleryAutoplay);
  startGalleryAutoplay();

  /* ---------------------------------------------------------
     10. MEMORY CAROUSEL
  --------------------------------------------------------- */
  const memoryTrack = document.getElementById('memoryTrack');
  const memorySlides = Array.from(memoryTrack.children);
  const memoryDotsEl = document.getElementById('memoryDots');
  let memIndex = 0;
  memorySlides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { memIndex = i; updateMemory(); });
    memoryDotsEl.appendChild(dot);
  });
  function updateMemory(){
    memoryTrack.style.transform = `translateX(-${memIndex * 100}%)`;
    Array.from(memoryDotsEl.children).forEach((d, i) => d.classList.toggle('active', i === memIndex));
  }
  attachSwipe(document.getElementById('memoryCarousel'), () => {
    memIndex = (memIndex + 1) % memorySlides.length; updateMemory();
  }, () => {
    memIndex = (memIndex - 1 + memorySlides.length) % memorySlides.length; updateMemory();
  });
  let memAuto = setInterval(() => { memIndex = (memIndex + 1) % memorySlides.length; updateMemory(); }, 5000);
  document.getElementById('memoryCarousel').addEventListener('mouseenter', () => clearInterval(memAuto));

  /* ---------------------------------------------------------
     11. LOVE LETTER — typewriter, triggered on view
  --------------------------------------------------------- */
  const letterBody = document.getElementById('letterBody');
  let letterTyped = false;
  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !letterTyped) {
        letterTyped = true;
        typeWriter(letterBody, loveLetterText, 18);
      }
    });
  }, { threshold: 0.3 });
  letterObserver.observe(document.getElementById('letter'));

  function typeWriter(el, text, speed){
    if (reduceMotion) { el.textContent = text; el.classList.add('done'); return; }
    let i = 0;
    (function tick(){
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(tick, speed);
      } else {
        el.classList.add('done');
      }
    })();
  }

  /* ---------------------------------------------------------
     12. MUSIC PLAYER
  --------------------------------------------------------- */
  const audioEl = document.getElementById('audioEl');
  const vinyl = document.getElementById('vinyl');
  const playerPlay = document.getElementById('playerPlay');
  const playerPrev = document.getElementById('playerPrev');
  const playerNext = document.getElementById('playerNext');
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const playerBarFill = document.getElementById('playerBarFill');
  const playerBar = document.querySelector('.player-bar');
  const playerCurrent = document.getElementById('playerCurrent');
  const playerDuration = document.getElementById('playerDuration');
  const playerList = document.getElementById('playerList');
  let trackIndex = 0;

  function fmtTime(sec){
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function renderPlaylist(){
    playerList.innerHTML = '';
    if (playlist.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No songs added yet — see songs/README.txt';
      playerList.appendChild(li);
      return;
    }
    playlist.forEach((song, i) => {
      const li = document.createElement('li');
      li.textContent = `${song.title} — ${song.artist}`;
      if (i === trackIndex) li.classList.add('active');
      li.addEventListener('click', () => loadTrack(i, true));
      playerList.appendChild(li);
    });
  }

  function loadTrack(i, autoplay){
    if (playlist.length === 0) return;
    trackIndex = (i + playlist.length) % playlist.length;
    const song = playlist[trackIndex];
    audioEl.src = song.src;
    trackTitle.textContent = song.title;
    trackArtist.textContent = song.artist;
    renderPlaylist();
    if (autoplay) playAudio();
  }

  function playAudio(){
    if (playlist.length === 0) return;
    audioEl.play().catch(() => {});
    vinyl.classList.add('spinning');
    playerPlay.textContent = '⏸';
  }
  function pauseAudio(){
    audioEl.pause();
    vinyl.classList.remove('spinning');
    playerPlay.textContent = '▶';
  }
  playerPlay.addEventListener('click', () => {
    if (playlist.length === 0) return;
    if (audioEl.paused) playAudio(); else pauseAudio();
  });
  playerPrev.addEventListener('click', () => loadTrack(trackIndex - 1, true));
  playerNext.addEventListener('click', () => loadTrack(trackIndex + 1, true));
  audioEl.addEventListener('timeupdate', () => {
    playerBarFill.style.width = (audioEl.currentTime / audioEl.duration * 100 || 0) + '%';
    playerCurrent.textContent = fmtTime(audioEl.currentTime);
  });
  audioEl.addEventListener('loadedmetadata', () => {
    playerDuration.textContent = fmtTime(audioEl.duration);
  });
  audioEl.addEventListener('ended', () => loadTrack(trackIndex + 1, true));
  playerBar.addEventListener('click', (e) => {
    const rect = playerBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioEl.duration) audioEl.currentTime = pct * audioEl.duration;
  });
  renderPlaylist();
  if (playlist.length > 0) loadTrack(0, false);

  /* ---------------------------------------------------------
     13. 3D GLOWING HEART — tilt on cursor / tap pulse
  --------------------------------------------------------- */
  const heart3dStage = document.getElementById('heart3dStage');
  const heart3dEl = document.getElementById('heart3dEl');
  heart3dStage.addEventListener('mousemove', (e) => {
    const rect = heart3dStage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    heart3dEl.style.transform = `rotateY(${px * 40}deg) rotateX(${-py * 30 + 8}deg)`;
  });
  heart3dStage.addEventListener('mouseleave', () => { heart3dEl.style.transform = ''; });
  heart3dEl.addEventListener('click', () => {
    heart3dEl.classList.remove('burst'); void heart3dEl.offsetWidth;
    heart3dEl.classList.add('burst');
    spawnBurstHearts(12);
  });

  /* ---------------------------------------------------------
     14. ROTATING QUOTES
  --------------------------------------------------------- */
  const quoteText = document.getElementById('quoteText');
  const quoteDotsEl = document.getElementById('quoteDots');
  let quoteIndex = 0;
  quotes.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    quoteDotsEl.appendChild(dot);
  });
  function showQuote(i){
    quoteText.style.opacity = 0;
    setTimeout(() => {
      quoteText.textContent = quotes[i];
      quoteText.style.opacity = 1;
      Array.from(quoteDotsEl.children).forEach((d, di) => d.classList.toggle('active', di === i));
    }, 400);
  }
  showQuote(0);
  setInterval(() => { quoteIndex = (quoteIndex + 1) % quotes.length; showQuote(quoteIndex); }, 4200);

  /* ---------------------------------------------------------
     15. LIGHTBOX
  --------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  function openLightbox(src){
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
  document.querySelectorAll('.memory-slide img').forEach(img => img.addEventListener('click', () => openLightbox(img.src)));

  /* ---------------------------------------------------------
     16. FIREWORKS CANVAS (finale)
  --------------------------------------------------------- */
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas.getContext('2d');
  let fwParticles = [];
  let fwRunning = false;
  function sizeFw(){
    fwCanvas.width = fwCanvas.offsetWidth;
    fwCanvas.height = fwCanvas.offsetHeight;
  }
  function launchFirework(){
    const x = Math.random() * fwCanvas.width;
    const y = Math.random() * fwCanvas.height * 0.55 + 20;
    const colors = ['#f6c9dc', '#e7b65c', '#c9b6e8', '#fff7f1'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 34;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.4 + Math.random() * 2;
      fwParticles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 60 + Math.random() * 20, color, size: 1.6 + Math.random() * 1.6
      });
    }
  }
  function fwLoop(){
    if (!fwRunning) return;
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.025; p.life -= 1;
      fwCtx.globalAlpha = Math.max(p.life / 80, 0);
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fillStyle = p.color;
      fwCtx.fill();
    });
    fwCtx.globalAlpha = 1;
    fwParticles = fwParticles.filter(p => p.life > 0);
    requestAnimationFrame(fwLoop);
  }
  let fwInterval;
  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fwRunning && !reduceMotion) {
        sizeFw();
        fwRunning = true;
        fwLoop();
        launchFirework();
        fwInterval = setInterval(launchFirework, 1000);
      } else if (!entry.isIntersecting && fwRunning) {
        fwRunning = false;
        clearInterval(fwInterval);
      }
    });
  }, { threshold: 0.4 });
  finaleObserver.observe(document.getElementById('finale'));
  window.addEventListener('resize', debounce(sizeFw, 300));

  /* ---------------------------------------------------------
     17. UTILITIES
  --------------------------------------------------------- */
  function debounce(fn, wait){
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), wait); };
  }

  function attachSwipe(el, onLeft, onRight){
    let startX = 0, tracking = false;
    el.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; tracking = true; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (!tracking) return;
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) { diff < 0 ? onLeft() : onRight(); }
      tracking = false;
    });
  }

})();
