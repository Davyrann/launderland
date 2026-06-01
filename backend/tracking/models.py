import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from typing import Any

# Model untuk User
class User(AbstractUser):
    """
    Modifikasi User bawaan dari django
    """
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('pegawai', 'Pegawai'),
    )
    
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='pegawai'
    )
    # get_role_display() sudah disediakan oleh Django untuk menampilkan label dari pilihan role
    def __str__(self) -> str:
        return f"{self.username} ({self.get_role_display()})" # type: ignore
    
# Model untuk layanan
class Layanan(models.Model):
    """
    Menyimpan daftar paket laundry yang tersedia beserta harga perkilogram
    """
    
    nama_layanan = models.CharField(max_length=100)
    harga_per_kg = models.IntegerField()
    deskripsi = models.TextField(blank=True, null=True)
    
    def __str__(self) -> str:
        return f"{self.nama_layanan} - Rp {self.harga_per_kg}/kg"

# Model untuk pelanggan
class Pelanggan(models.Model):
    """
    Menyimpan data pelanggan tetap maupun umum.
    Nomor HP diberikan db_index=True agar pencarian tracking super cepat.
    """
    
    nama = models.CharField(max_length=100)
    no_hp = models.CharField(max_length=15, unique=True, db_index=True)
    tanggal_terdaftar = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.nama} ({self.no_hp})"
    
# Model pesanan
class Pesanan(models.Model):
    """
    Model utama transaksi laundry yang menampung seluruh status proses dan keuangan.
    """
    
    STATUS_PROSES_CHOICES = [
        ('masuk', 'Masuk'),
        ('dicuci', 'Dicuci'),
        ('disetrika', 'Disetrika'),
        ('selesai', 'Selesai (Siap Diambil)'),
        ('diambil', 'Sudah Diambil'),
    ]

    STATUS_BAYAR_CHOICES = [
        ('lunas', 'Lunas'),
        ('belum_lunas', 'Belum Lunas'),
    ]

    METODE_BAYAR_CHOICES = [
        ('tunai', 'Tunai'),
        ('transfer', 'Transfer Bank'),
        ('qris', 'QRIS'),
    ]

    # Identitas Pesanan
    no_resi= models.CharField(max_length=20, unique=True, db_index=True, blank=True) # no_resi dibuat otomatis di method save()
    pelanggan = models.ForeignKey(Pelanggan, on_delete=models.CASCADE, related_name='pesanan') # Jika pelanggan dihapus, maka pesanan terkait juga dihapus (CASCADE)
    layanan = models.ForeignKey(Layanan, on_delete=models.RESTRICT, related_name='pesanan') # Jika layanan dihapus, maka pesanan terkait tidak bisa dihapus (RESTRICT) untuk menjaga integritas data transaksi
    
    # Detail Fisik & Keuangan
    berat = models.FloatField(help_text="Berat pakaian dalam satuan Kilogram (Kg)")
    total_harga = models.IntegerField()
    
    # Status Pelacakan (FR-03 & FR-05)
    status_proses = models.CharField(max_length=15, choices=STATUS_PROSES_CHOICES, default='masuk')
    status_pembayaran = models.CharField(max_length=15, choices=STATUS_BAYAR_CHOICES, default='belum_lunas')
    metode_pembayaran = models.CharField(max_length=10, choices=METODE_BAYAR_CHOICES, default='tunai')
    
    # Kontrol Pengiriman Notifikasi WhatsApp (FR-04)
    # Digunakan agar sistem tidak mengirim WA berkali-kali jika ada eror koneksi
    wa_notif_masuk_sent = models.BooleanField(default=False)
    wa_notif_selesai_sent = models.BooleanField(default=False)
    
    # Catatan Waktu (FR-06)
    tanggal_masuk = models.DateTimeField(auto_now_add=True)
    tanggal_diambil = models.DateTimeField(null=True, blank=True)
    
    # Akuntabilitas Pegawai (FR-07)
    pegawai_penerima = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='pesanan_masuk')

    def save(self, *args: Any, **kwargs: Any) -> None:
        # Menghitung otomatis total_harga berdasarkan berat dan tarif layanan sebelum data disimpan
        if self.berat and self.layanan:
            self.total_harga = int(self.berat * self.layanan.harga_per_kg)
            
        # Otomatis menghasilkan nomor resi acak yang unik jika belum ada
        if not self.no_resi:
            self.no_resi = f"RESI-{uuid.uuid4().hex[-6:].upper()}"
            
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.no_resi} - {self.pelanggan.nama} ({self.status_proses})"

# Log Aktivitas Pegawai
class RiwayatPekerjaan(models.Model):
    """
    Mencatat jejak digital setiap kali ada pegawai yang merubah status pesanan laundry.
    """
    pesanan = models.ForeignKey(Pesanan, on_delete=models.CASCADE, related_name='riwayat')
    pegawai = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='aktivitas')
    aksi = models.CharField(max_length=255, help_text="Contoh: Mengubah status menjadi Dicuci")
    waktu_eksekusi = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        nama_pegawai = self.pegawai.username if self.pegawai else "Sistem/Anonim"
        return f"[{self.waktu_eksekusi.strftime('%Y-%m-%d %H:%M')}] {nama_pegawai}: {self.aksi} pada {self.pesanan.no_resi}"