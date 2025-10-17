// admin_dashboard/js/dashboard.js
const token = localStorage.getItem("adminToken");
if (!token) window.location.href = "./login.html";

const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };

const visitorsEl = document.getElementById("visitorsCount");
const contactsEl = document.getElementById("contactsCount");
const servicesEl = document.getElementById("servicesCount");

const contactsContainer = document.getElementById("contactsContainer");
const servicesContainer = document.getElementById("servicesContainer");

const ctx = document.getElementById('pageviewChart').getContext('2d');
let pageChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // month names will go here
    datasets: [{
      label: 'Monthly Pageviews',
      data: [],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0,123,255,0.15)',
      pointBackgroundColor: '#007bff',
      tension: 0.35,
      fill: true,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Website Traffic Overview (Monthly)',
        font: { size: 18, weight: 'bold' },
        color: '#333'
      },
      legend: {
        display: true,
        labels: { color: '#333', font: { size: 14 } }
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#007bff',
        borderWidth: 1,
        titleColor: '#000',
        bodyColor: '#000',
        callbacks: {
          label: (context) => ` ${context.parsed.y} views`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Month', font: { size: 14 } },
        grid: { color: '#eee' },
        ticks: { color: '#555' }
      },
      y: {
        title: { display: true, text: 'Views', font: { size: 14 } },
        beginAtZero: true,
        grid: { color: '#eee' },
        ticks: { color: '#555' }
      }
    }
  }
});

async function fetchStats() {
  try {
    const res = await fetch("https://loadify-backend.onrender.com/api/admin/stats", { headers });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "./login.html";
      }
      throw new Error("Unauthorized");
    }

    const data = await res.json();

    // Update top counters
    visitorsEl.innerText = data.visitorsCount;
    contactsEl.innerText = data.contactsCount;
    servicesEl.innerText = data.servicesCount;

    // 🗓️ Monthly chart labels and values
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const labels = data.series.map(s => monthNames[s.month - 1]);
    const values = data.series.map(s => s.count);

    // Update chart data
    pageChart.data.labels = labels;
    pageChart.data.datasets[0].data = values;
    pageChart.update();

  } catch (err) {
    console.error("stats error", err);
  }
}


async function fetchTables() {
  // contacts
  try {
    const [cRes, sRes] = await Promise.all([
      fetch("https://loadify-backend.onrender.com/api/admin/contacts", { headers }),
      fetch("https://loadify-backend.onrender.com/api/admin/services", { headers })
    ]);
    if (!cRes.ok || !sRes.ok) {
      localStorage.removeItem("adminToken"); window.location.href = "./login.html";
      return;
    }
    const [contacts, services] = await Promise.all([cRes.json(), sRes.json()]);
    contactsContainer.innerHTML = renderContactsTable(contacts);
    servicesContainer.innerHTML = renderServicesTable(services);
    // attachDeleteHandlers();
  } catch (err) {
    console.error(err);
  }
}

function renderContactsTable(items) {
  if (!items.length) return "<div class='muted'>No contact submissions yet</div>";
  let html = `<table class="table"><thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Time</th><th></th></tr></thead><tbody>`;
  items.forEach(i => {
    html += `<tr><td>${escapeHTML(i.name)}</td><td>${escapeHTML(i.email)}</td><td>${escapeHTML(i.message)}</td><td>${new Date(i.createdAt).toLocaleString()}</td><td><button data-id="${i._id}" data-type="contact" class="btn small outline delete-btn">Delete</button></td></tr>`;
  });
  html += `</tbody></table>`;
  return html;
}

function renderServicesTable(items) {
  if (!items.length) return "<div class='muted'>No service submissions yet</div>";
  let html = `<table class="table"><thead><tr><th>Name</th><th>Company</th><th>Rating</th><th>Review</th><th>Time</th><th></th></tr></thead><tbody>`;
  items.forEach(i => {
    html += `<tr><td>${escapeHTML(i.name)}</td><td>${escapeHTML(i.company||'—')}</td><td>${escapeHTML(i.rating)}</td><td>${escapeHTML(i.review || i.feedback)}</td><td>${new Date(i.createdAt || i.date).toLocaleString()}</td><td><button data-id="${i._id}" data-type="service" class="btn small outline delete-btn">Delete</button></td></tr>`;
  });
  html += `</tbody></table>`;
  return html;
}


function attachDeleteHandlers() {
  document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const btn = e.target;
    const id = btn.dataset.id;
    const type = btn.dataset.type;

    if (!id || !type) return alert("Invalid entry");
    if (!confirm("Delete this entry?")) return;

    try {
      btn.disabled = true;
      btn.textContent = "Deleting...";

      const url = type === "contact"
        ? `/api/admin/contacts/${id}`
        : `/api/admin/services/${id}`;

      const res = await fetch(`https://loadify-backend.onrender.com${url}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        // ✅ Instantly remove the row without full refresh
        const row = btn.closest("tr");
        if (row) row.remove();

        // Optional: update the counters slightly without full fetch
        if (type === "contact") {
          contactsEl.innerText = Number(contactsEl.innerText) - 1;
        } else {
          servicesEl.innerText = Number(servicesEl.innerText) - 1;
        }

        alert("✅ Entry deleted successfully");
      } else {
        alert("❌ Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Delete failed");
    } finally {
      btn.disabled = false;
      btn.textContent = "Delete";
    }
  });
}



// function escapeHTML(s){ if(!s) return ""; return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function escapeHTML(s) {
  if (s === null || s === undefined) return "";
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

document.getElementById("logoutBtn").addEventListener("click", ()=>{localStorage.removeItem("adminToken");window.location.href="./login.html";});
document.getElementById("refreshBtn").addEventListener("click", ()=>{fetchStats(); fetchTables();});
document.getElementById("rangeSelect").addEventListener("change", fetchStats);

// initial load
fetchStats();
fetchTables();
attachDeleteHandlers();

// auto refresh every 6 seconds
setInterval(()=>{ fetchStats(); fetchTables(); }, 6000);
