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
// TEMPORARILY DISABLED — uncomment after FormSubmit activation
/*
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
*/

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

  // Reset animation
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
