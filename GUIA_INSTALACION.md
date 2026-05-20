# 🚀 Guía: React + Tailwind + Express Backend

Sistema completo para gestión de contratos de **@Sonet Colombia**.

## 📋 Requisitos previos

- **Node.js** 18+ ([descargar](https://nodejs.org))
- **MongoDB** corriendo localmente o conexión a cloud
- **Git** (opcional)

---

## 📁 Estructura del Proyecto

```
sonet-contratos/
├── frontend/                # App React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegistroPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CrearContrato.jsx
│   │   │   ├── EditarContrato.jsx
│   │   │   └── DetalleContrato.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                 # Express + MongoDB
│   ├── routes/
│   ├── models/
│   ├── utils/
│   │   └── pdfGenerator.js
│   ├── index.js            # Archivo principal
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🎯 PASO 1: Configurar Backend

### 1.1 Crear carpeta del proyecto

```bash
mkdir sonet-contratos
cd sonet-contratos
mkdir backend frontend
```

### 1.2 Configurar Backend

```bash
cd backend
npm init -y
```

### 1.3 Instalar dependencias del backend

```bash
npm install express mongoose cors bcryptjs jsonwebtoken dotenv pdfkit axios
npm install --save-dev nodemon
```

### 1.4 Archivos necesarios para backend

Copia estos archivos en la carpeta `backend/`:
- `backend-express.js` → renombra a `index.js`
- `pdfGenerator.js` → mueve a `utils/pdfGenerator.js`
- `.env.example` → copia a `.env`

### 1.5 Configurar .env

```bash
# .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sonet_contratos
SECRET_KEY=tu-clave-secreta-super-segura-aqui-123456
NODE_ENV=development
```

### 1.6 Actualizar package.json (backend)

```json
{
  "name": "sonet-contratos-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.2",
    "dotenv": "^16.3.1",
    "pdfkit": "^0.13.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 1.7 Probar backend

```bash
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado
✅ Servidor corriendo en puerto 5000
```

---

## 🎨 PASO 2: Configurar Frontend

### 2.1 Crear proyecto React + Vite

```bash
cd ../frontend
npm create vite@latest . -- --template react
```

Cuando pregunte, presiona Enter para aceptar las opciones por defecto.

### 2.2 Instalar dependencias

```bash
npm install
npm install axios react-router-dom
```

### 2.3 Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2.4 Configurar Tailwind

Edita `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2.5 Agregar estilos Tailwind a index.css

Reemplaza el contenido de `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 2.6 Estructura de carpetas (frontend)

```bash
mkdir -p src/pages src/components src/utils
```

### 2.7 Copiar componentes

Copia estos archivos a `src/pages/`:
- `pages-LoginPage.jsx` → `LoginPage.jsx`
- `pages-Dashboard.jsx` → `Dashboard.jsx`
- `pages-CrearContrato.jsx` → `CrearContrato.jsx`

Reemplaza `src/App.jsx` con el `App.jsx` que te proporcioné

### 2.8 Actualizar vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

### 2.9 Crear archivo main.jsx

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## ▶️ EJECUTAR EL PROYECTO

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Output esperado:
```
✅ MongoDB conectado
✅ Servidor corriendo en puerto 5000
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Output esperado:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

### Abrir en navegador

```
http://localhost:3000
```

---

## 🔐 Credenciales de Prueba

Regístrate nuevo usuario o usa:
- **Email:** admin@asonet.com
- **Contraseña:** admin123

---

## 🎯 Funcionalidades Principales

✅ **Autenticación**: Registro e inicio de sesión con JWT
✅ **Crear Contratos**: Formulario de 4 pasos con validación
✅ **Listar Contratos**: Dashboard con estadísticas
✅ **Ver Detalle**: Información completa del contrato
✅ **Editar Contrato**: Actualizar datos y regenerar PDF
✅ **Eliminar**: Con confirmación
✅ **Generar PDF**: Automático al crear/editar
✅ **Descargar PDF**: Descarga directa

---

## 📊 API Endpoints

### Autenticación
```
POST   /api/auth/registro
POST   /api/auth/login
```

### Contratos
```
POST   /api/contratos              # Crear
GET    /api/contratos              # Listar
GET    /api/contratos/:id          # Obtener
PUT    /api/contratos/:id          # Actualizar
DELETE /api/contratos/:id          # Eliminar
GET    /api/contratos/:id/pdf      # Descargar PDF
```

---

## 🚀 Deploy a Producción

### Frontend (Vercel)

```bash
cd frontend
npm run build
```

Sube la carpeta `dist` a [Vercel](https://vercel.com)

### Backend (Render o Railway)

1. Crea cuenta en [Render.com](https://render.com)
2. Conecta tu repositorio GitHub
3. Configura variables de entorno:
   - `MONGODB_URI`: Tu URI de MongoDB
   - `SECRET_KEY`: Clave segura
   - `PORT`: 5000

---

## 🐛 Troubleshooting

### "Cannot find module 'mongodb'"
```bash
cd backend
npm install mongoose
```

### "Port 5000 already in use"
```bash
# Mata el proceso
# Linux/Mac:
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "CORS error"
Asegúrate que el backend tiene CORS habilitado y el frontend hace requests a http://localhost:5000

### "MongoDB connection refused"
```bash
# Instala MongoDB localmente o usa MongoDB Atlas
# https://www.mongodb.com/cloud/atlas
```

---

## 📚 Próximos Pasos

1. Agregar validaciones más estrictas
2. Implementar generación de PDF con más estilos
3. Guardar PDFs en Google Drive o AWS S3
4. Agregar búsqueda y filtros
5. Sistema de permisos para admin/asesor
6. Exportar contratos a Excel
7. Integración con WhatsApp Bot

---

## 🤝 Soporte

Si tienes problemas, verifica:
1. ✅ Node.js 18+ instalado
2. ✅ MongoDB corriendo
3. ✅ Variables .env configuradas
4. ✅ Puertos 3000 y 5000 disponibles
5. ✅ Archivos en las carpetas correctas

¡Listo! Tu sistema de contratos está operacional 🎉
