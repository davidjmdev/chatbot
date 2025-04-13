document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    let isWaitingForResponse = false;
    
    // Función para agregar mensajes al chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        // Si es un mensaje simple (string), manejarlo como texto
        if (typeof message === 'string') {
            messageContent.innerHTML = message.replace(/\n/g, '<br>');
        }
        // Si es un objeto con tipo y contenido
        else if (message.type && message.content) {
            switch (message.type) {
                case 'text':
                    messageContent.innerHTML = message.content.replace(/\n/g, '<br>');
                    break;
                case 'image':
                    const img = document.createElement('img');
                    img.src = message.content;
                    img.alt = 'Imagen del chatbot';
                    img.style.maxWidth = '100%';
                    img.onerror = function() {
                        this.onerror = null;
                        this.src = '';
                        messageContent.innerHTML = '<em>[Error al cargar la imagen]</em>';
                    };
                    messageContent.appendChild(img);
                    break;
                case 'buttons':
                    if (Array.isArray(message.content)) {
                        // Primero añadir el texto si hay alguno
                        if (message.text) {
                            const textP = document.createElement('p');
                            textP.innerHTML = message.text.replace(/\n/g, '<br>');
                            messageContent.appendChild(textP);
                        }
                        
                        // Crear contenedor de botones
                        const buttonsContainer = document.createElement('div');
                        buttonsContainer.classList.add('buttons-container');
                        
                        // Añadir cada botón
                        message.content.forEach(button => {
                            if (button.title && button.payload) {
                                const buttonElement = document.createElement('button');
                                buttonElement.classList.add('quick-reply-button');
                                buttonElement.textContent = button.title;
                                buttonElement.addEventListener('click', function() {
                                    // Al hacer clic, enviar el payload como mensaje
                                    addMessage(button.title, true);
                                    sendMessage(button.payload);
                                });
                                buttonsContainer.appendChild(buttonElement);
                            }
                        });
                        
                        messageContent.appendChild(buttonsContainer);
                    }
                    break;
                default:
                    // Para tipos desconocidos, mostrar el tipo y contenido para debug
                    messageContent.innerHTML = `<em>[Contenido de tipo ${message.type}]</em><br>${JSON.stringify(message.content)}`;
                    break;
            }
        }
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Desplazarse al último mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Función para mostrar indicador de "escribiendo..."
    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.classList.add('message', 'bot-message', 'typing-indicator');
        
        const indicatorContent = document.createElement('div');
        indicatorContent.classList.add('message-content');
        indicatorContent.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        
        indicatorDiv.appendChild(indicatorContent);
        chatMessages.appendChild(indicatorDiv);
        
        // Desplazarse al último mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return indicatorDiv;
    }
    
    // Función para eliminar el indicador de "escribiendo..."
    function removeTypingIndicator() {
        const indicators = document.querySelectorAll('.typing-indicator');
        indicators.forEach(indicator => {
            indicator.remove();
        });
    }
    
    // Función para enviar mensaje al backend
    async function sendMessage(message) {
        if (isWaitingForResponse) return;
        
        isWaitingForResponse = true;
        
        // Deshabilitar input mientras se espera respuesta
        userInput.disabled = true;
        sendButton.disabled = true;
        
        // Mostrar indicador de "escribiendo..."
        const typingIndicator = showTypingIndicator();
        
        try {
            const response = await fetch('/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken()
                },
                body: JSON.stringify({ message: message })
            });
            
            // Eliminar indicador de "escribiendo..."
            removeTypingIndicator();
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Manejar lista de mensajes
                if (data.messages && Array.isArray(data.messages)) {
                    // Añadir cada mensaje como un mensaje separado en el chat
                    data.messages.forEach(message => {
                        if (message) {
                            addMessage(message, false);
                        }
                    });
                } else if (data.message) {
                    // Compatibilidad con el formato anterior
                    addMessage(data.message, false);
                }
            } else {
                console.error('Error:', data.message || 'Error desconocido');
                // No mostrar ningún mensaje de error al usuario
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            // No mostrar ningún mensaje de error al usuario
            removeTypingIndicator();
        } finally {
            // Rehabilitar input después de recibir respuesta
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
            isWaitingForResponse = false;
        }
    }
    
    // Función para obtener el token CSRF
    function getCsrfToken() {
        // Intentar obtener el token de la etiqueta meta de CSRF que Django inserta
        const csrfElement = document.querySelector('[name=csrfmiddlewaretoken]');
        if (csrfElement) {
            return csrfElement.value;
        }
        
        // Método alternativo: obtener de las cookies
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('csrftoken=')) {
                return cookie.substring('csrftoken='.length, cookie.length);
            }
        }
        return '';
    }
    
    // Evento click para enviar mensaje
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            sendMessage(message);
        }
    });
    
    // Evento keypress para enviar mensaje con Enter
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                sendMessage(message);
            }
        }
    });
    
    // Foco inicial en el input
    userInput.focus();
}); 