# Inventory App

Aplikasi Inventory berbasis web yang dikembangkan menggunakan teknologi **MySQL**, **Express**, dan **Vue**. Aplikasi ini memungkinkan pengguna untuk mengelola produk, transaksi, dan kategori secara efektif.

## Fitur Utama

- **Manajemen Produk**: Tambah, ubah, dan hapus data produk.
- **Manajemen Transaksi**: Lihat dan kelola transaksi masuk dan keluar.
- **Dashboard**: Tampilkan statistik jumlah produk, kategori, dan transaksi.
- **Otentikasi Pengguna**: Sistem login dengan token yang disimpan dalam cookie.
- **Responsif**: Sidebar yang dapat disembunyikan pada tampilan mobile.

## Teknologi yang Digunakan

- **Frontend**: Vue.js
- **Backend**: Express.js (Node.js)
- **Database**: MySQL
- **Authentication**: JSON Web Token (JWT)

## Prasyarat

Pastikan kamu sudah menginstal software berikut di lokalmu:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MySQL**: [Download MySQL](https://www.mysql.com/downloads/)
- **Vue CLI**: [Install Vue CLI](https://cli.vuejs.org/guide/installation.html)

## Cara Instalasi dan Menjalankan Aplikasi

1. **Clone repositori ini**:
   ```bash
   git clone https://github.com/your-username/inventory-app.git
   cd inventory-app
2. **Konfigurasi Database dan Env**
3. **Masuk Ke directory backend**
   cd backend
   npm run migrate
   npm run seed
