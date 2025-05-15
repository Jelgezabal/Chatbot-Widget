class N8NChatWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        // [Mantén el código inicial igual]

        // [Después de añadir los elementos al DOM y antes de initLogic, añade estos estilos adicionales]
        const additionalStyles = document.createElement("style");
        additionalStyles.textContent = `
            .typing-indicator {
                display: flex;
                align-items: center;
                margin: 8px 0;
                padding: 12px 16px;
                background: var(--chat--color-background);
                border: 1px solid rgba(133, 79, 255, 0.2);
                border-radius: 12px;
                max-width: 60%;
                align-self: flex-start;
            }
            
            .typing-dot {
                width: 8px;
                height: 8px;
                background: var(--chat--color-primary);
                border-radius: 50%;
                margin: 0 2px;
                animation: typing-animation 1.5s infinite;
                opacity: 0.6;
            }
            
            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typing-animation {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
            }
        `;
        this.shadowRoot.appendChild(additionalStyles);

        this.initLogic(chatContainer, widget, config);
    }

    initLogic(container, widget, config) {
        const toggleButton = widget.querySelector(".chat-toggle");
        const newChatBtn = container.querySelector(".new-chat-btn");
        const chatInterface = container.querySelector(".chat-interface");
        const messagesContainer = container.querySelector(".chat-messages");
        const textarea = container.querySelector("textarea");
        const sendButton = container.querySelector('button[type="submit"]');
        const closeButtons = container.querySelectorAll(".close-button");
        
        messagesContainer.addEventListener('wheel', (e) => {
            e.stopPropagation();
            messagesContainer.scrollTop += e.deltaY;
        }, { passive: true });
        
        let sessionId = "";
        let started = false;
        let responseQueue = []; // Cola para mensajes secuenciales
        let isProcessingQueue = false; // Bandera para controlar el procesamiento de la cola

        const generateUUID = () => crypto.randomUUID();

        // Función para mostrar el indicador de escritura
        function showTypingIndicator() {
            const typingIndicator = document.createElement("div");
            typingIndicator.className = "typing-indicator";
            typingIndicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            typingIndicator.id = "typing-indicator";
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return typingIndicator;
        }

        // Función para ocultar el indicador de escritura
        function hideTypingIndicator() {
            const indicator = messagesContainer.querySelector("#typing-indicator");
            if (indicator) {
                indicator.remove();
            }
        }

        // Función para procesar la cola de mensajes
        async function processMessageQueue() {
            if (isProcessingQueue || responseQueue.length === 0) return;
            
            isProcessingQueue = true;
            
            // Mostrar indicador de escritura
            const typingIndicator = showTypingIndicator();
            
            // Esperar un tiempo para simular escritura
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Ocultar indicador y mostrar mensaje
            hideTypingIndicator();
            const message = responseQueue.shift();
            
            const botMsg = document.createElement("div");
            botMsg.className = "chat-message bot";
            botMsg.textContent = message;
            messagesContainer.appendChild(botMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Marcar como no procesando y continuar con el siguiente mensaje después de un retraso
            isProcessingQueue = false;
            
            // Si hay más mensajes en la cola, continuar procesando después de un retraso
            if (responseQueue.length > 0) {
                setTimeout(processMessageQueue, 1000);
            }
        }

        // Función para extraer bloques de un mensaje
        function extractBlocks(message) {
            const regex = /\[BLOQUE\](.*?)\[\/BLOQUE\]/gs;
            const blocks = [];
            let match;
            
            while ((match = regex.exec(message)) !== null) {
                blocks.push(match[1].trim());
            }
            
            // Si no se encuentran bloques, devolver el mensaje completo como un bloque
            return blocks.length > 0 ? blocks : [message];
        }

        async function startConversation() {
            sessionId = generateUUID();
            const payload = [{
                action: "loadPreviousSession",
                sessionId,
                route: config.webhook.route,
                metadata: { userId: "" }
            }];

            try {
                const res = await fetch(config.webhook.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                container.querySelectorAll(".brand-header")[0].style.display = "none";
                container.querySelector(".new-conversation").style.display = "none";
                chatInterface.classList.add("active");

                // Extraer bloques del mensaje de respuesta
                const output = Array.isArray(data) ? data[0].output : data.output;
                const blocks = extractBlocks(output);
                
                // Añadir bloques a la cola y comenzar a procesarlos
                responseQueue = blocks;
                processMessageQueue();
            } catch (e) {
                console.error("Error:", e);
            }
        }

        async function sendMessage(msg) {
            const data = {
                action: "sendMessage",
                sessionId,
                route: config.webhook.route,
                chatInput: msg,
                metadata: { userId: "" }
            };

            const userMsg = document.createElement("div");
            userMsg.className = "chat-message user";
            userMsg.textContent = msg;
            messagesContainer.appendChild(userMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                const res = await fetch(config.webhook.url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                const output = Array.isArray(result) ? result[0].output : result.output;
                
                // Extraer bloques y añadirlos a la cola
                const blocks = extractBlocks(output);
                responseQueue = responseQueue.concat(blocks);
                
                // Comenzar a procesar la cola si no está ya en proceso
                if (!isProcessingQueue) {
                    processMessageQueue();
                }
            } catch (e) {
                console.error("Error:", e);
            }
        }

        // [Mantén el resto del código igual]
        
        newChatBtn.addEventListener("click", async () => {
            if (started || newChatBtn.disabled) return;
            started = true;
            newChatBtn.disabled = true;
            await startConversation();
            setTimeout(() => (newChatBtn.disabled = false), 3000);
        });

        sendButton.addEventListener("click", () => {
            const msg = textarea.value.trim();
            if (msg) {
                sendMessage(msg);
                textarea.value = "";
            }
        });

        textarea.addEventListener("keypress", e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const msg = textarea.value.trim();
                if (msg) {
                    sendMessage(msg);
                    textarea.value = "";
                }
            }
        });

        toggleButton.addEventListener("click", () => {
            container.classList.toggle("open");
        });

        closeButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                container.classList.remove("open");
            });
        });
    }

    // [Mantén getStyles() igual]
}

customElements.define('chat-widget', N8NChatWidget);
