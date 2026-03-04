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

// ==================== TOAST NOTIFICATION ====================
function dismissToast() {
  const toast = document.getElementById('toast-notification');
  if (toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.style.display = 'none', 500);
  }
}

// Submit contact form via fetch (no redirect) + show toast
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          showToast();
          contactForm.reset();
        } else {
          showToast(true);
        }
      })
      .catch(function () {
        showToast(true);
      })
      .finally(function () {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
  });
}

function showToast(isError) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  if (isError) {
    toast.querySelector('.toast-title').textContent = 'Failed to Send';
    toast.querySelector('.toast-desc').textContent = 'Something went wrong. Please try again.';
    toast.style.borderLeftColor = '#f87171';
    toast.querySelector('.toast-icon svg').setAttribute('stroke', '#f87171');
  } else {
    toast.querySelector('.toast-title').textContent = 'Message Sent';
    toast.querySelector('.toast-desc').textContent = 'Your message has been delivered successfully.';
    toast.style.borderLeftColor = '#4ade80';
    toast.querySelector('.toast-icon svg').setAttribute('stroke', '#4ade80');
  }

  // Reset animations
  const progress = toast.querySelector('.toast-progress');
  progress.style.animation = 'none';
  toast.classList.remove('show', 'hide');

  toast.style.display = 'flex';
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add('show');
      progress.style.animation = '';
    });
  });

  setTimeout(function () { dismissToast(); }, 5000);
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
