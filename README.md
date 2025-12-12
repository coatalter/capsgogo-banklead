# 🚀 JMK Sales Dashboard - Capstone Project

![Accenture Capstone Badge](https://img.shields.io/badge/Accenture-Capstone%20Project-purple?style=for-the-badge&logo=accenture)
![Cohort](https://img.shields.io/badge/Cohort-AC--03-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> **Sistem Manajemen Hubungan Pelanggan (CRM) & Dashboard Analitik Sales Berbasis Web.**

Project ini dikembangkan sebagai **Final Capstone Project** untuk program **Accenture (Cohort RB dan ML)**. Aplikasi ini dirancang untuk membantu tim sales mengelola prospek (leads), memantau performa penjualan, dan menganalisis data pelanggan potensial menggunakan prediksi berbasis skor probabilitas.


# 🏦 Predictive Lead Scoring Portal for Banking Sales  
**AI-Powered Prospect Prioritization System**

Portal ini dirancang untuk membantu tim sales perbankan memprioritaskan prospek dengan lebih efektif menggunakan machine learning. Sistem ini melakukan prediksi probabilitas ketertarikan nasabah terhadap produk deposito berjangka, lalu menyajikannya dalam dashboard interaktif lengkap dengan filtering, visualisasi, activity logs, dan leaderboard performa sales.

---

## 🚀 Fitur Utama

## 📸 Screenshots

| Light Mode | Dark Mode |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/facdcf42-7407-4655-8fa3-71628bf65076" width="100%" alt="Dashboard Light" /> | <img src="https://github.com/user-attachments/assets/89086cb1-dc69-4ecc-a23b-8bfc2af30609" width="100%" alt="Dashboard Dark" /> |
| *Dashboard Interaktif* | *High Contrast Dark Mode* |

---

### 🎯 Lead Scoring (AI Model Integration)
- Sistem machine learning memprediksi probabilitas nasabah berlangganan produk.
- Data ML yang telah diproses disimpan ke PostgreSQL atau database sever.
- Probabilitas digunakan untuk menentukan *hot leads* dan prioritas kontak.

### 📊 Interactive Dashboard
- KPI: Total Prospek, Hot Leads (≥70%), Potensi Konversi.
- Filtering lengkap: Status, Job, Probability Slider, Search, Pagination.
- Chart:
  - Bar Chart status konversi
  - Pie Chart “Belum Dihubungi vs Sudah Dihubungi”
  - Bar Chart Top 5 Job Prospek  
- Tabel prospek dengan detail seperti status, skor, phone, catatan, dsb.

### 👥 Multi-role Capability
- Struktur tabel sudah mendukung user roles (admin, sales).
- Dapat ditingkatkan menjadi sistem autentikasi penuh.

### 📈 Leaderboard & Recent Activity
- Menampilkan aktivitas sales dan progress follow-up.
- Memudahkan monitoring performa tim.

### 🔌 REST API (Hapi.js)
- Endpoint:
  - `GET /leads` – Ambil seluruh prospek
  - `GET /leads-stats` – Statistik scoring
  - `PATCH /leads/{id}/status` – Update status prospek
  - `GET /leaderboard` – Data ranking sales
  - `GET /logs` – Log aktivitas

### 🗄 Normalized Database Structure
- Tabel `nasabah` (profil prospek)
- Tabel `hasil_perhitungan_probabilitas` (skor ML)
- Tabel `users` (sales dan admin)
- Query backend sudah join otomatis.

## 🛠️ Tech Stack

### Front-End
- React + Vite  
- TailwindCSS  
- Recharts (visualization)

### Back-End
- Node.js + Hapi.js  
- PostgreSQL + pg  
- RESTful API design

### Machine Learning
- Model Keras/TensorFlow (.h5)  
- Prediksi dihasilkan offline → diimport ke PostgreSQL

## 📂 Struktur Proyek
/ac-03
│
├── backend/
│ ├── api/
│ │ └── leads/
│ │ ├── handler.js
│ │ ├── index.js
│ │ └── routes.js
│ ├── services/
│ │ └── LeadsService.js
│ ├── server.js
│ ├── .env
│
├── front-end/
│ ├── src/
│ │ ├── components/
│ │ │ ├── SalesDashboard.jsx
│ │ │ ├── SalesCharts.jsx
│ │ │ ├── CustomerTable.jsx
│ │ │ ├── Leaderboard.jsx
│ │ │ └── RecentActivity.jsx
│ │ ├── services/
│ │ │ ├── leadsService.js
│ │ │ └── authService.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── index.html
│
├── database/
│ ├── schema.sql
│ ├── import_csv_to_db.js
│ └── hasil_prediksi_baru.csv
│
└── README.md


---

## ⚙️ Instalasi & Menjalankan Proyek
### 1️⃣ Clone Repository
git clone https://github.com/coatalter/capsgogo-banklead
cd project-name

# Back End Setup
### 2️⃣ Install Dependencies
cd backend
npm install

### 3️⃣ Tambahkan .env
PGUSER=postgres
PGPASSWORD=yourpassword
PGHOST=localhost
PGPORT=5432
PGDATABASE=banks_leads

PORT=5001
HOST=localhost

### 4️⃣ Jalankan Server Back-End
node server.js
(backend akan tersedia di ➡ http://localhost:5001/)

## 💻 Front-End Setup
### 5️⃣ Install Dependencies
cd ../front-end
npm install

## 6️⃣ Jalankan Server Front-End
npm run dev
Frontend tersedia di:
➡ http://localhost:5173/

# 🧠 Update Data Machine Learning
Train model → export .h5
Gunakan script Python untuk prediksi → hasil CSV
Import CSV ke PostgreSQL:
\copy leads FROM 'hasil_prediksi_baru.csv' DELIMITER ',' CSV HEADER;


## Jalankan migrasi:
INSERT INTO nasabah ...
INSERT INTO hasil_perhitungan_probabilitas ...

Dashboard akan otomatis update.
## 🧪 API Endpoints
    GET /leads
        Mengambil daftar prospek.

    GET /leads-stats
        Statistik terkait scoring.

    PATCH /leads/{id}/status
        Update status prospek.

    GET /leaderboard
        Leaderboard sales.

    GET /logs
        Aktivitas terbaru.

# 📌 Status Workflow Logic
Status	Arti
    new:	    Belum dihubungi
    contacted:	Sudah dihubungi
    follow up:	Perlu tindak lanjut
    success:	Berhasil closing
    failed: 	Menolak / gagal
    unknown:	Data tidak lengkap


# 👥 Tim Pengembang
3 Web Developers (React & Backend)
2 Machine Learning Engineers

ID Tim Capstone Project	: [A25-CS081]
ID Use Case			: [AC-03] 
List Anggota		: 
(R359D5Y0284) - (Arya Bima Mohammad Heriansyah	)- (React & Back-End with AI)
(R359D5Y1664) - (Raydamar Rizkyaka Riyadi)- (React & Back-End with AI)
(M359D5Y1680) - (Renaldy Surya Pratama)- (Machine Learning)
(M359D5Y1218) - (Muhammad Arifin Ilham)- (Machine Learning)
(R359D5Y0482) - (Dicky Nugraha Hasibuan)- (React & Back-End with AI)
