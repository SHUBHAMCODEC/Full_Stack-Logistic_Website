const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".attributes");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("open");
  });

  // Optional: Close the menu when clicking a link
  document.querySelectorAll(".attributes a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("open");
    });
  });
  // Auto close when clicking outside
document.addEventListener("click", (event) => {
  const isClickInsideMenu = navMenu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (!isClickInsideMenu && !isClickOnHamburger) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  }
});

  const form = document.getElementById('reviewForm');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const company = document.getElementById("company").value.trim();
  const review = document.getElementById("review").value.trim();

  // Find selected rating
  const ratingInput = document.querySelector('input[name="rating"]:checked');
  const rating = ratingInput ? ratingInput.id.replace("star", "") : "0";

  try {
    const response = await fetch("http://localhost:5000/api/service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, rating, review })
    });

    if (response.ok) {
      popup.classList.add('active');
      form.reset();
    } else {
      alert("⚠️ Failed to submit review. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("🚨 Server error. Please try again later.");
  }
});

closePopup.addEventListener('click', () => {
  popup.classList.remove('active');
});
