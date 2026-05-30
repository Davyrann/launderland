from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from django.db.models import Q
from .models import Pesanan, Pelanggan, Layanan
from .serializers import PesananSerializer, CreatePesananSerializer
from typing import Any, Dict
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes



@extend_schema(
    summary="Cek status pesanan",
    description="Endpoint untuk melacak status pesanan berdasarkan nomor resi atau nomor HP pelanggan.",
    parameters=[
        OpenApiParameter(
            name='q', 
            description='Masukkan Nomor Resi atau Nomor HP', 
            required=True, 
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY
        ),
    ],
    responses={
        200: PesananSerializer,
        }
)
@api_view(['GET'])
def api_track_pesanan(request: Request) -> Response:
    """Endpoint untuk halaman Beranda (Tracking Pelanggan)"""
    query: str | None = request.query_params.get('q', None)
    
    if not query:
        return Response({"error": "Kata kunci (Resi/No HP) wajib diisi."}, status=status.HTTP_400_BAD_REQUEST)
    
    pesanan_db = Pesanan.objects.filter(
        Q(pelanggan__no_hp=query) | Q(no_resi=query)
    ).order_by('-tanggal_masuk').first()
    
    if not pesanan_db:
        return Response({"error": "Data cucian tidak ditemukan."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PesananSerializer(pesanan_db)
    return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    summary="Buat pesanan baru",
    description="Endpoint untuk membuat pesanan baru. Jika pelanggan dengan nomor HP yang sama sudah ada, maka pesanan akan dikaitkan dengan pelanggan tersebut. Jika tidak, maka pelanggan baru akan dibuat.",
    request=CreatePesananSerializer,
    responses={
        201: OpenApiTypes.OBJECT,
        400: OpenApiTypes.OBJECT,
    }
)
@api_view(['POST'])
def api_buat_pesanan(request: Request) -> Response:
    """Endpoint untuk halaman Kasir (Input Transaksi Baru)"""
    serializer = CreatePesananSerializer(data=request.data)
    
    if serializer.is_valid():
        data: Dict[str, Any] = serializer.validated_data # type: ignore
        
        # Cari atau buat pelanggan berdasarkan nomor HP
        pelanggan, created = Pelanggan.objects.get_or_create(
            no_hp=data['no_hp'],
            defaults={'nama': data['nama_pelanggan']}
        )
        
        # Validasi layanan yang dipilih
        try:
            layanan = Layanan.objects.get(id=data['layanan_id'])
        except Layanan.DoesNotExist:
            return Response({"error": "Layanan tidak valid."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Membuat pesanan baru dengan
        pesanan_baru = Pesanan(
            pelanggan=pelanggan,
            layanan=layanan,
            berat=data['berat'],
            metode_pembayaran=data['metode_pembayaran']
        )
        pesanan_baru.save() # no_resi & total_harga otomatis terbuat
        
        return Response({
            "message": "Pesanan berhasil dibuat!",
            "no_resi": pesanan_baru.no_resi,
            "total_harga": pesanan_baru.total_harga
        }, status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)