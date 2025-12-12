# 🚀 JMK Sales Dashboard - Capstone Project

![Accenture Capstone Badge](https://img.shields.io/badge/Accenture-Capstone%20Project-purple?style=for-the-badge&logo=accenture)
![Cohort](https://img.shields.io/badge/Cohort-AC--03-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

> **Predictive Lead Scoring Portal for Banking Sales** > *Sistem Manajemen Hubungan Pelanggan (CRM) & Dashboard Analitik Sales Berbasis Web dengan Integrasi AI.*

Project ini dikembangkan sebagai **Final Capstone Project** untuk program **Accenture (Cohort RB dan ML)**. Aplikasi ini dirancang untuk membantu tim sales perbankan memprioritaskan prospek (leads) dengan lebih efektif menggunakan *Machine Learning*. Sistem memprediksi probabilitas ketertarikan nasabah terhadap produk deposito berjangka dan menyajikannya dalam dashboard interaktif.

---

## 📸 Screenshots

| Light Mode | Dark Mode |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/facdcf42-7407-4655-8fa3-71628bf65076" width="100%" alt="Dashboard Light" /> | <img src="https://github.com/user-attachments/assets/89086cb1-dc69-4ecc-a23b-8bfc2af30609" width="100%" alt="Dashboard Dark" /> |
| *Dashboard Interaktif* | *High Contrast Dark Mode* |

---

## 🚀 Fitur Utama

### 🎯 Lead Scoring (AI Model Integration)
- **Prediksi Cerdas:** Sistem ML memprediksi probabilitas nasabah berlangganan produk.
- **Data Integration:** Hasil prediksi disimpan dan diolah di PostgreSQL.
- **Prioritas Kontak:** Mengidentifikasi *hot leads* (probabilitas tinggi) untuk prioritas follow-up.

### 📊 Interactive Dashboard
- **KPI Real-time:** Total Prospek, Hot Leads (≥70%), dan Potensi Konversi.
- **Smart Filtering:** Filter berdasarkan Status, Pekerjaan, Slider Probabilitas, dan Pencarian.
- **Visualisasi Data:**
  - Bar Chart: Status Konversi
  - Pie Chart: Rasio "Belum Dihubungi vs Sudah Dihubungi"
  - Bar Chart: Top 5 Pekerjaan Prospek
- **Detail Table:** Tabel prospek lengkap dengan status, skor, nomor telepon, dan catatan.

### 👥 Multi-role & Activity
- **Role Management:** Mendukung struktur user (Admin & Sales).
- **Leaderboard:** Menampilkan ranking performa sales.
- **Activity Logs:** Memantau riwayat aktivitas dan progress follow-up tim.

---

## 🛠️ Tech Stack

### Front-End
- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **Visualization:** Recharts

### Back-End
- **Runtime:** Node.js
- **Framework:** Hapi.js
- **Database:** PostgreSQL + pg
- **Architecture:** RESTful API

### Machine Learning
- **Model:** Keras/TensorFlow (.h5)
- **Workflow:** Prediksi Offline → Export CSV → Import Database

---

## 📂 Struktur Proyek

```bash
/ac-03
│
├── backend/
│   ├── api/leads/          # API Handlers & Routes
│   ├── services/           # Business Logic (LeadsService)
│   ├── server.js           # Entry Point Backend
│   └── .env                # Environment Variables
│
├── front-end/
│   ├── src/
│   │   ├── components/     # Dashboard, Charts, Tables
│   │   ├── services/       # API Calls (axios/fetch)
│   │   └── App.jsx
│   └── index.html
│
└── database/
    ├── schema.sql          # Database Structure
    └── hasil_prediksi.csv  # Data Dummy/Hasil ML
