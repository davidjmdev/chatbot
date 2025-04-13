from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import logging

# Configurar logging
logger = logging.getLogger(__name__)

def index(request):
    """
    Vista para la página principal del chatbot
    """
    return render(request, 'chat/index.html')

@csrf_exempt
def send_message(request):
    """
    Vista para recibir mensajes del usuario y enviar respuestas
    Se conecta con el servidor Rasa para obtener las respuestas
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            
            # Conexión con el servidor Rasa
            rasa_url = "http://localhost:5005/webhooks/rest/webhook"
            rasa_payload = {
                "sender": "user",
                "message": user_message
            }
            
            # Añadir timeout para evitar bloqueos prolongados
            try:
                rasa_response = requests.post(rasa_url, json=rasa_payload, timeout=5)
                rasa_data = rasa_response.json()
            except requests.exceptions.Timeout:
                logger.warning("Timeout al conectar con Rasa")
                return JsonResponse({
                    'status': 'success',
                    'messages': []
                })
            except requests.exceptions.ConnectionError:
                logger.warning("No se pudo conectar con el servidor Rasa")
                return JsonResponse({
                    'status': 'success', 
                    'messages': []
                })
            
            # Procesar diferentes tipos de respuestas de Rasa
            bot_messages = []
            if rasa_data:
                for message in rasa_data:
                    # Procesar mensajes de texto
                    if 'text' in message:
                        bot_messages.append({
                            'type': 'text',
                            'content': message['text']
                        })
                    # Procesar imágenes
                    if 'image' in message:
                        bot_messages.append({
                            'type': 'image',
                            'content': message['image']
                        })
                    # Procesar botones/acciones rápidas si están presentes
                    if 'buttons' in message:
                        bot_messages.append({
                            'type': 'buttons',
                            'content': message['buttons']
                        })
                    # Procesar cualquier otro tipo de contenido que Rasa pueda enviar
                    # Esto permite capturar todos los tipos de mensajes para debug
                    for key in message:
                        if key not in ['text', 'image', 'buttons'] and key not in ['recipient_id']:
                            bot_messages.append({
                                'type': key,
                                'content': message[key]
                            })
            
            return JsonResponse({
                'status': 'success',
                'messages': bot_messages
            })
        except Exception as e:
            # Registrar el error para debug
            logger.error(f"Error al procesar mensaje: {str(e)}")
            # En caso de error, devolver una lista vacía
            return JsonResponse({
                'status': 'success',
                'messages': []
            })
    
    return JsonResponse({
        'status': 'error',
        'message': 'Método no permitido'
    }, status=405)
