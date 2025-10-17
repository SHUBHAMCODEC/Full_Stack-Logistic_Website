// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
