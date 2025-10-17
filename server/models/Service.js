import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
},
{
  timestamps: true  // ✅ automatically adds createdAt and updatedAt
}

);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
