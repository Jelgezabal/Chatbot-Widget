class N8NChatWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isDarkMode = false;
  }

  connectedCallback() {
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    const defaultConfig = {
      webhook: { url: "", route: "" },
      branding: {
        logo: "",
        name: "",
        welcomeText: "",
        responseTimeText: "",
        poweredBy: { text: "", link: "" },
        greetingMessage: "<strong>📣 Conóceme 👋</strong><br/>Soy tu agente IA",
        startMessage: "Hola, ¿en qué puedo ayudarte hoy?"
      },
      style: {
        primaryColor: "#854fff",
        secondaryColor: "#6b3fd4",
        backgroundColor: "#ffffff",
        fontColor: "#333333",
        position: "right",
        primaryShadow: "rgba(133, 79, 255, 0.3)",
        primaryBorder: "rgba(133, 79, 255, 0.2)"
      }
    };

    const config = window.ChatWidgetConfig
      ? {
        webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
        branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
        style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
      }
      : defaultConfig;

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css";
    this.shadowRoot.appendChild(fontLink);

    const styleTag = document.createElement("style");
    styleTag.textContent = this.getStyles();
    this.shadowRoot.appendChild(styleTag);

    const additionalStyles = document.createElement("style");
    additionalStyles.textContent = `
          :host {
              --chat--color-primary: ${config.style.primaryColor};
              --chat--color-secondary: ${config.style.secondaryColor};
              --chat--color-background: ${config.style.backgroundColor};
              --chat--color-font: ${config.style.fontColor};
              --chat--color-primary-sombra: ${config.style.primaryShadow};
              --chat--color-primary-borde: ${config.style.primaryBorder};
              
              /* Variables para modo oscuro */
              --chat--dark-background: #1a1a1a;
              --chat--dark-font: #ffffff;
              --chat--dark-border: rgba(133, 79, 255, 0.4);
              --chat--dark-shadow: rgba(133, 79, 255, 0.5);
              
              font-family: 'Geist Sans', sans-serif;
            }

            /* Estilos para modo oscuro */
            .dark-mode {
                --chat--color-background: var(--chat--dark-background);
                --chat--color-font: var(--chat--dark-font);
                --chat--color-primary-borde: var(--chat--dark-border);
                --chat--color-primary-sombra: var(--chat--dark-shadow);
            }

            .dark-mode .cta-chat {
                background-color: #2a2a2a !important;
                color: white !important;
                border: 1px solid var(--chat--color-primary-borde);
            }

            .dark-mode .chat-message.bot {
                background: #2a2a2a;
                color: var(--chat--dark-font);
            }

            .dark-mode .chat-input textarea {
                background: #2a2a2a;
                color: var(--chat--dark-font);
                border: 1px solid var(--chat--dark-border);
            }

            .dark-mode .chat-input textarea::placeholder {
                color: var(--chat--dark-font);
                opacity: 0.6;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                margin: 8px 0;
                padding: 12px 16px;
                background: var(--chat--color-background);
                border: 1px solid var(--chat--color-primary-borde);
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
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing-animation {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
            }

            /* Loader styles */
            .loader-spinner {
                display: none;
                flex-direction: column;
                align-items: center;
                margin-top: 16px;
            }
            .spinner {
                width: 32px;
                height: 32px;
                border: 4px solid var(--chat--color-primary-borde);
                border-top: 4px solid var(--chat--color-primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 12px;
            }
            .loading-text {
                font-size: 14px;
                color: var(--chat--color-font);
                opacity: 0.7;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    this.shadowRoot.appendChild(additionalStyles);

    const widget = document.createElement("div");
    widget.className = "n8n-chat-widget";
    widget.style.setProperty("--n8n-chat-primary-color", config.style.primaryColor);
    widget.style.setProperty("--n8n-chat-secondary-color", config.style.secondaryColor);
    widget.style.setProperty("--n8n-chat-background-color", config.style.backgroundColor);
    widget.style.setProperty("--n8n-chat-font-color", config.style.fontColor);

    const toggleBtn = document.createElement("button");
    toggleBtn.className = `chat-toggle${config.style.position === "left" ? " position-left" : ""}`;
    toggleBtn.innerHTML = `
      <span class="animate-ping"></span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
      </svg>
      <div class="cta-chat">${config.branding.greetingMessage}</div>
    `;

    const chatContainer = document.createElement("div");
    chatContainer.className = `chat-container${config.style.position === "left" ? " position-left" : ""}`;
    chatContainer.innerHTML = `
        <div class="brand-header">
          <img src="${config.branding.logo}" alt="${config.branding.name}">
          <span>${config.branding.name}</span>
          <div class="header-controls">
            <button class="theme-toggle" title="Cambiar tema">
              <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
              </svg>
              <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button class="close-button">×</button>
          </div>
        </div>
        <div class="new-conversation">
          <h2 class="welcome-text">${config.branding.welcomeText}</h2>
          <button class="new-chat-btn">
            <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
            </svg>
            Chatea con nuestro agente
          </button>
          <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
        <div class="chat-interface">
          <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <div class="header-controls">
              <button class="theme-toggle" title="Cambiar tema">
                <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
                <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
                </svg>
              </button>
              <button class="close-button">×</button>
            </div>
          </div>
          <div class="chat-messages"></div>
          <div class="chat-input">
            <textarea placeholder="Escribe tu mensaje aquí:" rows="1"></textarea>
            <button type="submit">Enviar</button>
          </div>
          <div class="chat-footer">
            <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
          </div>
        </div>`;

    // 🚀 Añadir loader dinámico al DOM
    const loader = document.createElement("div");
    loader.className = "loader-spinner";
    loader.innerHTML = `<div class="spinner"></div><p class="loading-text">Conectando con un agente...</p>`;
    chatContainer.querySelector(".new-conversation").appendChild(loader);

    widget.appendChild(chatContainer);
    widget.appendChild(toggleBtn);
    this.shadowRoot.appendChild(widget);

    this.initLogic(chatContainer, widget, config, loader);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const widget = this.shadowRoot.querySelector('.n8n-chat-widget');
    const sunIcons = this.shadowRoot.querySelectorAll('.sun-icon');
    const moonIcons = this.shadowRoot.querySelectorAll('.moon-icon');
    
    if (this.isDarkMode) {
      widget.classList.add('dark-mode');
      sunIcons.forEach(icon => icon.style.display = 'none');
      moonIcons.forEach(icon => icon.style.display = 'block');
    } else {
      widget.classList.remove('dark-mode');
      sunIcons.forEach(icon => icon.style.display = 'block');
      moonIcons.forEach(icon => icon.style.display = 'none');
    }
  }

  initLogic(container, widget, config, loader) {
    const toggleButton = widget.querySelector(".chat-toggle");
    const newChatBtn = container.querySelector(".new-chat-btn");
    const chatInterface = container.querySelector(".chat-interface");
    const messagesContainer = container.querySelector(".chat-messages");
    const textarea = container.querySelector("textarea");
    const sendButton = container.querySelector('button[type="submit"]');
    const closeButtons = container.querySelectorAll(".close-button");
    const themeButtons = container.querySelectorAll(".theme-toggle");
    
    // Fix: enable mouse wheel scroll inside shadow DOM
    messagesContainer.addEventListener('wheel', (e) => {
      e.stopPropagation(); // important
      messagesContainer.scrollTop += e.deltaY;
    }, { passive: true });

    // Agregar evento para toggle de tema
    themeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        this.toggleDarkMode();
      });
    });

    let sessionId = "";
    let started = false;
    let responseQueue = [];
    let isProcessingQueue = false;

    const generateUUID = () => crypto.randomUUID();

    function showTypingIndicator() {
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator";
      typingIndicator.id = "typing-indicator";
      typingIndicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return typingIndicator;
    }

    function hideTypingIndicator() {
      const indicator = messagesContainer.querySelector("#typing-indicator");
      if (indicator) indicator.remove();
    }

async function processMessageQueue() {
  if (isProcessingQueue || responseQueue.length === 0) return;

  isProcessingQueue = true;
  showTypingIndicator();

  await new Promise(r => setTimeout(r, 800));
  hideTypingIndicator();

  const message = responseQueue.shift();
  const botMsg = document.createElement("div");
  botMsg.className = "chat-message bot";

  // ✅ Convertir URLs en enlaces clicables
  botMsg.innerHTML = message.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" style="color: var(--chat--color-primary); text-decoration: underline;">$1</a>'
  );

  messagesContainer.appendChild(botMsg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  isProcessingQueue = false;

  if (responseQueue.length > 0) {
    setTimeout(processMessageQueue, 1000);
  }
}

    function extractBlocks(message) {
      if (!message) return ["No hay respuesta"];
      const regex = /\[BLOQUE\](.*?)\[\/BLOQUE\]/gs;
      const blocks = [...message.matchAll(regex)].map(m => m[1].trim());
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

        const output = Array.isArray(data) ? data[0].output : data.output;
        const blocks = extractBlocks(output);
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
        const blocks = extractBlocks(output);
        responseQueue = responseQueue.concat(blocks);
        if (!isProcessingQueue) {
          processMessageQueue();
        }
      } catch (e) {
        console.error("Error:", e);
        const errorMsg = document.createElement("div");
        errorMsg.className = "chat-message bot";
        errorMsg.textContent = "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.";
        messagesContainer.appendChild(errorMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    newChatBtn.addEventListener("click", async () => {
      if (started) return;
      started = true;
      newChatBtn.style.display = "none";
      loader.style.display = "flex";
      await startConversation();
      loader.style.display = "none";
      newChatBtn.style.display = "flex";
      started = false;
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
      const isOpening = !container.classList.contains("open");
      const pingElement = toggleButton.querySelector('.animate-ping');
      const ctaElement = toggleButton.querySelector('.cta-chat');
      
      container.classList.toggle("open");
      
      // Controlar el parpadeo y cartel según el estado
      if (isOpening && pingElement) {
        pingElement.style.display = 'none'; // Ocultar parpadeo al abrir
      } else if (!isOpening && pingElement) {
        pingElement.style.display = 'inline-flex'; // Mostrar parpadeo al cerrar
      }
      
      if (isOpening && ctaElement) {
        ctaElement.style.display = 'none'; // Ocultar cartel al abrir
      } else if (!isOpening && ctaElement) {
        ctaElement.style.display = 'block'; // Mostrar cartel al cerrar
      }
    });

    closeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const pingElement = toggleButton.querySelector('.animate-ping');
        const ctaElement = toggleButton.querySelector('.cta-chat');
        
        container.classList.remove("open");
        
        // Restaurar parpadeo y cartel al cerrar la ventana
        if (pingElement) {
          pingElement.style.display = 'inline-flex';
        }
        if (ctaElement) {
          ctaElement.style.display = 'block';
        }
      });
    });
  }

  getStyles() {
    return `
          *{
            white-space: normal;
          }

          .cta-chat {
            position: absolute;
            bottom: 100%;               /* justo encima del botón */
            right: 40%;                 /* más hacia la derecha */
            transform: translateX(15%); /* menos desplazamiento hacia la izquierda */
            margin-bottom: 12px;        /* separación del botón */
            width: max-content;
            max-width: 160px;           /* reducido para móviles */
            padding: 8px 12px;
            background-color: white;
            color: black;
            font-size: 0.875rem;
            text-align: center;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
            animation: bounce 1s infinite;
            z-index: 50;
            line-height: 1.3;
          }

          /* Media query para pantallas muy pequeñas */
          @media (max-width: 480px) {
            .cta-chat {
              right: 50%;               /* más hacia la derecha en móviles */
              transform: translateX(30%); /* menos desplazamiento */
              max-width: 140px;
              font-size: 0.8rem;
            }
          }
            
          .animate-ping {
            position: absolute;
            display: inline-flex;
            width: 100%;
            height: 100%;
            border-radius: 9999px;
            background-color: var(--chat--color-primary);
            opacity: 0.25;
            animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          .animate-bounce {
            animation: bounce 1s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
            50% { transform: translateY(-8px); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
          }

          .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
    
          .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px var(--chat--color-primary-sombra);
            border: 1px solid var(--chat--color-primary-borde);
            overflow: hidden;
            font-family: inherit;
          }
    
          .chat-container.position-left {
            right: auto;
            left: 20px;
          }
    
          .chat-container.open {
            display: flex;
            flex-direction: column;
          }
    
          .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
          }

          .header-controls {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .theme-toggle {
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 16px;
            opacity: 0.7;
            border-radius: 4px;
          }

          .theme-toggle:hover {
            opacity: 1;
            background: rgba(133, 79, 255, 0.1);
          }

          .theme-toggle svg {
            width: 16px;
            height: 16px;
          }
    
          .close-button {
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
          }
    
          .close-button:hover {
            opacity: 1;
          }
    
          .brand-header img {
            width: 78px;
            height: 32px;
          }
    
          .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
          }
    
          .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
          }
    
          .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
          }
    
          .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
          }
    
          .new-chat-btn:hover {
            transform: scale(1.02);
          }
    
          .message-icon {
            width: 20px;
            height: 20px;
          }
    
          .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
          }
    
          .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
          }
    
          .chat-interface.active {
            display: flex;
          }
    
          .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
          }
    
          .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
          }
    
          .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px var(--chat--color-primary-sombra);
            border: none;
          }
    
          .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid var(--chat--color-primary-borde);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
    
          .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid var(--chat--color-primary-borde);
            display: flex;
            gap: 8px;
          }
    
          .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid var(--chat--color-primary-borde);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
          }
    
          .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
          }
    
          .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
          }
    
          .chat-input button:hover {
            transform: scale(1.05);
          }
    
          .chat-toggle {
            position: fixed;
            bottom: 5rem;
            right: 4%;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary), var(--chat--color-secondary));
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px var(--chat--color-primary-sombra);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
    
          .chat-toggle.position-left {
            right: auto;
            left: 20px;
          }
    
          .chat-toggle:hover {
            transform: scale(1.05);
          }
    
          .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
          }
    
          .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
          }
    
          .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
          }
    
          .chat-footer a:hover {
            opacity: 1;
          }
      `;
  }
}

customElements.define('chat-widget', N8NChatWidget);
