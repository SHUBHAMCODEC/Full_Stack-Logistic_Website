// js for Video 
const video = document.getElementById("heroVideo");
video.playbackRate = 0.6; // Adjust between 0.3 to 0.9 for smoother speed

// -----------------------------Hamburger ----------------------------------------------

  const hamburger = document.getElementById('hamburger');
  const headerMenu = document.querySelector('.head');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    headerMenu.classList.toggle('active');
  });


  const button=document.getElementById('cta-button');

  button.addEventListener("click", function() {
    alert("⚙️ This section is currently under maintenance. Please check back later!");
  });


// gradient line js

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const line = entry.target.querySelector('.scroll-line');
      if (entry.isIntersecting) {
        line.style.animation = 'none'; // Reset animation
        void line.offsetWidth;         // Trigger reflow
        line.style.animation = 'gradient-flow 6s ease infinite, line-entrance 1s ease forwards';
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(document.querySelector('.scroll-line-wrapper'));


  // <!-- ----------------------------------night Theam----------------- -->

  const canvas = document.getElementById("spaceCanvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  let stars = [], comets = [], spaceship = { x: -200, y: 100, speed: 2 };
  
  for (let i = 0; i < 400; i++) {
      stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.2 + 0.05,
      });
  }
  
  function spawnComet() {
      comets.push({
          x: Math.random() * canvas.width,
          y: 0,
          dx: Math.random() * 2 - 1,
          dy: Math.random() * 3 + 1,
          size: Math.random() * 3 + 2,
      });
  }
  
  function drawSpaceship() {
      const img = new Image();
      img.src = './image/spaceship.png'; // Replace with your spaceship image
      ctx.drawImage(img, spaceship.x, spaceship.y, 150, 80);
  }
  
  function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw stars
      stars.forEach(star => {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
  
          star.y += star.speed;
          if (star.y > canvas.height) star.y = 0;
      });
  
      // Draw comets
      comets.forEach((c, i) => {
          ctx.fillStyle = "#ffdddd";
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ff5555";
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x - c.dx * 10, c.y - c.dy * 10);
          ctx.stroke();
  
          c.x += c.dx;
          c.y += c.dy;
          if (c.y > canvas.height) comets.splice(i, 1);
      });
  
      // Draw spaceship
      spaceship.x += spaceship.speed;
      if (spaceship.x > canvas.width + 200) spaceship.x = -200;
      drawSpaceship();
  
      requestAnimationFrame(animate);
  }
  
  setInterval(spawnComet, 2000);
  animate();
  
  window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  });
//   

