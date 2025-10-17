// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import submitContactForm from "./routes/submitContactForm.js";
import submitServiceForm from "./routes/submitServiceForm.js";
import adminRoutes from "./routes/adminRoutes.js";
import pageviewRoutes from "./routes/pageviewRoutes.js"; // ✅ Added this line

dotenv.config();
const app = express();

// ====== Resolve current directory (for correct static paths) ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Middlewares ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Serve static frontend & admin dashboard ======
app.use(express.static(path.join(__dirname, "../public")));
app.use("/admin_dashboard", express.static(path.join(__dirname, "../admin_dashboard")));

// ====== MongoDB Connection ====== 
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/transportDB" ,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ====== Routes ======
app.use("/api/contact", submitContactForm);
app.use("/api/service", submitServiceForm);
app.use("/api/admin", adminRoutes);
app.use("/api/pageview", pageviewRoutes); // ✅ Added this line to mount route

// ====== Default Route ======
app.get("/", (req, res) => {
  res.send("🚚 Logistics Backend Server Running Smoothly!");
});

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
