// server/routes/adminRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Contact from "../models/Contact.js";
import Service from "../models/Service.js";
import Pageview from "../models/Pageview.js";
import auth from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

/* ------------------------------- LOGIN ------------------------------- */
// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    return res.json({ token, message: "✅ Login successful" });
  }

  res.status(401).json({ message: "❌ Invalid credentials" });
});


/* ------------------------------- STATS ------------------------------- */
// GET /api/admin/stats
router.get("/stats", auth, async (req, res) => {
  try {
    const [contactsCount, servicesCount, visitorsCount] = await Promise.all([
      Contact.countDocuments(),
      Service.countDocuments(),
      Pageview.countDocuments()
    ]);

    // 🎯 MONTHLY STATS GENERATOR (aggregates all data by month for the year)
    const getMonthlyStats = async (year) => {
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);

      const results = await Pageview.aggregate([
        { $match: { createdAt: { $gte: start, $lt: end } } },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.month": 1 } }
      ]);

      // Ensure all 12 months are present (fill zeros)
      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const found = results.find(r => r._id.month === i + 1);
        return { month: i + 1, count: found ? found.count : 0 };
      });

      return monthlyData;
    };

    // 🗓️ Get current year’s monthly data
    const now = new Date();
    const currentYear = now.getFullYear();
    const series = await getMonthlyStats(currentYear);

    // Final response
    res.json({
      visitorsCount,
      contactsCount,
      servicesCount,
      series
    });

  } catch (err) {
    console.error("Stats Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});


/* ------------------------------- LISTINGS ------------------------------- */
router.get("/contacts", auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(500);
    res.json(contacts);
  } catch (err) {
    console.error("Contacts Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

router.get("/services", auth, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).limit(500);
    res.json(services);
  } catch (err) {
    console.error("Services Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

/* ------------------------------- DELETE ------------------------------- */
router.delete("/contacts/:id", auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Contact deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete contact" });
  }
});

router.delete("/services/:id", auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete service" });
  }
});

/* ----------------------- LIVE DATA STREAM (for auto refresh) ----------------------- */
// Optional real-time update endpoint (SSE)
router.get("/live-updates", auth, async (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  const sendData = async () => {
    const [contactsCount, servicesCount, visitorsCount] = await Promise.all([
      Contact.countDocuments(),
      Service.countDocuments(),
      Pageview.countDocuments()
    ]);
    res.write(`data: ${JSON.stringify({ contactsCount, servicesCount, visitorsCount })}\n\n`);
  };

  // Send initial
  await sendData();
  const interval = setInterval(sendData, 5000); // refresh every 5 sec

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

export default router;
