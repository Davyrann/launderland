import os
import requests
from dotenv import load_dotenv

load_dotenv()

def kirim_wa_pelanggan(no_hp: str, pesan: str) -> bool:
    """
    Menembak API Fonnte untuk mengirim notifikasi WhatsApp.
    """
    url = "https://api.fonnte.com/send"
    
    # Mengambil token dari .env
    token = os.getenv('FONNTE_TOKEN')
    
    if not token:
        print("Error: FONNTE_TOKEN tidak ditemukan di file .env!")
        return False
        
    headers = {
        'Authorization': token
    }
    
    # Payload data
    data = {
        'target': no_hp,
        'message': pesan,
        'countryCode': '62', # Fonnte akan otomatis menyesuaikan format 08 / 628
    }
    
    try:
        # Menembak POST Request ke Fonnte
        response = requests.post(url, headers=headers, data=data)
        hasil = response.json()
        
        # Mengecek respons dari Fonnte
        if hasil.get('status'):
            print(f"Whatsapp notification sent to {no_hp}")
            return True
        else:
            print(f"Whatsapp notification failed: {hasil.get('reason')}")
            return False
            
    except Exception as e:
        print(f"Something went wrong when sending Whatsapp notification: {e}")
        return False