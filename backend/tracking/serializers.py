from rest_framework import serializers
from .models import Pelanggan, Layanan, Pesanan
from typing import Any

# Serializer berfungsi untuk mengubah data model menjadi format yang bisa dikirim melalui API (biasanya JSON) dan sebaliknya.
class PesananSerializer(serializers.ModelSerializer):
    nama_pelanggan = serializers.CharField(source='pelanggan.nama', read_only=True)
    no_hp_pelanggan = serializers.CharField(source='pelanggan.no_hp', read_only=True)
    nama_layanan = serializers.CharField(source='layanan.nama_layanan', read_only=True)
    status_proses_display = serializers.CharField(source='get_status_proses_display', read_only=True)
    status_pembayaran_display = serializers.CharField(source='get_status_pembayaran_display', read_only=True)
    
    class Meta:
        model = Pesanan
        fields = [
            'no_resi', 'nama_pelanggan', 'no_hp_pelanggan', 'nama_layanan', 
            'berat', 'total_harga', 'status_proses', 'status_proses_display',
            'status_pembayaran', 'status_pembayaran_display', 'tanggal_masuk'
        ]

class CreatePesananSerializer(serializers.Serializer):
    """Serializer khusus untuk menangani input dari form"""
    nama_pelanggan = serializers.CharField(max_length=100)
    no_hp = serializers.CharField(max_length=15)
    layanan_id = serializers.IntegerField()
    berat = serializers.FloatField()
    metode_pembayaran = serializers.CharField(max_length=10)