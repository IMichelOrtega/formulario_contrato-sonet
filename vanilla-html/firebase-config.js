// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración de tu aplicación web en Firebase
const firebaseConfig = {
    apiKey: "AIzaSyALifNLjZgvAgbyz_CdRSPnKzCw9XzCQxA",
    authDomain: "asonet-comercial.firebaseapp.com",
    projectId: "asonet-comercial",
    storageBucket: "asonet-comercial.firebasestorage.app",
    messagingSenderId: "1015959268602",
    appId: "1:1015959268602:web:326c4a13028ff347632d43",
    measurementId: "G-V9BFPRTDTQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
