// admin_dashboard/js/login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errEl = document.getElementById("error");
  errEl.innerText = "";

  try {
    const res = await fetch("https://loadify-backend.onrender.com/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "./index.html";
    } else {
      errEl.innerText = data.message || "Invalid credentials";
    }
  } catch (err) {
    errEl.innerText = "Server error. Try later";
  }
});
