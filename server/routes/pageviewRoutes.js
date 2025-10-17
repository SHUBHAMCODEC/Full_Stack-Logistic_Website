// // server/routes/pageviewRoutes.js
// import express from "express";
// import Pageview from "../models/Pageview.js";
// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     // client can send { path: "/services.html" } optionally
//     const { path } = req.body || {};
//     const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//     const pv = new Pageview({ path: path || req.path, ip });
//     await pv.save();
//     res.json({ success: true });
//   } catch (err) {
//     console.error("pageview error", err);
//     res.status(500).json({ success: false });
//   }
// });

// export default router;



// server/routes/pageviewRoutes.js
import express from "express";
import Pageview from "../models/Pageview.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Client may send { path: "/services.html" } optionally
    const { path } = req.body || {};
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const pv = new Pageview({
      path: path || req.originalUrl, // ✅ Better than req.path for full route
      ip,
      timestamp: new Date(), // ✅ Add timestamp for better logging
    });

    await pv.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Pageview error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
