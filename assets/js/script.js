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

document.getElementById("contactToggle").addEventListener("click", function () {
  var formContainer = document.getElementById("contactFormContainer");
  var toggleButton = document.getElementById("contactToggle");
  var isOpen = formContainer.classList.contains("open");

  if (!isOpen) {
    formContainer.classList.add("open");
    formContainer.style.maxHeight = formContainer.scrollHeight + "px";
    formContainer.style.opacity = "1";
    toggleButton.textContent = "Close";
  } else {
    formContainer.classList.remove("open");
    formContainer.style.maxHeight = "0";
    formContainer.style.opacity = "0";
    toggleButton.textContent = "Contact Me";
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
