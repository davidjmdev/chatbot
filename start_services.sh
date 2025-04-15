#!/bin/bash

# Ocultar warnings de Python
export PYTHONWARNINGS="ignore"
export SQLALCHEMY_SILENCE_UBER_WARNING=1

# Variables de entorno para Render
PORT=${PORT:-8000}
RASA_PORT=${RASA_PORT:-5005}
ACTIONS_PORT=${ACTIONS_PORT:-5055}

# Función para limpiar al salir
cleanup() {
    echo "Deteniendo servicios..."
    kill $RASA_PID
    kill $ACTIONS_PID
    kill $FLASK_PID
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

# Esperar a que Rasa esté listo en el puerto 5005
echo "Esperando a que Rasa esté listo en el puerto $RASA_PORT..."
while true; do
  if curl -s "http://localhost:$RASA_PORT/status" >/dev/null; then
    echo "Rasa está listo."
    break
  else
    sleep 2
  fi
done

# Lanzar el servidor Flask (web/webserver.py) en foreground
python3 -W ignore web/webserver.py &
FLASK_PID=$!

echo "Todos los servicios iniciados. Presiona Ctrl+C para detener."

# Esperar indefinidamente (hasta Ctrl+C)
wait 