

// Form functionality (already existing)
document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const response = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
      document.getElementById("successMsg").innerText = "✅ Your message has been sent successfully!";
      document.getElementById("successMsg").style.display = "block";
      this.reset();
    } else {
      document.getElementById("successMsg").innerText = "⚠️ Failed to send message. Please try again.";
      document.getElementById("successMsg").style.display = "block";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("successMsg").innerText = "🚨 Server error. Please try again later.";
    document.getElementById("successMsg").style.display = "block";
  }
});


// === Hamburger Menu Toggle ===
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

// Optional: Close menu when clicking a link (for better UX)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

