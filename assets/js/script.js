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

// Check if redirected from FormSubmit (?sent=true)
(function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get('sent') === 'true') {
    const toast = document.getElementById('toast-notification');
    if (toast) {
      // Small delay for page load, then slide in
      setTimeout(() => {
        toast.style.display = 'flex';
        requestAnimationFrame(() => toast.classList.add('show'));
      }, 300);

      // Auto-dismiss after 4s (matches CSS progress bar)
      setTimeout(() => dismissToast(), 4300);

      // Clean up URL (remove ?sent=true)
      history.replaceState(null, '', window.location.pathname);
    }
  }
})();
