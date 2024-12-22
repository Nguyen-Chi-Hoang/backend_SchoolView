// backend/server.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const buildingInfoRoutes = require("./routes/buildingInfo");

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api", buildingInfoRoutes);

// Cấu hình multer để lưu ảnh vào thư mục public/image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../school-map/public/image")); // Lưu vào thư mục public/image
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo timestamp
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.status(200).json({ imagePath: `/image/${req.file.filename}` });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
