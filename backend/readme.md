# Launderland Backend
Repositori backend dari "Launderland" untuk "Sistem Informasi Laundry" Dibangun menggunakan arsitektur REST API.
## Tech yang digunakan
* **Framework Utama:** Python 3 & Django
* **API Framework:** Django REST Framework (DRF)
* **Dokumentasi API:** drf-spectacular (Swagger UI)
* **Database:** SQLite (lokal)
---
## Daftar Fitur & Endpoint API
### Dokumentasi & Skema
* `GET /api/docs/` : Halaman interaktif Swagger UI untuk melihat dan mengetes seluruh API.
* `GET /api/schema/` : File skema mentah (format YAML/JSON) untuk kebutuhan integrasi sistem.
### Area Publik (Pelanggan)
* `GET /api/track/?q={no_resi/no_hp}` : Melacak status pesanan pelanggan. Tidak memerlukan autentikasi.
### 3. Area Kasir (Dashboard)
* `POST /api/pesanan/baru/` : Menambahkan data cucian baru. Sistem akan otomatis membuatkan `no_resi` dan menghitung `total_harga` berdasarkan berat dan layanan.
*(Semua fitur masih dalam tahap pengembangan ekspektasi nya tolong di kurangi)*
---
# Bagaimana cara menjalankan
> Karena database `db.sqlite3` dan folder virtual environment (`env`) tidak diikutkan ke dalam repositori demi keamanan

ikuti langkah berikut untuk menyalakan server dari nol:
### Langkah 1: Clone repo
```bash
git clone https://github.com/maroisa/launderland
cd launderland/backend
```
### Langkah 2: Buat & Aktifkan Virtual Environment
```bash
# Buat virtual environment bernama .venv
python -m venv .venv
# Linux
source env/bin/activate
# Windows
.\env\Scripts\activate
```

### Langkah 3: Install requirements
```bash
pip install -r requirements.txt
```
### Langkah 4: Buat database
```bash
python manage.py migrate
```
> *(Opsional: Jika ingin membuat akun admin baru untuk mengakses Django Admin)*
```bash
python manage.py createsuperuser
```
### Langkah 5: Runserver
```bash
python manage.py runserver
```
Aplikasi backend sekarang berjalan di http://127.0.0.1:8000/.
Silakan buka http://127.0.0.1:8000/api/docs/ di browser untuk mulai mengetes API!