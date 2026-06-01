from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Layanan, Pelanggan, Pesanan, RiwayatPekerjaan

# User custom karena di tambahkan field role, jadi kita buat admin khusus untuk User
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    
    # Tambahkan field role ke dalam fieldsets dan add_fieldsets agar bisa di edit saat tambah/edit user di admin
    
    fieldsets = UserAdmin.fieldsets + (
        ('Hak Akses Sistem Laundry', {'fields': ('role',)}),
    ) # type: ignore
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Hak Akses Sistem Laundry', {'fields': ('role',)}),
    )

# Daftarkan model User dengan CustomUserAdmin yang baru
admin.site.register(User, CustomUserAdmin)

# Tabel di admin untuk model lainnya
@admin.register(Layanan)
class LayananAdmin(admin.ModelAdmin):
    list_display = ('nama_layanan', 'harga_per_kg')

@admin.register(Pelanggan)
class PelangganAdmin(admin.ModelAdmin):
    list_display = ('nama', 'no_hp', 'tanggal_terdaftar')
    search_fields = ('nama', 'no_hp')

@admin.register(Pesanan)
class PesananAdmin(admin.ModelAdmin):
    readonly_fields = ('no_resi', 'total_harga')
    list_display = ('no_resi', 'pelanggan', 'layanan', 'berat', 'total_harga')
    list_filter = ('status_proses', 'status_pembayaran')
    search_fields = ('no_resi', 'pelanggan__nama', 'pelanggan__no_hp')

@admin.register(RiwayatPekerjaan)
class RiwayatPekerjaanAdmin(admin.ModelAdmin):
    list_display = ('waktu_eksekusi', 'pegawai', 'aksi', 'pesanan')
    list_filter = ('waktu_eksekusi',)