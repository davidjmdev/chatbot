# Dockerfile para proyecto Django + Rasa en Render
FROM python:3.9-slim

# Evitar prompts de tzdata
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema necesarias para Rasa y Django
RUN apt-get update && \
    apt-get install -y build-essential git curl && \
    apt-get install -y libpq-dev gcc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar requirements y archivos de dependencias
COPY requirements.txt ./

# Instalar dependencias de Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código del proyecto
COPY . .

# Dar permisos de ejecución al script de inicio
RUN chmod +x start_services.sh

# Exponer los puertos necesarios (Render solo expone uno, pero útil para pruebas locales)
EXPOSE 8000 5005 5055

# Comando de inicio: script que lanza Django, Rasa y actions
CMD ["./start_services.sh"]
