// Полный рабочий JS с 3D эффектами, снегом, звуками и анимациями
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация
  console.log('%c🎄 ScrapTeam 2026 - С Новым Годом! 🎄', 
    'color: #ff5b5b; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #ff5b5b');
  
  // Элементы
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const settingsClose = document.getElementById('settingsClose');
  const themeToggleSwitch = document.getElementById('themeToggleSwitch');
  const toggleAnimations = document.getElementById('toggleAnimations');
  const toggleGuard = document.getElementById('toggleGuard');
  const toggleSnow = document.getElementById('toggleSnow');
  const toggleStars = document.getElementById('toggleStars');
  const toggleSound = document.getElementById('toggleSound');
  const resetSettings = document.getElementById('resetSettings');
  const navLinks = document.querySelectorAll('[data-route]');
  const confettiBtn = document.getElementById('confettiBtn');
  const fireworksBtn = document.getElementById('fireworksBtn');
  const musicToggle = document.getElementById('musicToggle');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const pageTransition = document.getElementById('pageTransition');
  const header = document.getElementById('siteHeader');
  
  // Аудио элементы
  const confettiSound = document.getElementById('confettiSound');
  const clickSound = document.getElementById('clickSound');
  const hoverSound = document.getElementById('hoverSound');
  const christmasMusic = document.getElementById('christmasMusic');
  
  // Canvas элементы
  const snowCanvas = document.getElementById('snowCanvas');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const starsCanvas = document.getElementById('starsCanvas');
  const particlesContainer = document.getElementById('particlesContainer');
  
  // Состояние по умолчанию
  const defaultState = { 
    theme: 'dark', 
    animations: true, 
    guard: false, 
    snow: true,
    stars: false,
    sound: true,
    parallax: true,
    music: false
  };
  
  // Загрузка сохранённого состояния
  const saved = JSON.parse(localStorage.getItem('scrapteam_state') || '{}');
  const state = Object.assign({}, defaultState, saved);
  
  // Инициализация звуков
  let soundEnabled = state.sound;
  
  // Применение начального состояния
  applyTheme(state.theme);
  applyAnimations(state.animations);
  applyGuard(state.guard);
  applySnow(state.snow);
  applyStars(state.stars);
  applySound(state.sound);
  setControls();
  
  // Звуковые эффекты
  function playSound(sound) {
    if (!soundEnabled) return;
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio error:", e));
  }
  
  // Эффект клика для всех кнопок
  document.querySelectorAll('button, .btn, .nav-link').forEach(el => {
    el.addEventListener('click', () => playSound(clickSound));
    el.addEventListener('mouseenter', () => playSound(hoverSound));
  });
  
  // ==================== НАСТРОЙКИ ====================
  
  // Открытие/закрытие панели настроек
  settingsToggle.addEventListener('click', () => {
    const open = settingsPanel.classList.toggle('open');
    settingsPanel.setAttribute('aria-hidden', !open);
    settingsToggle.setAttribute('aria-expanded', open);
    if (open) animatePanelItems();
  });
  
  settingsClose.addEventListener('click', closeSettings);
  
  function closeSettings() {
    settingsPanel.classList.remove('open');
    settingsPanel.setAttribute('aria-hidden', 'true');
    settingsToggle.setAttribute('aria-expanded', 'false');
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
    if (e.key === 'F11') toggleFullscreen();
  });
  
  // Переключение темы
  themeToggleSwitch.addEventListener('change', (e) => {
    state.theme = e.target.checked ? 'light' : 'dark';
    applyTheme(state.theme);
    saveState();
  });
  
  function applyTheme(theme) {
    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
    
    // Обновляем 3D тени
    update3DShadows();
  }
  
  // Анимации
  toggleAnimations.addEventListener('change', (e) => {
    state.animations = !!e.target.checked;
    applyAnimations(state.animations);
    saveState();
  });
  
  function applyAnimations(on) {
    document.body.classList.toggle('animations-on', on);
    document.body.classList.toggle('animations-off', !on);
  }
  
  // Защита контекстного меню
  toggleGuard.addEventListener('change', (e) => {
    state.guard = !!e.target.checked;
    applyGuard(state.guard);
    saveState();
  });
  
  function applyGuard(on) {
    if (on) {
      document.addEventListener('contextmenu', blockContext);
      document.addEventListener('keydown', blockDevTools);
    } else {
      document.removeEventListener('contextmenu', blockContext);
      document.removeEventListener('keydown', blockDevTools);
    }
  }
  
  function blockContext(e) {
    e.preventDefault();
    showNotification('Контекстное меню заблокировано', 'warning');
  }
  
  function blockDevTools(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
      showNotification('Инструменты разработчика заблокированы', 'warning');
    }
  }
  
  // Снег
  toggleSnow.addEventListener('change', (e) => {
    state.snow = !!e.target.checked;
    applySnow(state.snow);
    saveState();
  });
  
  // Звёзды
  toggleStars.addEventListener('change', (e) => {
    state.stars = !!e.target.checked;
    applyStars(state.stars);
    saveState();
  });
  
  // Звук
  toggleSound.addEventListener('change', (e) => {
    state.sound = !!e.target.checked;
    applySound(state.sound);
    saveState();
  });
  
  function applySound(on) {
    soundEnabled = on;
    christmasMusic.muted = !on;
  }
  
  // Музыка
  musicToggle.addEventListener('click', () => {
    state.music = !state.music;
    if (state.music) {
      christmasMusic.play();
      musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      showNotification('Музыка включена', 'success');
    } else {
      christmasMusic.pause();
      musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
    saveState();
  });
  
  // Полноэкранный режим
  fullscreenToggle.addEventListener('click', toggleFullscreen);
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      document.exitFullscreen();
      fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
    }
  }
  
  // Сброс настроек
  resetSettings.addEventListener('click', () => {
    if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
      Object.assign(state, defaultState);
      applyTheme(state.theme);
      applyAnimations(state.animations);
      applyGuard(state.guard);
      applySnow(state.snow);
      applyStars(state.stars);
      applySound(state.sound);
      setControls();
      saveState();
      showNotification('Настройки сброшены', 'success');
    }
  });
  
  // Установка значений контролов
  function setControls() {
    themeToggleSwitch.checked = state.theme === 'light';
    toggleAnimations.checked = state.animations;
    toggleGuard.checked = state.guard;
    toggleSnow.checked = state.snow;
    toggleStars.checked = state.stars;
    toggleSound.checked = state.sound;
    musicToggle.innerHTML = state.music ? 
      '<i class="fas fa-volume-up"></i>' : 
      '<i class="fas fa-volume-mute"></i>';
  }
  
  // Сохранение состояния
  function saveState() {
    localStorage.setItem('scrapteam_state', JSON.stringify(state));
  }
  
  // ==================== НАВИГАЦИЯ ====================
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      navigateTo(id);
    });
  });
  
  function navigateTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    
    runPageTransition(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - (header.offsetHeight + 20);
      window.scrollTo({ top, behavior: state.animations ? 'smooth' : 'auto' });
      highlightNav(id);
      
      if (state.animations) {
        target.animate([
          { transform: 'scale(0.95) rotateX(5deg)', opacity: 0.9 },
          { transform: 'scale(1) rotateX(0deg)', opacity: 1 }
        ], { 
          duration: 500, 
          easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
        });
      }
    });
  }
  
  function runPageTransition(cb) {
    if (!state.animations) { cb(); return; }
    
    pageTransition.classList.add('active', 'enter');
    playSound(clickSound);
    
    setTimeout(() => {
      pageTransition.classList.remove('enter');
      pageTransition.classList.add('leave');
      cb();
      setTimeout(() => {
        pageTransition.classList.remove('leave', 'active');
      }, 500);
    }, 400);
  }
  
  function highlightNav(id) {
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href').slice(1) === id);
    });
  }
  
  // Автоматическое выделение навигации при скролле
  const sections = document.querySelectorAll('.section');
  
  function onScrollActive() {
    const offset = window.scrollY + (window.innerHeight / 3);
    let current = null;
    
    sections.forEach(s => {
      if (offset >= s.offsetTop) current = s;
    });
    
    if (current) highlightNav(current.id);
  }
  
  window.addEventListener('scroll', onScrollActive, { passive: true });
  onScrollActive();
  
  // ==================== 3D ЭФФЕКТЫ ====================
  
  // Эффект параллакса при движении мыши
  document.addEventListener('mousemove', (e) => {
    if (!state.animations) return;
    
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    
    document.querySelectorAll('.card-3d, .btn-3d').forEach(el => {
      el.style.transform = `translateZ(20px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    
    // Параллакс для шаров
    document.querySelectorAll('.orb').forEach((orb, i) => {
      const speed = 0.02 * (i + 1);
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
  
  function update3DShadows() {
    const isDark = state.theme === 'dark';
    const shadowIntensity = isDark ? 0.4 : 0.2;
    
    document.documentElement.style.setProperty('--shadow-intensity', shadowIntensity);
  }
  
  // ==================== СНЕЖНЫЙ ДВИЖОК ====================
  
  const sCtx = snowCanvas.getContext('2d');
  let sW = 0, sH = 0, sFlakes = [], sRAF = null;
  
  function initSnow() {
    if (!state.snow) return;
    
    sW = snowCanvas.width = window.innerWidth;
    sH = snowCanvas.height = window.innerHeight;
    
    const count = Math.max(150, Math.floor((sW * sH) / 5000));
    sFlakes = [];
    
    for (let i = 0; i < count; i++) {
      sFlakes.push({
        x: Math.random() * sW,
        y: Math.random() * sH,
        r: 1 + Math.random() * 4,
        s: 0.5 + Math.random() * 2,
        a: 0.3 + Math.random() * 0.7,
        drift: (Math.random() - 0.5) * 1.5,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: 0.01 + Math.random() * 0.02
      });
    }
    
    drawSnow();
  }
  
  function drawSnow() {
    if (!state.snow) return;
    
    sCtx.clearRect(0, 0, sW, sH);
    sCtx.fillStyle = '#ffffff';
    
    for (const flake of sFlakes) {
      sCtx.beginPath();
      sCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      sCtx.fill();
      
      // Анимация падения с качанием
      flake.y += flake.s;
      flake.x += Math.sin(flake.swing) * flake.drift;
      flake.swing += flake.swingSpeed;
      
      // Перерождение снежинок
      if (flake.y > sH + 10) {
        flake.y = -10;
        flake.x = Math.random() * sW;
      }
      if (flake.x > sW + 10) flake.x = -10;
      if (flake.x < -10) flake.x = sW + 10;
    }
    
    sRAF = requestAnimationFrame(drawSnow);
  }
  
  function applySnow(on) {
    if (on) {
      snowCanvas.style.display = 'block';
      initSnow();
      window.addEventListener('resize', initSnow);
    } else {
      cancelAnimationFrame(sRAF);
      sRAF = null;
      sCtx.clearRect(0, 0, sW, sH);
      snowCanvas.style.display = 'none';
      window.removeEventListener('resize', initSnow);
    }
  }
  
  // ==================== ЗВЁЗДНЫЙ ДОЖДЬ ====================
  
  const starsCtx = starsCanvas.getContext('2d');
  let stars = [], starsRAF = null;
  
  function initStars() {
    if (!state.stars) return;
    
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    
    stars = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 10000);
    
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        size: Math.random() * 3,
        speed: 0.2 + Math.random() * 1,
        opacity: 0.1 + Math.random() * 0.9
      });
    }
    
    drawStars();
  }
  
  function drawStars() {
    if (!state.stars) return;
    
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    
    for (const star of stars) {
      starsCtx.beginPath();
      starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      starsCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      starsCtx.fill();
      
      star.y += star.speed;
      if (star.y > starsCanvas.height) {
        star.y = 0;
        star.x = Math.random() * starsCanvas.width;
      }
    }
    
    starsRAF = requestAnimationFrame(drawStars);
  }
  
  function applyStars(on) {
    if (on) {
      starsCanvas.style.display = 'block';
      initStars();
      window.addEventListener('resize', initStars);
    } else {
      cancelAnimationFrame(starsRAF);
      starsRAF = null;
      starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      starsCanvas.style.display = 'none';
      window.removeEventListener('resize', initStars);
    }
  }
  
  // ==================== КОНФЕТТИ ====================
  
  const cCtx = confettiCanvas.getContext('2d');
  let confetti = [], confettiRAF = null;
  
  confettiBtn.addEventListener('click', () => {
    spawnConfetti(window.innerWidth / 2, 100, 200);
    playSound(confettiSound);
    showNotification('Конфетти! 🎉', 'success');
  });
  
  fireworksBtn.addEventListener('click', () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnConfetti(
          100 + Math.random() * (window.innerWidth - 200),
          100 + Math.random() * 100,
          100
        );
      }, i * 300);
    }
    showNotification('Фейерверк! 🎆', 'success');
  });
  
  function spawnConfetti(x, y, count) {
    const colors = ['#ff5b5b', '#7c5cff', '#39e5a8', '#ffaa2b', '#ffd166', '#ff66cc', '#66ccff'];
    
    for (let i = 0; i < count; i++) {
      confetti.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: -8 - Math.random() * 8,
        r: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 20,
        life: 100 + Math.random() * 60,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }
    
    if (!confettiRAF) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      drawConfetti();
    }
  }
  
  function drawConfetti() {
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    for (let i = confetti.length - 1; i >= 0; i--) {
      const p = confetti[i];
      
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // гравитация
      p.vx *= 0.99; // сопротивление воздуха
      p.rot += p.vr;
      p.life--;
      
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.rot * Math.PI / 180);
      cCtx.fillStyle = p.color;
      cCtx.globalAlpha = Math.min(1, p.life / 50);
      
      if (p.shape === 'circle') {
        cCtx.beginPath();
        cCtx.arc(0, 0, p.r, 0, Math.PI * 2);
        cCtx.fill();
      } else {
        cCtx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 0.6);
      }
      
      cCtx.restore();
      
      if (p.y > confettiCanvas.height + 50 || p.life <= 0) {
        confetti.splice(i, 1);
      }
    }
    
    if (confetti.length) {
      confettiRAF = requestAnimationFrame(drawConfetti);
    } else {
      confettiRAF = null;
    }
  }
  
  // ==================== ЧАСТИЦЫ ====================
  
  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: #fff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
      left: ${x}px;
      top: ${y}px;
    `;
    
    particlesContainer.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    const life = 20 + Math.random() * 30;
    
    let frame = 0;
    
    function animate() {
      frame++;
      particle.style.opacity = 1 - (frame / life);
      particle.style.transform = `translate(${Math.cos(angle) * speed * frame}px, 
                                            ${Math.sin(angle) * speed * frame}px)`;
      
      if (frame < life) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    }
    
    animate();
  }
  
  // Эффект частиц при клике
  document.addEventListener('click', (e) => {
    if (!state.animations) return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createParticle(e.clientX, e.clientY);
      }, i * 50);
    }
  });
  
  // ==================== УТИЛИТЫ ====================
  
  function showNotification(message, type = 'info') {
    if (!state.animations) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      padding: 15px 25px;
      background: ${type === 'success' ? 'rgba(57, 229, 168, 0.9)' : 
                  type === 'warning' ? 'rgba(255, 170, 43, 0.9)' : 
                  'rgba(124, 92, 255, 0.9)'};
      color: white;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      z-index: 10000;
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(120%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  function animatePanelItems() {
    const items = settingsPanel.querySelectorAll('.setting');
    items.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('slide-in');
      }, i * 100);
    });
  }
  
  // Анимация элементов при загрузке
  document.querySelectorAll('.fade-item').forEach((el, i) => {
    el.style.animationDelay = `${0.1 * i}s`;
  });
  
  // Обновление размеров canvas при изменении окна
  window.addEventListener('resize', () => {
    if (state.snow) initSnow();
    if (state.stars) initStars();
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });
  
  // Инициализация
  initSnow();
  initStars();
  update3DShadows();
  
  // Показать приветственное сообщение
  setTimeout(() => {
    showNotification('Добро пожаловать в ScrapTeam! 🎮', 'success');
  }, 1000);
  
  // Сохранение состояния при закрытии
  window.addEventListener('beforeunload', () => {
    saveState();
    christmasMusic.pause();
  });
  
  // Глобальные функции
  window.launchConfetti = (x, y, count) => spawnConfetti(x, y, count);
  window.toggleSnow = () => {
    state.snow = !state.snow;
    toggleSnow.checked = state.snow;
    applySnow(state.snow);
    saveState();
    showNotification(state.snow ? 'Снег включён ❄️' : 'Снег выключен', 'info');
  };
  
  console.log('ScrapTeam инициализирован! 🚀');
});