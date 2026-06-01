from rest_framework import serializers
from .models import Pelanggan, Layanan, Pesanan

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