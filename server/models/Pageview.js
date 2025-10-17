// server/models/Pageview.js
import mongoose from "mongoose";

const pageviewSchema = new mongoose.Schema({
  path: { type: String, required: true }, // e.g. "/services.html"
  ip: { type: String },                    // optional
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pageview", pageviewSchema);
