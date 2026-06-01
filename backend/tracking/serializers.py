from rest_framework import serializers
from .models import Pelanggan, Layanan, Pesanan, RiwayatPekerjaan

# Serializer berfungsi untuk mengubah data model menjadi format yang bisa dikirim melalui API (biasanya JSON) dan sebaliknya.
class PelangganSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pelanggan
        fields = ['nama', 'no_hp']

class LayananSerializer(serializers.ModelSerializer):
    class Meta:
        model = Layanan
        fields = ['nama_layanan', 'harga_per_kg', 'deskripsi']

class PesananSerializer(serializers.ModelSerializer):
    pelanggan = PelangganSerializer(read_only=True)
    layanan = LayananSerializer(read_only=True)
    status_proses_display = serializers.CharField(
        source='get_status_proses_display', 
        read_only=True
    )
    status_pembayaran_display = serializers.CharField(
        source='get_status_pembayaran_display', 
        read_only=True
    )
    
    class Meta:
        model = Pesanan
        fields = [
            'no_resi', 
            'pelanggan', 
            'layanan', 
            'berat', 
            'total_harga', 
            'status_proses', 
            'status_proses_display',
            'status_pembayaran', 
            'status_pembayaran_display', 
            'tanggal_masuk'
        ]

class CreatePesananSerializer(serializers.Serializer):
    """Serializer khusus untuk menangani input dari form"""
    nama_pelanggan = serializers.CharField(max_length=100)
    no_hp = serializers.CharField(max_length=15)
    layanan_id = serializers.IntegerField()
    berat = serializers.FloatField()
    metode_pembayaran = serializers.CharField(max_length=10)
    
class UpdatePesananSerializer(serializers.ModelSerializer):
    """Serializer untuk update status proses dan pembayaran"""
    class Meta:
        model = Pesanan
        fields = ['status_proses']
        
class RiwayatPekerjaanSerializer(serializers.ModelSerializer):
    nama_pegawai = serializers.CharField(source='pegawai.username', default='Sistem/Anonim', read_only=True)
    no_resi = serializers.CharField(source='pesanan.no_resi', read_only=True)
    role_pegawai = serializers.SerializerMethodField()
    
    class Meta:
        model = RiwayatPekerjaan
        fields = ['id', 'waktu_eksekusi', 'nama_pegawai','role_pegawai', 'aksi', 'no_resi']
    
    def get_role_pegawai(self, obj) -> str:
        # Jika tidak ada pegawai (misal dihapus atau sistem otomatis)
        if not obj.pegawai:
            return "Sistem"
            
        # Cek apakah dia Superuser (Owner/Admin utama)
        if obj.pegawai.is_superuser:
            return "Owner"
            
        # Cek apakah dia masuk ke dalam grup tertentu di Django Admin (misal grup 'Kasir')
        if obj.pegawai.groups.exists():
            return obj.pegawai.groups.first().name
            
        # Jika bukan superuser dan tidak masuk grup apa-apa, default-nya adalah Kasir biasa
        return "Kasir"