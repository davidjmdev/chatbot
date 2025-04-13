#!/bin/bash

# Función simple para limpiar al salir
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
cd rasa && rasa run --enable-api -p 5005 &
RASA_PID=$!

# Iniciar las acciones de Rasa
cd rasa && rasa run actions -p 5055 &
ACTIONS_PID=$!

# Iniciar el servidor de Django
cd django && python manage.py runserver &
DJANGO_PID=$!

echo "Todos los servicios iniciados. Presiona Ctrl+C para detener."

# Esperar indefinidamente (hasta Ctrl+C)
wait 