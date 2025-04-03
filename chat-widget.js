// Chat Widget Script (Versión 100% Corregida)
(function() {
    // =============================================
    // 1. CARGAMOS FUENTE ALTERNATIVA (Geist Sans)
    // =============================================
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            @import url('https://fonts.cdnfonts.com/css/geist-sans');
            .n8n-chat-widget * {
                font-family: 'Geist Sans', sans-serif !important;
            }
        </style>
    `);

    // =============================================
    // 2. ESTILOS CORREGIDOS (CON !IMPORTANT)
    // =============================================
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
        }

        /* BOTÓN DE CIERRE CORREGIDO (SIN FONDO BLANCO) */
        .n8n-chat-widget .close-button {
            all: unset !important;
            position: absolute !important;
            right: 16px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            font-size: 28px !important;
            color: var(--chat--color-font) !important;
            cursor: pointer !important;
            width: 30px !important;
            height: 30px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0.6;
            transition: opacity 0.2s ease !important;
            z-index: 1000 !important;
            background: transparent !important;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1 !important;
        }

        /* BOTÓN FLOTANTE (CHAT-TOGGLE) */
        .n8n-chat-widget .chat-toggle {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%) !important;
            color: white !important;
            border: none !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3) !important;
            z-index: 999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* ... (TODOS LOS DEMÁS ESTILOS ORIGINALES AQUÍ) ... */
    `;

    // =============================================
    // 3. INYECTAMOS ESTILOS (EVITANDO CACHE)
    // =============================================
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    styleSheet.setAttribute('data-version', '2.0-fixed');
    document.head.appendChild(styleSheet);

    // =============================================
    // 4. CONFIGURACIÓN DEL WIDGET (ORIGINAL)
    // =============================================
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: { text: 'Powered by InfinyAI', link: '' }
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    const config = window.ChatWidgetConfig || defaultConfig;

    // =============================================
    // 5. FUNCIONALIDAD DEL CHAT (ORIGINAL)
    // =============================================
    if (!window.N8NChatWidgetInitialized) {
        window.N8NChatWidgetInitialized = true;
        
        // ... (TODO EL CÓDIGO ORIGINAL DE FUNCIONAMIENTO AQUÍ) ...
        // Incluyendo: createWidget, eventListeners, etc.
    }
})();
