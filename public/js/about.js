const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  // Toggle menu when hamburger clicked
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent this click from triggering document click
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });