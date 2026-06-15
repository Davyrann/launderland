# LaunderLand Backend

Backend resmi untuk Sistem Informasi Laundry LaunderLand. Proyek ini dibangun dengan Node.js, Express, SQLite, dan dokumentasi API Swagger.

## Tech Stack

- **Runtime:** Node.js
- **Package Manager:** pnpm
- **Framework:** Express.js
- **Database:** SQLite (`LL.db`)
- **Dokumentasi API:** Swagger UI (`swagger-jsdoc` + `swagger-ui-express`)
- **Integrasi tambahan:** WhatsApp gateway dan Xendit

## Fitur Utama

- CRUD layanan laundry
- Pembuatan pesanan baru dengan nomor resi otomatis
- Daftar dan detail pesanan
- Rekap laporan pendapatan
- Status dan pengiriman pesan WhatsApp
- Dokumentasi API interaktif

## Endpoint API

### Umum

- `GET /api` - Cek server aktif
- `GET /api-docs` - Swagger UI

### Pesanan

- `POST /api/pesanan` - Membuat pesanan baru
- `GET /api/pesanan` - Daftar pesanan
- `GET /api/pesanan/:id` - Detail pesanan
- `PUT /api/pesanan/:id/status` - Ubah status proses pesanan
- `PUT /api/pesanan/:id/pembayaran` - Ubah status pembayaran

### Layanan

- `GET /api/layanan` - Daftar layanan
- `POST /api/layanan` - Tambah layanan
- `PUT /api/layanan/:id` - Ubah layanan
- `DELETE /api/layanan/:id` - Hapus layanan

### Laporan

- `GET /api/laporan/pendapatan?start=YYYY-MM-DD&end=YYYY-MM-DD` - Rekap pendapatan

### WhatsApp

- `GET /api/whatsapp/status` - Cek status gateway WhatsApp
- `POST /api/whatsapp/kirim` - Kirim pesan WhatsApp manual

## Menjalankan Project

### 1. Clone repository

```bash
git clone https://github.com/maroisa/launderland
cd launderland/backend
```

### 2. Install dependencies dengan pnpm

```bash
pnpm install
```

### 3. Jalankan server development

```bash
pnpm dev
```

Secara default server akan berjalan di `http://localhost:3000`.

## Catatan Database

- File database SQLite dibuat otomatis sebagai `LL.db` saat server pertama kali dijalankan.
- Jika tabel masih kosong, sistem akan menambahkan beberapa layanan default.

## Konfigurasi

Variabel environment yang dikenali saat ini hanya:

- `PORT` - mengubah port server, default `3000`

Jika tidak diisi, server tetap bisa berjalan dengan pengaturan bawaan.

## Dokumentasi API

Setelah server aktif, buka:

```text
http://localhost:3000/api-docs
```

Di sana kamu bisa mencoba endpoint API secara langsung.