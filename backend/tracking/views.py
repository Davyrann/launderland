from django.db import transaction
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from django.db.models import Q, Sum, Count
from typing import Any, Dict
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Pesanan, Pelanggan, Layanan, RiwayatPekerjaan
from .serializers import LayananSerializer, PesananSerializer, CreatePesananSerializer, RiwayatPekerjaanSerializer, UpdatePesananSerializer
from .utils import kirim_wa_pelanggan

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
    query = request.query_params.get('q', None)
    
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
@permission_classes([IsAuthenticated])
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
        try:
            with transaction.atomic():
                # Membuat pesanan baru dengan
                pesanan_baru = Pesanan(
                    pelanggan=pelanggan,
                    layanan=layanan,
                    berat=data['berat'],
                    metode_pembayaran=data['metode_pembayaran']
                )
                pesanan_baru.save() # no_resi & total_harga otomatis terbuat
                
                RiwayatPekerjaan.objects.create(
                    pesanan=pesanan_baru,
                    pegawai=request.user,
                    aksi=f"Membuat pesanan baru ke dalam sistem dengan status '{pesanan_baru.status_proses}' dengan metode pembayaran '{pesanan_baru.metode_pembayaran}'."
                )
                
                return Response({
                    "message": "Pesanan berhasil dibuat!",
                    "id": pesanan_baru.id, # type: ignore
                    "no_resi": pesanan_baru.no_resi,
                    "total_harga": pesanan_baru.total_harga
                }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": f"Terjadi kesalahan saat membuat pesanan: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    summary="Detail pesanan",
    description="Endpoint untuk mendapatkan detail lengkap pesanan berdasarkan nomor resi.",
    
    responses={
        200: PesananSerializer,
        404: OpenApiTypes.OBJECT,
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_detail_pesanan(request: Request, primary_key: str):
    try:
        
        pesanan = Pesanan.objects.get(pk=primary_key)
    
    except Pesanan.DoesNotExist:
        return Response(
            {"error": "Pesanan tidak ditemukan."},
            status=status.HTTP_404_NOT_FOUND
            )
        
    # Convert pesanan instance to JSON using PesananSerializer
    serializer = PesananSerializer(pesanan)
    return Response(
        serializer.data,
        status=status.HTTP_200_OK
        )

@extend_schema(
    summary="Update status pesanan",
    description="Endpoint untuk memperbarui status proses dan pembayaran pesanan berdasarkan nomor resi.",
    request=UpdatePesananSerializer,
    responses={
        200: UpdatePesananSerializer,
        400: OpenApiTypes.OBJECT,
        404: OpenApiTypes.OBJECT,
    }
)
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_status_pesanan(request: Request, primary_key: str) -> Response:
    """Endpoint untuk update status proses dan pembayaran pesanan"""
    try:
        pesanan = Pesanan.objects.get(pk=primary_key)
    except Pesanan.DoesNotExist:
        return Response(
            {"error": "Pesanan tidak ditemukan."},
            status=status.HTTP_404_NOT_FOUND
        )
    serializer = UpdatePesananSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        status_baru = serializer.validated_data['status_proses'] # type: ignore
        
        pesanan.status_proses = status_baru
        pesanan.save(update_fields=['status_proses'])
        
        RiwayatPekerjaan.objects.create(
            pesanan=pesanan,
            pegawai=request.user,
            aksi=f"Mengubah status menjadi {pesanan.get_status_proses_display()}"  # type: ignore
        )
        
        if status_baru == 'selesai':
            def format_rupiah(angka) -> str:
                return f"{angka:,.0f}".replace(",", ".")

            # Ambil waktu saat ini untuk tanggal selesai
            waktu_selesai = timezone.now().strftime('%d-%m-%m %H:%M')
            
            # Hitung harga satuan layanan
            harga_satuan = pesanan.layanan.harga_per_kg
            
            teks_wa = (
                f"_*E-NOTA*_\n"
                f"Launder Land\n"
                f"Pelanggan: {pesanan.pelanggan.nama}\n\n"
                f"Order ID: {pesanan.no_resi}\n"
                f"Tgl Selesai: {waktu_selesai}\n"
                f"===============================\n"
                f"Detail pesanan:\n"
                f"- {float(pesanan.berat)} Kg  {pesanan.layanan.nama_layanan} @ {format_rupiah(harga_satuan)}\n"
                f"- Total: {format_rupiah(pesanan.total_harga)}\n"
                f"===============================\n"
                f"*TOTAL HARGA: {format_rupiah(pesanan.total_harga)}*\n"
                f"1. Komplain kerusakan/kehilangan maksimal 12 jam sejak pengambilan.\n"
                f"2. Harus disertai dengan bukti nota digital yang valid.\n\n"
                f"Terima kasih telah mencuci di LaunderLand! ✨"
            )
            # Menembak pesan tanpa membuat proses backend berhenti/error jika WA gagal
            kirim_wa_pelanggan(pesanan.pelanggan.no_hp, teks_wa)
        return Response(
            {"message": "Status pesanan berhasil diperbarui.",
            "status_sekarang": pesanan.status_proses,
            "status_display": pesanan.get_status_proses_display()}, # type: ignore
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    summary="Daftar pesanan",
    description="Endpoint untuk mendapatkan daftar semua pesanan. Dapat difilter berdasarkan status proses dengan query parameter 'status'.",
    parameters=[
        OpenApiParameter(
            name='status', 
            description='Filter pesanan berdasarkan status proses (misal: "masuk", "proses", "selesai", "diambil")', 
            required=False, 
            type=OpenApiTypes.STR,
            enum=['antri', 'proses', 'selesai', 'diambil']
        ),
    ],
    responses={
        200: PesananSerializer(many=True),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_list_pesanan(request: Request) -> Response:
    """Endpoint untuk halaman Daftar Pesanan (Admin)"""
    status_filter = request.query_params.get('status', None)
    if status_filter:
        pesanan_db = Pesanan.objects.filter(status_proses=status_filter).order_by('-tanggal_masuk')
    else:
        pesanan_db = Pesanan.objects.all().order_by('-tanggal_masuk')
    
    serializer = PesananSerializer(pesanan_db, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@extend_schema(
    summary="Daftar layanan",
    description="Endpoint untuk mendapatkan daftar layanan yang tersedia beserta harga per kg.",
    responses={
        200: LayananSerializer(many=True),
    }
)
@api_view(['GET'])
def api_daftar_layanan(request: Request) -> Response:
    """Endpoint untuk mendapatkan daftar layanan yang tersedia"""
    layanan_db = Layanan.objects.all()
    serializer = LayananSerializer(layanan_db, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@extend_schema(
    summary="Laporan Dasbor Owner",
    description="Endpoint untuk mendapatkan data laporan dasbor owner, termasuk metrik keuangan, metrik operasional, dan sebaran status pesanan bulan ini.",
    responses={
        200: OpenApiTypes.OBJECT,
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_laporan_dasbor(request: Request) -> Response:
    """Endpoint untuk mendapatkan data laporan dasbor owner"""
    # Mengambil data pesanan bulan ini
    sekarang = timezone.now()
    awal_bulan = sekarang.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    pesanan_bulan_ini = Pesanan.objects.filter(tanggal_masuk__gte=awal_bulan)
    pendapatan = pesanan_bulan_ini.filter(
        status_proses__in=['selesai', 'diambil']
    ).aggregate(total=Sum('total_harga'))['total'] or 0
    
    total_berat = pesanan_bulan_ini.aggregate(total=Sum('berat'))['total'] or 0.0
    
    sebaran_status = pesanan_bulan_ini.values('status_proses').annotate(jumlah=Count('id'))
    
    rincian_status = {item['status_proses']: item['jumlah'] for item in sebaran_status}
    
    data_laporan = {
        "periode": sekarang.strftime('%B %Y'),
        "metrik_keuangan": {
            "total_pendapatan": pendapatan,
        },
        "metrik_operasional": {
            "total_cucian_kg": float(total_berat),
            "total_pesanan_bulan_ini": pesanan_bulan_ini.count(),
        },
        "antrean_saat_ini": rincian_status
    }
    
    return Response(data_laporan, status=status.HTTP_200_OK)

@extend_schema(
    summary="Riwayat Aktivitas Pegawai (Audit Trail)",
    description="Mengambil daftar log aktivitas pegawai (siapa melakukan apa dan kapan). "
                "Hanya menampilkan 50 aktivitas terbaru agar response tetap cepat.",
    responses={200: RiwayatPekerjaanSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_riwayat_pekerjaan(request: Request) -> Response:
    # Kita ambil datanya, urutkan dari yang paling baru (-waktu_eksekusi)
    # Gunakan [:50] untuk membatasi hanya 50 log terbaru agar server tidak berat
    riwayat = RiwayatPekerjaan.objects.all().order_by('-waktu_eksekusi')[:50]
    
    serializer = RiwayatPekerjaanSerializer(riwayat, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)