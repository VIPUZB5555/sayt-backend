const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Fayllar saqlanadigan joy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Static uploads papkasini ko‘rsatish
app.use("/uploads", express.static("uploads"));

// Login (oddiy)
app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === "1234") {
    return res.json({ success: true, token: "FAKE_TOKEN" });
  }
  res.json({ success: false, message: "Noto‘g‘ri parol" });
});

// Rasm yuklash
app.post("/upload", upload.single("image"), (req, res) => {
  const date = req.body.date;
  res.json({
    success: true,
    filename: req.file.filename,
    date: date
  });
});

// Galereya (oddiy misol uchun faqat bitta rasm qaytaradi)
app.get("/gallery", (req, res) => {
  res.json([
    { filename: "demo.jpg", date: "2025-09-20" }
  ]);
});

// 🔴 Render majburiy port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishlayapti`);
});
