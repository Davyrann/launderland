from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

@api_view(['GET'])
def cek_status_laundry(request: Request):
    query = request.query_params.get('q', None)
    
    if not query:
        return Response(
            {"error": "Nomor struk atau nomor telepon tidak boleh kosong"},
            status=status.HTTP_400_BAD_REQUEST
            )
    
    # Simulasi data dari database
    data_laundry  = {
        "LL-00001": {"telepon": "081234567890", "nama": "John Doe", "status": "Selesai", "total": 50000},
        "LL-00002": {"telepon": "081234567891", "nama": "Jane Smith", "status": "Dalam Proses", "total": 75000},
    }
    
    # Cek apakah query cocok dengan nomor struk atau nomor telepon
    hasil = data_laundry.get(query)
    
    if hasil:
        return Response(hasil, status=status.HTTP_200_OK)
    else:
        return Response(
            {"error": "Data tidak ditemukan untuk nomor struk atau nomor telepon yang diberikan"},
            status=status.HTTP_404_NOT_FOUND
            )