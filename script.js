document.addEventListener("DOMContentLoaded", function() {
    const fadeElements = document.querySelectorAll('.scroll-fade-in');
  
    const handleScrollAnimation = () => {
      fadeElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.9) {
          element.classList.add('show');
        }
      });
    };
  
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Call on load in case some elements are already in view
  });
  
  // Menampilkan ikon panah saat scroll melewati setengah halaman
window.onscroll = function() {
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