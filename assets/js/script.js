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
});

document.getElementById("contactToggle").addEventListener("click", function () {
  var formContainer = document.getElementById("contactFormContainer");
  var toggleButton = document.getElementById("contactToggle");

  formContainer.style.maxHeight = "500px"; // Adjust the max height as needed
  formContainer.style.opacity = "1"; // Show the form smoothly
  toggleButton.style.opacity = "0"; // Make the button fade out
  setTimeout(function () {
    toggleButton.style.display = "none"; // Hide the button after transition
  }, 500); // Delay to match the transition duration
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
