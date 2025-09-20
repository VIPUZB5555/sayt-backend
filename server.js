// script.js

// API URL (backend serveringiz manzili, masalan Node.js yoki PHP)
// localhost:3000 yoki hostingdagi domeningizni yozasiz
const API_URL = "https://sayt-backend.onrender.com";

// Elementlarni tanlab olish
const loginForm = document.getElementById("login-form");
const imageUploadForm = document.getElementById("image-upload-form");
const imageInput = document.getElementById("image-input");
const dateInput = document.getElementById("date-input");
const gallery = document.getElementById("gallery");
const adminPanel = document.getElementById("admin-panel");

// Token (admin sessiyasini saqlash uchun)
let authToken = localStorage.getItem("authToken") || null;

// --- Admin login ---
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        authToken = data.token;
        localStorage.setItem("authToken", authToken);
        alert("Admin sifatida kirdingiz!");
        loginForm.style.display = "none";
        adminPanel.style.display = "block";
      } else {
        alert("Parol noto‘g‘ri!");
      }
    } catch (err) {
      console.error(err);
      alert("Serverga ulanishda xatolik!");
    }
  });
}

// --- Rasm va sana yuklash ---
if (imageUploadForm) {
  imageUploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("date", dateInput.value);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Rasm muvaffaqiyatli yuklandi!");
        loadGallery(); // galereyani qayta yuklash
      } else {
        alert("Xatolik: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server bilan muammo!");
    }
  });
}

// --- Galereyani yuklash ---
async function loadGallery() {
  try {
    const res = await fetch(`${API_URL}/gallery`);
    const images = await res.json();

    gallery.innerHTML = "";
    images.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("gallery-item");

      div.innerHTML = `
        <img src="${API_URL}/uploads/${item.filename}" alt="Rasm" />
        <p>${item.date}</p>
      `;

      gallery.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// Sayt ochilganda galereyani yuklash
loadGallery();

