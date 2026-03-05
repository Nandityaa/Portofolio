document.addEventListener("DOMContentLoaded", function () {
  const fadeElements = document.querySelectorAll('.scroll-fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });

  // Mobile/Tablet: Toggle effects on scroll (since no hover on touch)
  if ('ontouchstart' in window || window.matchMedia('(max-width: 1024px)').matches) {
    // ALL grayscale images — color only when in center of screen
    const allImages = document.querySelectorAll(
      'img:not(.opening img):not(.skill img):not(.language-logo):not(footer img):not(.menu-icon img)'
    );

    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, {
      root: null,
      rootMargin: '-25% 0px -25% 0px',  // Only center 50% of viewport counts
      threshold: 0.1
    });

    allImages.forEach(img => {
      imgObserver.observe(img);
    });

    // Skill cards + Project cards — auto hover when in center
    const hoverCards = document.querySelectorAll('.skill, .project-card');

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -20% 0px',  // Center 60% of viewport
      threshold: 0.2
    });

    hoverCards.forEach(card => {
      cardObserver.observe(card);
    });
  }
});
// Menampilkan ikon panah saat scroll melewati setengah halaman
window.onscroll = function () {
  const backToTop = document.getElementById("backToTop");
  if (window.scrollY > window.innerHeight / 2) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
};

// Fungsi scroll ke atas
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mobile Menu Toggle
const menuIcon = document.getElementById('menu-icon');
const navMenu = document.getElementById('nav-menu');
const menuOpenIcon = document.getElementById('menu-open-icon');
const menuCloseIcon = document.getElementById('menu-close-icon');

function toggleMenuIcons(isActive) {
  if (menuOpenIcon && menuCloseIcon) {
    menuOpenIcon.style.display = isActive ? 'none' : 'block';
    menuCloseIcon.style.display = isActive ? 'block' : 'none';
  }
}

if (menuIcon && navMenu) {
  menuIcon.addEventListener('click', (e) => {
    navMenu.classList.toggle('active');
    toggleMenuIcons(navMenu.classList.contains('active'));
    e.stopPropagation(); // Prevent click from bubbling to document
  });

  // Close menu when a link is clicked
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleMenuIcons(false);
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuIcon.contains(e.target)) {
      navMenu.classList.remove('active');
      toggleMenuIcons(false);
    }
  });
}

// ==================== iPHONE NOTIFICATION ====================
var notifTimer = null;
var notifEl = document.getElementById('toast-notification');

function showNotif(isError) {
  if (!notifEl) return;
  clearTimeout(notifTimer);

  var title = notifEl.querySelector('.ios-notif-title');
  var msg = notifEl.querySelector('.ios-notif-msg');
  if (isError) {
    title.textContent = 'Notification';
    msg.textContent = 'Failed to send message';
  } else {
    title.textContent = 'Notification';
    msg.textContent = 'Message sent successfully';
  }

  // Reset
  notifEl.style.transition = '';
  notifEl.style.transform = '';
  notifEl.classList.remove('show');

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      notifEl.classList.add('show');
    });
  });

  notifTimer = setTimeout(function () { hideNotif(); }, 4000);
}

function hideNotif() {
  if (!notifEl) return;
  notifEl.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 1, 1), opacity 0.3s ease';
  notifEl.style.transform = 'translate3d(-50%, -120%, 0)';
  notifEl.style.opacity = '0';
  setTimeout(function () {
    notifEl.classList.remove('show');
    notifEl.style.transition = '';
    notifEl.style.transform = '';
    notifEl.style.opacity = '';
  }, 400);
}

// Swipe-to-dismiss (touch)
(function () {
  if (!notifEl) return;
  var startX = 0, startY = 0, dx = 0, dy = 0, startTime = 0, swiping = false;

  notifEl.addEventListener('touchstart', function (e) {
    if (!notifEl.classList.contains('show')) return;
    clearTimeout(notifTimer);
    var t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    startTime = Date.now();
    dx = 0;
    dy = 0;
    swiping = true;
    notifEl.style.transition = 'none';
  }, { passive: true });

  notifEl.addEventListener('touchmove', function (e) {
    if (!swiping) return;
    var t = e.touches[0];
    dx = t.clientX - startX;
    dy = t.clientY - startY;

    // Only allow upward or sideways (not down)
    var moveY = Math.min(dy, 0);
    var dist = Math.sqrt(dx * dx + moveY * moveY);
    var opacity = Math.max(0, 1 - dist / 200);

    notifEl.style.transform = 'translate3d(calc(-50% + ' + dx + 'px), ' + moveY + 'px, 0)';
    notifEl.style.opacity = opacity;
  }, { passive: true });

  notifEl.addEventListener('touchend', function () {
    if (!swiping) return;
    swiping = false;

    var elapsed = Date.now() - startTime;
    var velocityX = Math.abs(dx) / elapsed;
    var velocityY = Math.abs(Math.min(dy, 0)) / elapsed;
    var swipedAway = Math.abs(dx) > 80 || Math.min(dy, 0) < -60 || velocityX > 0.5 || velocityY > 0.4;

    if (swipedAway) {
      // Fly out in swipe direction
      var flyX = dx > 0 ? 300 : dx < -30 ? -300 : 0;
      var flyY = dy < -30 ? -300 : 0;
      notifEl.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.25s ease';
      notifEl.style.transform = 'translate3d(calc(-50% + ' + flyX + 'px), ' + flyY + 'px, 0)';
      notifEl.style.opacity = '0';
      setTimeout(function () {
        notifEl.classList.remove('show');
        notifEl.style.transition = '';
        notifEl.style.transform = '';
        notifEl.style.opacity = '';
      }, 350);
    } else {
      // Snap back
      notifEl.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
      notifEl.style.transform = 'translate3d(-50%, 0, 0)';
      notifEl.style.opacity = '1';
      notifTimer = setTimeout(function () { hideNotif(); }, 3000);
    }
  }, { passive: true });
})();

// Submit contact form via fetch + show notification
var contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(contactForm);
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          showNotif();
          contactForm.reset();
        } else {
          showNotif(true);
        }
      })
      .catch(function () {
        showNotif(true);
      })
      .finally(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}

// ==================== CODE TYPING ANIMATION ====================
(function () {
  var codeTarget = document.getElementById('codeTyping');
  if (!codeTarget) return;

  // Each character mapped to its syntax class
  var codeTokens = [
    // while
    { ch: 'w', cls: 'syn-keyword' },
    { ch: 'h', cls: 'syn-keyword' },
    { ch: 'i', cls: 'syn-keyword' },
    { ch: 'l', cls: 'syn-keyword' },
    { ch: 'e', cls: 'syn-keyword' },
    // (
    { ch: '(', cls: 'syn-bracket' },
    // learning
    { ch: 'l', cls: 'syn-variable' },
    { ch: 'e', cls: 'syn-variable' },
    { ch: 'a', cls: 'syn-variable' },
    { ch: 'r', cls: 'syn-variable' },
    { ch: 'n', cls: 'syn-variable' },
    { ch: 'i', cls: 'syn-variable' },
    { ch: 'n', cls: 'syn-variable' },
    { ch: 'g', cls: 'syn-variable' },
    // )
    { ch: ')', cls: 'syn-bracket' },
    // space
    { ch: '\u00A0', cls: 'syn-space' },
    // {
    { ch: '{', cls: 'syn-bracket' },
    // space
    { ch: '\u00A0', cls: 'syn-space' },
    // build
    { ch: 'b', cls: 'syn-function' },
    { ch: 'u', cls: 'syn-function' },
    { ch: 'i', cls: 'syn-function' },
    { ch: 'l', cls: 'syn-function' },
    { ch: 'd', cls: 'syn-function' },
    // ();
    { ch: '(', cls: 'syn-operator' },
    { ch: ')', cls: 'syn-operator' },
    { ch: ';', cls: 'syn-operator' },
    // space
    { ch: '\u00A0', cls: 'syn-space' },
    // }
    { ch: '}', cls: 'syn-bracket' }
  ];

  // Color map for particles
  var colorMap = {
    'syn-keyword': '#c678dd',
    'syn-bracket': '#e5c07b',
    'syn-variable': '#98c379',
    'syn-function': '#61afef',
    'syn-operator': '#abb2bf',
    'syn-space': 'transparent'
  };

  var container = codeTarget.parentElement;
  var currentIndex = 0;
  var isTyping = true;

  function spawnParticles(charSpan, color) {
    if (color === 'transparent') return;
    var rect = charSpan.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();
    var cx = rect.left - containerRect.left + rect.width / 2;
    var cy = rect.top - containerRect.top + rect.height / 2;

    var count = 4 + Math.floor(Math.random() * 3); // 4-6 particles
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('span');
      particle.className = 'typing-particle';
      var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      var dist = 12 + Math.random() * 18;
      particle.style.left = cx + 'px';
      particle.style.top = cy + 'px';
      particle.style.background = color;
      particle.style.boxShadow = '0 0 4px ' + color;
      particle.style.setProperty('--px', Math.cos(angle) * dist + 'px');
      particle.style.setProperty('--py', Math.sin(angle) * dist + 'px');
      container.appendChild(particle);

      // Clean up after animation
      (function (p) {
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 600);
      })(particle);
    }
  }

  function typeNext() {
    if (currentIndex < codeTokens.length) {
      var token = codeTokens[currentIndex];
      var span = document.createElement('span');
      span.className = token.cls;
      span.textContent = token.ch;
      span.style.opacity = '0';
      codeTarget.appendChild(span);

      // Animate character appearing
      requestAnimationFrame(function () {
        span.style.transition = 'opacity 0.1s ease';
        span.style.opacity = '1';
      });

      spawnParticles(span, colorMap[token.cls]);
      currentIndex++;
      setTimeout(typeNext, 70 + Math.random() * 40);
    } else {
      // Done typing — hold, then erase
      setTimeout(eraseNext, 2000);
    }
  }

  function eraseNext() {
    if (codeTarget.children.length > 0) {
      codeTarget.removeChild(codeTarget.lastChild);
      setTimeout(eraseNext, 35);
    } else {
      // Done erasing — pause, then restart
      currentIndex = 0;
      setTimeout(typeNext, 1000);
    }
  }

  // Start after page entrance animations
  setTimeout(typeNext, 1500);
})();

// ==================== CARD 1-by-1 CAROUSEL (Mobile/Tablet) ====================
(function () {
  var container = document.querySelector('.project-container');
  if (!container) return;

  var cards = Array.prototype.slice.call(container.querySelectorAll('.project-card'));
  if (cards.length === 0) return;

  var currentIndex = 0;
  var dotsContainer = null;
  var hintEl = null;
  var dots = [];
  var isActive = false;
  var isAnimating = false;

  var mql = window.matchMedia('(max-width: 768px)');

  function createUI() {
    if (dotsContainer) return;

    // Dots
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'stack-dots';
    for (var i = 0; i < cards.length; i++) {
      var dot = document.createElement('span');
      dot.className = 'stack-dot';
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function (e) {
        e.stopPropagation(); // prevent card click
        var idx = parseInt(this.getAttribute('data-index'));
        if (idx !== currentIndex) goTo(idx);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
    container.parentNode.appendChild(dotsContainer);

    // Swipe Hint
    hintEl = document.createElement('p');
    hintEl.className = 'swipe-hint';
    hintEl.textContent = '👆 Click or swipe right-to-left for next';
    container.parentNode.appendChild(hintEl);

    // Setup cards click to go next
    for (var c = 0; c < cards.length; c++) {
      cards[c].addEventListener('click', onCardClick);
    }
  }

  function removeUI() {
    if (dotsContainer && dotsContainer.parentNode) {
      dotsContainer.parentNode.removeChild(dotsContainer);
      dotsContainer = null;
      dots = [];
    }
    if (hintEl && hintEl.parentNode) {
      hintEl.parentNode.removeChild(hintEl);
      hintEl = null;
    }
    for (var c = 0; c < cards.length; c++) {
      cards[c].removeEventListener('click', onCardClick);
    }
  }

  function onCardClick() {
    if (!isActive || isAnimating) return;
    goTo(currentIndex < cards.length - 1 ? currentIndex + 1 : 0);
  }

  function goTo(index) {
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;

    var oldCard = cards[currentIndex];
    var newCard = cards[index];

    // Mark dots
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle('active', d === index);
    }

    // Animate old card out to the left
    oldCard.classList.remove('active');
    oldCard.classList.add('slide-out');

    // Animate new card in (it starts from right naturally from CSS)
    newCard.classList.remove('slide-out');
    // Force reflow so it transitions gracefully
    void newCard.offsetWidth;
    newCard.classList.add('active');

    currentIndex = index;

    // Wait for transition (400ms) to clean up old card
    setTimeout(function () {
      oldCard.classList.remove('slide-out'); // Resets to default right position invisibly
      isAnimating = false;
    }, 450);
  }

  // --- Touch Swipe support ---
  var startX = 0, dx = 0, startTime = 0;

  function initTouch() {
    container.addEventListener('touchstart', function (e) {
      if (!isActive || isAnimating) return;
      startX = e.touches[0].clientX;
      startTime = Date.now();
      dx = 0;
    }, { passive: true });

    container.addEventListener('touchmove', function (e) {
      if (!isActive || isAnimating) return;
      dx = e.touches[0].clientX - startX;
    }, { passive: true });

    container.addEventListener('touchend', function () {
      if (!isActive || isAnimating) return;
      var elapsed = Date.now() - startTime;
      var velocity = Math.abs(dx) / elapsed;
      var threshold = Math.abs(dx) > 40 || velocity > 0.4;

      if (threshold && dx < 0) {
        // Swipe left -> go next
        goTo(currentIndex < cards.length - 1 ? currentIndex + 1 : 0);
      } else if (threshold && dx > 0) {
        // Swipe right -> go prev
        goTo(currentIndex > 0 ? currentIndex - 1 : cards.length - 1);
      }
    }, { passive: true });
  }

  function activate() {
    if (isActive) return;
    isActive = true;
    createUI();

    // Reset states
    for (var i = 0; i < cards.length; i++) {
      cards[i].className = 'project-card';
      if (i === 0) cards[i].classList.add('active');
    }
    currentIndex = 0;
    isAnimating = false;
    initTouch();
  }

  function deactivate() {
    if (!isActive) return;
    isActive = false;
    removeUI();

    // Reset classes
    for (var i = 0; i < cards.length; i++) {
      cards[i].className = 'project-card';
    }
  }

  if (mql.matches) activate();
  mql.addEventListener('change', function (e) {
    if (e.matches) activate();
    else deactivate();
  });
})();
