/**
 * ════════════════════════════════════════════════════════════════════════════
 * CÓDIGO PARA ADMINISTRACIÓN Y CREDENCIALES DE FIREBASE
 * ════════════════════════════════════════════════════════════════════════════
 */

import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// ───────────────────────────────────────────────────────────────────────────
// LISTA DE EMAILS ADMIN PARA REGISTRO
// ───────────────────────────────────────────────────────────────────────────

const ADMIN_EMAILS = [
  {
    email: 'admin1@asonet.com.co',
    name: 'Administrador 1',
    role: 'ADMIN',
    iniciales: 'A1'
  },
  {
    email: 'admin2@asonet.com.co',
    name: 'Administrador 2',
    role: 'ADMIN',
    iniciales: 'A2'
  },
  {
    email: 'admin3@asonet.com.co',
    name: 'Administrador 3',
    role: 'ADMIN',
    iniciales: 'A3'
  },
  {
    email: 'admin4@asonet.com.co',
    name: 'Administrador 4',
    role: 'ADMIN',
    iniciales: 'A4'
  }
];

// ───────────────────────────────────────────────────────────────────────────
// PASO 2: SCRIPT PARA MOSTRAR CREDENCIALES EN DASHBOARD ADMIN
// ───────────────────────────────────────────────────────────────────────────

async function mostrarCredencialesAdmin() {
  try {
    // Obtener todos los usuarios ADMIN desde Firestore
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('role', '==', 'ADMIN'));
    const querySnapshot = await getDocs(q);

    const admins = [];
    querySnapshot.forEach((doc) => {
      admins.push({
        uid: doc.id,
        ...doc.data()
      });
    });

    if (admins.length === 0) {
      mostrarTarjetasAdmin(ADMIN_EMAILS);
    } else {
      mostrarTarjetasAdmin(admins);
    }
  } catch (err) {
    console.error('Error al cargar admins:', err);
    mostrarTarjetasAdmin(ADMIN_EMAILS);
  }
}

function mostrarTarjetasAdmin(admins) {
  const contenedor = document.getElementById('admin-credentials-container');
  if (!contenedor) return;

  contenedor.innerHTML = admins.map(admin => `
    <div style="
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    ">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a56db, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
        ">
          ${admin.iniciales || 'AD'}
        </div>
        <div>
          <div style="font-weight: 600; color: #1e293b; font-size: 16px;">
            ${admin.name}
          </div>
          <div style="color: #64748b; font-size: 13px;">
            Administrador
          </div>
        </div>
      </div>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
        <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 4px;">
          Email (para ingresar)
        </div>
        <div style="
          font-family: 'Courier New', monospace;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          color: #1e293b;
          word-break: break-all;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <span>${admin.email}</span>
          <button onclick="copiarAlPortapapeles('${admin.email}')" style="
            background: none;
            border: none;
            color: #1a56db;
            cursor: pointer;
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background 0.2s;
          " onmouseover="this.style.background='rgba(26,86,219,0.1)'" onmouseout="this.style.background='none'">
            📋 Copiar
          </button>
        </div>
      </div>

      <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
        <strong>Instrucciones:</strong><br>
        1. Usa el email para iniciar sesión<br>
        2. Firebase enviará un enlace de contraseña<br>
        3. Establece tu contraseña personal<br>
        <strong style="color: #dc2626;">⚠️ Nunca compartas esta credencial</strong>
      </div>
    </div>
  `).join('');
}

function copiarAlPortapapeles(texto) {
  navigator.clipboard.writeText(texto).then(() => {
    alert('✓ Email copiado al portapapeles');
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
}

// Bindings globales si se requiere
window.copiarAlPortapapeles = copiarAlPortapapeles;

export { ADMIN_EMAILS, mostrarCredencialesAdmin, mostrarTarjetasAdmin, copiarAlPortapapeles };
