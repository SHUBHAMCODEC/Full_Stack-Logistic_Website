import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// POST: /api/service
router.post("/", async (req, res) => {
  try {
    const { name, company, rating, review } = req.body;
    const newService = new Service({ name, company, rating, review });
    await newService.save();
    res.status(201).json({ success: true, message: "Service review submitted successfully!" });
  } catch (error) {
    console.error("Error saving service form:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
