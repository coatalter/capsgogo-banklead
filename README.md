# 🚀 JMK Sales Dashboard - Capstone Project

![Accenture Capstone Badge](https://img.shields.io/badge/Accenture-Capstone%20Project-purple?style=for-the-badge&logo=accenture)
![Cohort](https://img.shields.io/badge/Cohort-AC--03-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

> **Predictive Lead Scoring Portal for Banking Sales**
>
> *Sistem Manajemen Hubungan Pelanggan (CRM) & Dashboard Analitik Sales Berbasis Web.*

Project ini dikembangkan sebagai **Final Capstone Project** untuk program **Accenture (Cohort RB dan ML)**. Aplikasi ini dirancang untuk membantu tim sales perbankan memprioritaskan prospek (*leads*) dengan lebih efektif menggunakan *Machine Learning*. Sistem memprediksi probabilitas ketertarikan nasabah terhadap produk deposito berjangka dan menyajikannya dalam dashboard interaktif.

---

## 📸 Screenshots

| Light Mode | Dark Mode |
|:---:|:---:|
| <<img width="1900" height="936" alt="image" src="https://github.com/user-attachments/assets/e215adc0-038c-4ff6-99e1-ec5336a7e510" width="100%" alt="Dashboard Light" /> | [<img width="1904" height="935" alt="image" src="https://github.com/user-attachments/assets/13a14faf-5793-4b50-9555-0837ccb937ba" width="100%" alt="Dashboard Dark" /> |
| *Dashboard Interaktif* | *High Contrast Dark Mode* |

---

## 🚀 Fitur Utama

### 🎯 Lead Scoring (AI Model Integration)
- **Prediksi Cerdas:** Sistem machine learning memprediksi probabilitas nasabah berlangganan produk.
- **Penyimpanan Data:** Data ML yang telah diproses disimpan ke PostgreSQL.
- **Prioritas:** Probabilitas digunakan untuk menentukan *hot leads* dan prioritas kontak.

### 📊 Interactive Dashboard
- **KPI:** Total Prospek, Hot Leads (≥70%), Potensi Konversi.
- **Filtering Lengkap:** Status, Job, Probability Slider, Search, Pagination.
- **Visualisasi Chart:**
  - Bar Chart status konversi
  - Pie Chart “Belum Dihubungi vs Sudah Dihubungi”
  - Bar Chart Top 5 Job Prospek
- **Detail:** Tabel prospek dengan detail seperti status, skor, phone, catatan, dsb.

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

---

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
- **Akses Model & Data:** [📁 Google Drive Link](https://drive.google.com/drive/folders/1PBF0sbGCGrm3Z3k9XRcKmgFT72bLH9Qy)
- **Workflow:** Prediksi dihasilkan offline → diimport ke PostgreSQL

---

## 📂 Struktur Proyek

```bash
/ac-03
│
├── backend/
│   ├── api/leads/          # Handler, Index, Routes
│   ├── services/           # Business Logic (LeadsService)
│   ├── server.js           # Entry Point
│   └── .env                # Config
│
├── front-end/
│   ├── src/
│   │   ├── components/     # Dashboard, Charts, Tables
│   │   ├── services/       # API Integration
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
├── database/
│   ├── schema.sql
│   └── hasil_prediksi_baru.csv
│
└── README.md
```

---

## ⚙️ Instalasi & Menjalankan Proyek

### 1️⃣ Clone Repository
```bash
git clone https://github.com/coatalter/capsgogo-banklead
cd capsgogo-banklead
```

### 2️⃣ Back-End Setup
Masuk ke folder backend, install dependencies, dan atur environment variables.

```bash
cd backend
npm install
```

Buat file `.env` dengan konfigurasi berikut:
```env
PGUSER=postgres
PGPASSWORD=yourpassword
PGHOST=localhost
PGPORT=5432
PGDATABASE=banks_leads

PORT=5001
HOST=localhost
```

Jalankan server:
```bash
node server.js
```
*(Backend berjalan di `http://localhost:5001/`)*

### 3️⃣ Front-End Setup
Buka terminal baru:

```bash
cd ../front-end
npm install
npm run dev
```
*(Frontend berjalan di `http://localhost:5173/`)*

---

## 🧠 Update Data Machine Learning

1.  Train model → export `.h5`.
2.  Gunakan script Python untuk prediksi → hasilkan output `.csv`.
3.  Import CSV ke PostgreSQL (menggunakan terminal `psql`):

```sql
\copy leads FROM 'hasil_prediksi_baru.csv' DELIMITER ',' CSV HEADER;
```

4.  Jalankan migrasi data (jika diperlukan):
```sql
INSERT INTO nasabah ...
INSERT INTO hasil_perhitungan_probabilitas ...
```

---

## 🧪 API Endpoints

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/leads` | Mengambil seluruh daftar prospek |
| `GET` | `/leads-stats` | Statistik terkait scoring |
| `PATCH` | `/leads/{id}/status` | Update status prospek |
| `GET` | `/leaderboard` | Data ranking sales |
| `GET` | `/logs` | Log aktivitas terbaru |

---

## 📌 Status Workflow Logic

| Status | Arti | Keterangan |
| :--- | :--- | :--- |
| `new` | **Baru** | Belum dihubungi |
| `contacted` | **Dihubungi** | Sudah dihubungi |
| `follow up` | **Tindak Lanjut** | Perlu tindak lanjut |
| `success` | **Berhasil** | Berhasil closing |
| `failed` | **Gagal** | Menolak / gagal |
| `unknown` | **Unknown** | Data tidak lengkap |

---

## 👥 Tim Pengembang

**ID Tim Capstone Project:** `A25-CS081`  
**ID Use Case:** `AC-03`

| Student ID | Nama Anggota | Role / Path |
| :--- | :--- | :--- |
| **R359D5Y0284** | Arya Bima Mohammad Heriansyah | React & Back-End with AI |
| **R359D5Y1664** | Raydamar Rizkyaka Riyadi | React & Back-End with AI |
| **R359D5Y0482** | Dicky Nugraha Hasibuan | React & Back-End with AI |
| **M359D5Y1680** | Renaldy Surya Pratama | Machine Learning |
| **M359D5Y1218** | Muhammad Arifin Ilham | Machine Learning |
