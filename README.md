# 🧙‍♀️ Andreesitos - Frontend (Entrega 3)

Este repositorio contiene la interfaz gráfica de **Webtan**, un juego desarrollado con React.

## ⚙️ Tecnologías

- React (Vite)
- ESLint (guía de estilo Airbnb)
- Yarn

## 🚀 Instrucciones de ejecución

1. Clona este repositorio:
   git clone https://github.com/IIC2513/Andreesitos_front_s2.git
   cd Andreesitos_front_s2
2. Instala las dependencias:
   yarn install
3. Inicia el entorno de desarrollo:
    yarn dev
El frontend estará disponible en: http://localhost:5173

## ✅ Linter
Este proyecto usa ESLint con la guía de estilo de Airbnb.

- Revisar el código:
    npx eslint src/
- Corregir automáticamente:
    npx eslint src/ --fix
Recomendación: instala la extensión ESLint de VS Code y asegúrate de tener "eslint.validate": ["javascript", "javascriptreact"] en .vscode/settings.json.

## 📂 Estructura del proyecto
src/
├── assets/           # Imágenes y recursos estáticos
├── components/       # Componentes reutilizables
├── context/          # Contexto global (Auth, estado)
├── layout/           # Layout del tablero
├── pages/            # Páginas principales (home, partida, login, etc.)
└── main.jsx          # Punto de entrada

