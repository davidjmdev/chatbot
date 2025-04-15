# Chatbot Rasa + Web UI

Este proyecto es un chatbot basado en Rasa con una interfaz web simple, pensado para ejecutarse fácilmente en local o en contenedor Docker.

## Estructura del proyecto

```
proyecto/
├── rasa/             # Proyecto Rasa (modelos, domain.yml, config.yml, actions.py, etc)
├── web/              # Frontend estático (index.html, JS, CSS, webserver.py)
├── start_services.sh # Script de arranque de todos los servicios
├── requirements.txt  # Dependencias Python
├── Dockerfile        # Para ejecución en contenedor
```

## Tecnologías utilizadas
- Rasa
- Flask
- Shell script
- Docker (opcional)

## Requisitos

- Solo compatible con **Python 3.9**.
- Se recomienda crear un entorno virtual antes de instalar dependencias:
  ```bash
  python3.9 -m venv venv
  source venv/bin/activate
  ```

## Ejecución

### Opción 1: Script directo
1. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
2. Ejecuta:
   ```bash
   ./start_services.sh
   ```
3. Accede a [http://localhost:8000](http://localhost:8000)

### Opción 2: Docker
1. Construye la imagen:
   ```bash
   docker build -t chatbot .
   ```
2. Ejecuta:
   ```bash
   docker run --rm -it -p 8000:8000 -p 5005:5005 -p 5055:5055 chatbot
   ```
3. Accede a [http://localhost:8000](http://localhost:8000)
