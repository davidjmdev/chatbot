# Interfaz de Chatbot Django con Rasa

Este proyecto integra un chatbot Rasa con una interfaz web desarrollada en Django, permitiendo utilizar todas las capacidades de Rasa NLU y Core a través de una interfaz web amigable.

## Características

- Interfaz de chat moderna y responsiva
- Comunicación asíncrona con Rasa a través de API REST
- Soporte para mensajes de texto, imágenes y botones interactivos
- Manejo adecuado de errores y reconexión
- Indicador de escritura mientras se espera respuesta
- Diseño adaptado para dispositivos móviles

## Estructura del Proyecto

```
proyecto/
├── django/                      # Aplicación Django
│   ├── chat/                    # App de chat
│   │   ├── static/              # Archivos estáticos (JS, CSS)
│   │   │   └── chat/
│   │   │       ├── css/
│   │   │       │   └── style.css
│   │   │       └── js/
│   │   │           └── chat.js
│   │   ├── templates/           # Plantillas HTML
│   │   │   └── chat/
│   │   │       └── index.html
│   │   ├── views.py             # Vistas y lógica de backend
│   │   └── urls.py              # URLs de la aplicación
│   ├── chatbot_frontend/        # Configuración principal de Django
│   └── manage.py                # Script de gestión de Django
├── rasa/                        # Proyecto Rasa
│   ├── actions/                 # Acciones personalizadas
│   ├── data/                    # Datos de entrenamiento
│   ├── models/                  # Modelos entrenados
│   ├── config.yml               # Configuración de Rasa
│   ├── credentials.yml          # Configuración de canales de comunicación
│   ├── domain.yml               # Dominio del bot
│   └── endpoints.yml            # Configuración de endpoints
├── start_services.sh            # Script para iniciar todos los servicios
└── requirements.txt             # Dependencias del proyecto
```

## Requisitos

- Python 3.7+
- Django 3.2+
- Rasa 3.0+
- Requests

## Instalación

1. Clonar el repositorio:
   ```
   git clone <url-repositorio>
   cd <nombre-repositorio>
   ```

2. Crear y activar un entorno virtual:
   ```
   python -m venv .venv
   source .venv/bin/activate  # En Windows: .venv\Scripts\activate
   ```

3. Instalar las dependencias:
   ```
   pip install -r requirements.txt
   ```

4. Entrenar el modelo de Rasa (si es necesario):
   ```
   cd rasa
   rasa train
   cd ..
   ```

## Uso

1. Iniciar todos los servicios con un solo comando:
   ```
   ./start_services.sh
   ```

   Este script inicia:
   - El servidor Rasa en el puerto 5005
   - El servidor de acciones personalizadas de Rasa en el puerto 5055
   - El servidor de desarrollo de Django en el puerto 8000

2. Abrir el navegador y acceder a la interfaz del chatbot:
   ```
   http://localhost:8000
   ```

3. Para detener todos los servicios, presionar `Ctrl+C` en la terminal donde se ejecuta el script.

## Conexión entre Django y Rasa

La conexión entre Django y Rasa se realiza a través de la API REST de Rasa:

- Django envía los mensajes del usuario a Rasa mediante solicitudes POST a `http://localhost:5005/webhooks/rest/webhook`
- Las respuestas de Rasa se procesan en Django y se envían al frontend
- El frontend muestra las respuestas adaptándose al tipo de contenido (texto, imágenes, botones)

## Tipos de Mensajes Soportados

- **Texto**: Mensajes simples de texto
- **Imágenes**: URLs a imágenes que se muestran en el chat
- **Botones**: Botones interactivos para respuestas rápidas

## Personalización

### Frontend

Para modificar la apariencia de la interfaz, editar:
- `django/chat/static/chat/css/style.css` para cambiar estilos
- `django/chat/templates/chat/index.html` para modificar la estructura HTML

### Backend

Para ampliar la funcionalidad:
- `django/chat/views.py` para lógica de backend
- `django/chat/static/chat/js/chat.js` para comportamiento del frontend

### Chatbot

Para modificar el comportamiento del chatbot:
- `rasa/data/` para datos de entrenamiento
- `rasa/domain.yml` para definir intents, entities, slots, etc.
- `rasa/actions/` para acciones personalizadas

## Solución de Problemas

- **Error "Forbidden (CSRF token missing)"**: Asegúrate de que el token CSRF esté presente en cada solicitud POST
- **No hay respuesta del chatbot**: Verifica que el servidor Rasa y el servidor de acciones estén ejecutándose
- **Error "Connection refused"**: Comprueba que los puertos 5005 y 5055 estén disponibles

## Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Sube la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request 