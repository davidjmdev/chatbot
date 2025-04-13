#!/bin/bash

# Variables de entorno para Render
PORT=${PORT:-8000}
RASA_PORT=${RASA_PORT:-5005}
ACTIONS_PORT=${ACTIONS_PORT:-5055}

# Función para limpiar al salir
cleanup() {
    echo "Deteniendo servicios..."
    kill $RASA_PID
    kill $ACTIONS_PID
    kill $DJANGO_PID
    exit
}

# Capturar señales para limpiar al salir
trap cleanup SIGINT SIGTERM

# Iniciar el servidor de Rasa
cd rasa && rasa run --enable-api -p $RASA_PORT --cors "*" &
RASA_PID=$!

# Iniciar las acciones de Rasa
cd rasa && rasa run actions -p $ACTIONS_PORT &
ACTIONS_PID=$!

# Iniciar el servidor de Django (escuchando en todas las interfaces)
cd django && python manage.py runserver 0.0.0.0:$PORT &
DJANGO_PID=$!

echo "Todos los servicios iniciados. Presiona Ctrl+C para detener."

# Esperar indefinidamente (hasta Ctrl+C)
wait 