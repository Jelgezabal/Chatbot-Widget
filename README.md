# ✨ Chatbot Widget para Web | Personalizable & Responsive

<div align="center">

![Demo del Widget](https://raw.githubusercontent.com/Jelgezabal/Chatbot-Widget/main/assets/demo.gif)  
*Interfaz moderna con animaciones fluidas y diseño adaptable*

[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![Versión](https://img.shields.io/badge/Versión-1.0.0-green.svg)](https://github.com/Jelgezabal/Chatbot-Widget/releases)
[![Tamaño del Repositorio](https://img.shields.io/github/repo-size/Jelgezabal/Chatbot-Widget)](https://github.com/Jelgezabal/Chatbot-Widget)

</div>

---

## 🚀 ¿Qué es este Widget?

Un **widget de chatbot** para integrar fácilmente en tu sitio web. Es rápido, liviano, totalmente personalizable y compatible con cualquier diseño gracias a su estilo responsive.

---

## 🎯 Características Principales

| ⚡ Integración Fácil | 🎨 Estilo Personalizable | 📱 Diseño Responsive |
|---------------------|-------------------------|----------------------|
| Enlace directo por `<script>` | Colores, texto, logo y posición | Perfecto en móviles, tablets y escritorio |

---

## 🛠️ Implementación Básica

```html
<!-- Configuración básica -->
<script>
  window.ChatWidgetConfig = {
    branding: {
      logo: "assets/logo.png",
      name: "Mi Empresa",
      welcomeText: "¡Hola! 👋",
      responseTime: "Te respondemos en menos de 5 minutos"
    },
    style: {
      primaryColor: "#854fff",
      secondaryColor: "#6b3fd4",
      position: "right",
      fontColor: "#333333"
    }
  };
</script>
<script src="https://tudominio.com/widget/chat-widget.js"></script>

📦 Instalación Paso a Paso

    Clona este repositorio

git clone https://github.com/Jelgezabal/Chatbot-Widget.git

    Personaliza el widget

    Edita chat-widget.js para cambiar colores o textos.

    Sube tu logo personalizado en la carpeta /assets.

    Integra en tu web

<script src="https://tudominio.com/widget/chat-widget.js"></script>

🌈 Vista Previa
Estado Inicial	Chat Abierto	Modo Móvil
	
	
<details> <summary>📚 Documentación Técnica</summary>
🔧 Opciones Avanzadas

style: {
  primaryColor: "#854fff",
  secondaryColor: "#6b3fd4",
  position: "left", // o "right"
  fontColor: "#ffffff"
}

branding: {
  logo: "assets/logo.png",
  name: "Mi Empresa",
  welcomeText: "¡Hola! 👋",
  responseTime: "Respuesta en <5min"
}

</details>
🙌 Créditos
<div align="center">

Basado en el proyecto original de
WayneSimpson/n8n-chatbot-template
Adaptado con ❤️ por Jelgezabal

Licencia MIT
</div>
🧭 Roadmap

Versión inicial funcional

Soporte para modo oscuro

    Integración con APIs externas (DialogFlow, GPT, etc.)

🐞 ¿Encontraste un error?

Abre un issue aquí con los detalles.
⭐ ¡Dale una estrella si te gustó!

Tu apoyo ayuda a que el proyecto siga creciendo 🚀
