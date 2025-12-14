import subprocess
import socket
import sys
import time
import os


# ------------------------------------------------------
# 1. Obtener IP local automáticamente
# ------------------------------------------------------
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Nos conectamos a un host externo para obtener la interfaz activa
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip


IP = get_local_ip()

print("\n===============================================")
print("🔥 POKER CLOCK – LOCAL MULTI-DEVICE MODE")
print("===============================================\n")
print(f"📡 Tu IP local es: {IP}")
print("Cualquier persona conectada a tu misma WiFi")
print("podrá usar el Poker Clock entrando en esta URL:\n")
print(f"👉 JUGADORES / PANTALLA:  http://{IP}:5173")
print(f"👉 PANEL ADMIN:          http://{IP}:5173/admin\n")
print("Mantén este script abierto mientras dura el torneo.\n")

# ------------------------------------------------------
# 2. Exportar variable con la URL del backend
# ------------------------------------------------------
os.environ["VITE_API_URL"] = f"http://{IP}:3001"
print(f"🔗 FRONTEND usará el backend en: {os.environ['VITE_API_URL']}\n")

# ------------------------------------------------------
# 3. Arrancar servidor BACKEND (desde la raíz)
# ------------------------------------------------------
print("🚀 Iniciando servidor BACKEND en puerto 3001...\n")

backend_process = subprocess.Popen(
    ["npm", "run", "server"],
    shell=True  # se ejecuta en la carpeta actual (poker-clock)
)

time.sleep(2)

# ------------------------------------------------------
# 4. Arrancar FRONTEND accesible desde la red local
# ------------------------------------------------------
print("🌐 Iniciando FRONTEND accesible desde toda la red local...\n")

frontend_process = subprocess.Popen(
    ["npm", "run", "dev", "--", "--host", "0.0.0.0"],
    shell=True  # también en la carpeta actual
)

# ------------------------------------------------------
# 5. Mantener ambos procesos vivos
# ------------------------------------------------------
try:
    backend_process.wait()
    frontend_process.wait()
except KeyboardInterrupt:
    print("\n🛑 Cerrando Poker Clock...")
    backend_process.terminate()
    frontend_process.terminate()
    sys.exit()
