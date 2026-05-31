from django.urls import path
from . import views


urlpatterns = [
    path('api/track/', views.api_track_pesanan, name='api_track_pesanan'),
    path('api/pesanan/baru/', views.api_buat_pesanan, name='api_buat_pesanan'),
    path('api/pesanan/<int:primary_key>/', views.api_detail_pesanan, name='api_detail_pesanan'),
    path('api/pesanan/<int:primary_key>/update/', views.update_status_pesanan, name='update_status_pesanan'),
]
