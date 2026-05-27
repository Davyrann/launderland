from django.urls import path
from .views import cek_status_laundry

urlpatterns = [
    path('api/track/', cek_status_laundry, name='cek_status_laundry'),
]
