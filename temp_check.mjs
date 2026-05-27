        import { db } from './firebase-config.js';
        import { collection, getDocs, addDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

        // ──────────────────────────────────────────────────────────────
        // FUNCIÓN GENERADORA DE PDF INLINE (sin archivo externo)
        // ──────────────────────────────────────────────────────────────
        function generarPDFContrato(datosContrato) {
            if (typeof html2pdf === 'undefined') {
                console.error('html2pdf no cargado.');
                return;
            }

            // HTML del contrato (idéntico a contrato_internet.html)
            const htmlContenido = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; background: #fff; }
        .page { font-size: 9px; color: #000; width: 100%; margin: 0; background: #fff; 
                page-break-after: always; padding: 20px; }
        table { border-collapse: collapse; width: 100%; }
        td { border: 1px solid #000; vertical-align: top; padding: 0; }
        .col { width: 50%; vertical-align: top; border-right: 1px solid #000; }
        .col:last-child { border-right: none; }
        .st { background: #000; color: #fff; font-weight: 700; font-size: 8.5px; 
              padding: 2px 6px; text-transform: uppercase; }
        .bd { padding: 5px 7px; font-size: 8.8px; line-height: 1.45; border-top: 1px solid #000; }
        .sec { border-bottom: 1px solid #000; }
        input { border: none; border-bottom: 1px solid #000; background: transparent; 
                font-family: Arial; font-size: 9px; padding: 1px 2px; color: #000; }
        input[type="checkbox"] { vertical-align: middle; }
        ol { padding-left: 13px; }
        ol li { margin-bottom: 2px; }
        p { margin-bottom: 2px; }
        table.inner { border-collapse: collapse; width: 100%; font-size: 8.5px; }
        table.inner td { border: 1px solid #000; padding: 2px 4px; }
        .num-circle { display: inline-flex; align-items: center; justify-content: center; 
                      width: 14px; height: 14px; border: 1px solid #000; border-radius: 50%; 
                      font-weight: 700; font-size: 8px; margin-right: 4px; }
        .row-item { display: flex; align-items: flex-start; margin-bottom: 4px; }
      </style>
    </head>
    <body>

    <div class="page">
      <table class="doc">
        <tr>
          <td class="col">

            <table>
              <tr>
                <td style="border:none;padding:8px 8px 6px;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                      <div style="font-size:26px;font-weight:900;line-height:1.1;">@sonet</div>
                      <div style="font-size:13px;">Colombia <strong>sas</strong></div>
                      <div style="font-size:8.5px;margin-top:3px;">Nit: 900.669.038-6</div>
                      <div style="font-size:8.5px;">Cra 7 # 7-84</div>
                      <div style="font-size:8.5px;">barrio el centro Garzón - Huila</div>
                    </div>
                    <div style="border:1px solid #000;padding:4px 6px;font-size:8.5px;font-weight:700;text-align:center;">
                      CONTRATO ÚNICO<br>DE SERVICIOS FIJOS</div>
                  </div>
                </td>
              </tr>
            </table>

            <table>
              <tr>
                <td class="bd" style="border-top:1px solid #000;">
                  Este contrato explica las condiciones para la presentación de los servicios entre usted y @SONET
                  COLOMBIA SAS, por el que pagará mínimo mensualmente $${datosContrato.valorMensual || '___________'}.<br>
                  Este contrato tendrá vigencia de ${datosContrato.mesesVigencia || '___'} meses, contados a partir del ${datosContrato.fechaInicio || '_______________'}<br>
                  El plazo máximo de instalación es de 15 días hábiles.<br>
                  Acepto que mi contrato se renueve sucesiva y automáticamente por un plazo igual al inicial. 
                  ${datosContrato.renovacionAuto ? '✓' : '☐'}
                </td>
              </tr>
            </table>

            <div class="sec">
              <div class="st">EL SERVICIO</div>
              <div class="bd">
                <p>Con este contrato nos comprometemos a prestarle los servicios que usted elija*:</p>
                <p>
                  ${datosContrato.servicios?.telefoniaFija ? '✓' : '☐'} Telefonía fija &nbsp;&nbsp;
                  ${datosContrato.servicios?.internetFijo ? '✓' : '☐'} Internet fijo &nbsp;&nbsp;
                  ${datosContrato.servicios?.television ? '✓' : '☐'} Televisión
                </p>
                <p style="margin-top:3px;">Servicios adicionales: ${datosContrato.serviciosAdicionales || 'Ninguno'}</p>
                <p>Usted se compromete a pagar oportunamente el precio acordado.</p>
                <p>El servicio se activará a más tardar el día: ${datosContrato.fechaActivacion || '______________'}</p>
              </div>
            </div>

            <div class="sec">
              <div class="st">INFORMACIÓN DEL SUSCRIPTOR</div>
              <div class="bd">
                <p>Contrato N° ${datosContrato.numeroContrato || '_______________'}</p>
                <p>Nombre/Razón Social ${datosContrato.nombre || '_______________'}</p>
                <p>Identificación ${datosContrato.identificacion || '_______________'}</p>
                <p>Correo Electrónico ${datosContrato.email || '_______________'}</p>
                <p>Teléfono de contacto ${datosContrato.telefono || '_______________'}</p>
                <p>Dirección Servicio ${datosContrato.direccionServicio || '_______________'} Estrato ${datosContrato.estrato || '___'}</p>
                <p>Departamento ${datosContrato.departamento || 'Huila'} Municipio ${datosContrato.municipio || 'Garzón'}</p>
                <p>Dirección Suscriptor ${datosContrato.direccionSuscriptor || 'Misma del servicio'}</p>
              </div>
            </div>

            <div class="sec">
              <div class="st">CONDICIONES COMERCIALES<br>CARACTERÍSTICAS DEL PLAN</div>
              <div class="bd">
                <p><strong>INTERNET FIJO.</strong> "Redes interconectadas" Unión de todas las redes y computadoras 
                distribuidas en el mundo, creando una red global conjunta de equipos que trabajan sobre protocolos TCP/IP 
                compatibles entre sí.</p>
                <p style="margin-top:3px;">@SONET COLOMBIA SAS debe mantener en buen estado el funcionamiento de servicio 
                contratado, solucionar los cortes o interferencia durante las siguientes 72 horas de reportada la falla.</p>
              </div>
            </div>

          </td>

          <td class="col" style="border-right:none;">

            <div class="sec">
              <div class="st">PRINCIPALES OBLIGACIONES DEL USUARIO</div>
              <div class="bd">
                <ol>
                  <li>Pagar oportunamente los servicios prestados</li>
                  <li>Suministrar información verdadera</li>
                  <li>Hacer uso adecuado de los equipos y los servicios</li>
                  <li>No divulgar ni acceder a pornografía infantil</li>
                  <li>Avisar a las autoridades cualquier evento de robo o hurto</li>
                  <li>No cometer o ser partícipe de actividades de fraude</li>
                </ol>
              </div>
            </div>

            <div class="sec">
              <div class="st">TERMINACIÓN</div>
              <div class="bd">
                <p>Usted puede terminar el contrato en cualquier momento sin penalidades. Para esto debe realizar 
                una solicitud mínimo 3 días hábiles antes del corte de facturación (día ${datosContrato.diaCorte || '15'} 
                de cada mes).</p>
              </div>
            </div>

            <div class="sec">
              <div class="st">INFORMACIÓN ADICIONAL</div>
              <div class="bd">
                <p>Tipo de Vivienda: &nbsp;${datosContrato.tipoVivienda?.propia ? '✓' : '☐'} Propia 
                &nbsp;${datosContrato.tipoVivienda?.arriendo ? '✓' : '☐'} Arriendo 
                &nbsp;${datosContrato.tipoVivienda?.familiar ? '✓' : '☐'} Familiar</p>
                <p style="margin-top:3px;">Persona: &nbsp;${datosContrato.personaJuridica ? '✓' : '☐'} Jurídica 
                &nbsp;${datosContrato.personaNatural ? '✓' : '☐'} Natural</p>
                <table class="inner" style="margin-top:4px;">
                  <tr>
                    <td style="width:50%;font-weight:700;">CC/CE</td>
                    <td style="font-weight:700;">FECHA</td>
                  </tr>
                  <tr>
                    <td style="height:20px;">${datosContrato.cedula || ''}</td>
                    <td>${datosContrato.fechaFirma || ''}</td>
                  </tr>
                </table>
                <p style="margin-top:5px;">Asesor: ${datosContrato.asesor || '_______________'}</p>
              </div>
            </div>

            <div style="text-align:right;padding:4px 6px;font-size:8px;color:#555;">1 de 1</div>
          </td>
        </tr>
      </table>
    </div>

    </body>
    </html>
            `;

            const elemento = document.createElement('div');
            elemento.innerHTML = htmlContenido;

            const opciones = {
                margin: 0,
                filename: `contrato-${datosContrato.numeroContrato || datosContrato.id}-${datosContrato.nombre?.replace(/\s+/g, '-') || 'cliente'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
            };

            html2pdf().set(opciones).from(elemento).save();
        }

        // ──────────────────────────────────────────────────────────────
        // CONFIGURACIÓN Y DEMO DATA
        // ──────────────────────────────────────────────────────────────
        const API = {
            dashboard: '/api/dashboard',
            logout: '/api/logout',
            nuevo: 'contrato.html',
        };

        const DEMO_DATA = {
            contratos: [
                { id: '001', nombre: 'Carlos Medina', cc: '12.345.678', servicio: 'Internet + TV', fecha: '2025-05-15', pdf_listo: true },
                { id: '002', nombre: 'María Torres', cc: '98.765.432', servicio: 'Internet fijo', fecha: '2025-05-19', pdf_listo: true },
                { id: '003', nombre: 'Luis Gómez', cc: '45.123.900', servicio: 'Telefonía + Internet', fecha: '2025-05-20', pdf_listo: false },
            ]
        };

        let allContracts = [];
        let filtered = [];
        let currentPage = 1;
        const PAGE_SIZE = 10;

        // Init
        document.addEventListener('DOMContentLoaded', () => {
            setTodayDate();
            loadDashboard();
        });

        function setTodayDate() {
            const d = new Date();
            document.getElementById('today-date').textContent =
                d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }

        async function loadDashboard() {
            const sessionUser = JSON.parse(sessionStorage.getItem('user') || 'null');
            if (!sessionUser) {
                window.location.href = 'index.html';
                return;
            }
            const asesor = {
                nombre: sessionUser.name || 'Asesor',
                iniciales: sessionUser.iniciales || getIniciales(sessionUser.name || 'Asesor')
            };
            setAsesor(asesor);

            try {
                // Conectar con Firestore en lugar del backend REST
                const qSnap = await getDocs(collection(db, 'contratos'));
                const contratos = [];
                qSnap.forEach(docSnap => {
                    contratos.push({ id: docSnap.id, ...docSnap.data() });
                });
                setContracts(contratos);
                localStorage.setItem('sonet_contratos', JSON.stringify(contratos));
                return;
            } catch (err) {
                console.error("Firestore loading error. Using localStorage backup:", err);
            }

            const savedContratos = localStorage.getItem('sonet_contratos');
            if (savedContratos) {
                setContracts(JSON.parse(savedContratos));
            } else {
                setContracts(DEMO_DATA.contratos);
                localStorage.setItem('sonet_contratos', JSON.stringify(DEMO_DATA.contratos));
            }
        }

        function setAsesor(a) {
            const ini = a.iniciales || getIniciales(a.nombre);
            document.getElementById('sb-avatar').textContent = ini;
            document.getElementById('topbar-avatar').textContent = ini;
            document.getElementById('sb-name').textContent = a.nombre;
        }

        function getIniciales(nombre) {
            return (nombre || '').split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
        }

        function setContracts(contratos) {
            allContracts = contratos;
            updateStats();
            filtered = [...allContracts];
            currentPage = 1;
            renderTable();
        }

        function updateStats() {
            const now = new Date();
            const mes = now.getMonth();
            const anio = now.getFullYear();
            const total = allContracts.length;
            const esteMes = allContracts.filter(c => {
                const d = new Date(c.fecha);
                return d.getMonth() === mes && d.getFullYear() === anio;
            }).length;
            const conPdf = allContracts.filter(c => c.pdf_listo).length;
            const pending = allContracts.filter(c => !c.pdf_listo).length;

            animateNum('stat-total', total);
            animateNum('stat-month', esteMes);
            animateNum('stat-pdf', conPdf);
            document.getElementById('sb-pending-badge').textContent = pending;
        }

        function animateNum(id, target) {
            const el = document.getElementById(id);
            if (!el) return;
            let current = 0;
            const step = Math.ceil(target / 20) || 1;
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 40);
        }

        function filterTable() {
            const q = document.getElementById('search-input').value.toLowerCase().trim();
            filtered = q
                ? allContracts.filter(c =>
                    c.nombre.toLowerCase().includes(q) ||
                    c.cc.replace(/\./g, '').includes(q.replace(/\./g, '')) ||
                    c.servicio.toLowerCase().includes(q)
                )
                : [...allContracts];
            currentPage = 1;
            renderTable();
        }

        function renderTable() {
            const tbody = document.getElementById('contracts-tbody');
            const empty = document.getElementById('empty-state');
            const start = (currentPage - 1) * PAGE_SIZE;
            const page = filtered.slice(start, start + PAGE_SIZE);

            if (filtered.length === 0) {
                tbody.innerHTML = '';
                empty.style.display = 'flex';
            } else {
                empty.style.display = 'none';
                tbody.innerHTML = page.map((c, i) => `
          <tr>
            <td style="color:var(--t3);font-size:12px">${String(start + i + 1).padStart(3, '0')}</td>
            <td>
              <div class="c-cell">
                <div class="c-av">${getIniciales(c.nombre)}</div>
                <div class="c-name">${esc(c.nombre)}</div>
              </div>
            </td>
            <td style="font-size:12px;color:var(--t2)">${esc(c.cc)}</td>
            <td style="font-size:13px">${esc(c.servicio)}</td>
            <td style="font-size:12px;color:var(--t2)">${formatDate(c.fecha)}</td>
            <td>
              <div class="actions">
                <button class="btn-dl" onclick="descargarPDFContrato('${esc(c.id)}','${esc(c.nombre)}','${esc(c.cc)}','${esc(c.servicio)}')">
                  <i class="ti ti-download" aria-hidden="true"></i>PDF
                </button>
                <button class="btn-eye" onclick="verContrato('${esc(c.id)}')">
                  <i class="ti ti-eye" aria-hidden="true"></i>
                </button>
                <button class="btn-trash" onclick="eliminarContrato('${esc(c.id)}')">
                  <i class="ti ti-trash" aria-hidden="true"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('');
            }
            renderPagination();
        }

        function formatDate(iso) {
            if (!iso) return '—';
            const [y, m, d] = iso.split('-');
            return `${d}/${m}/${y}`;
        }

        function esc(str) {
            return String(str ?? '')
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function renderPagination() {
            const total = filtered.length;
            const pages = Math.ceil(total / PAGE_SIZE);
            const start = (currentPage - 1) * PAGE_SIZE + 1;
            const end = Math.min(currentPage * PAGE_SIZE, total);

            document.getElementById('page-info').textContent =
                total === 0 ? 'Sin resultados' : `Mostrando ${start}–${end} de ${total}`;

            const btns = document.getElementById('page-btns');
            if (pages <= 1) { btns.innerHTML = ''; return; }

            let html = `<button class="pb" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
            for (let p = 1; p <= pages; p++) {
                if (pages > 7 && p > 2 && p < pages - 1 && Math.abs(p - currentPage) > 1) {
                    if (p === 3 || p === pages - 2) html += `<button class="pb" disabled>…</button>`;
                    continue;
                }
                html += `<button class="pb ${p === currentPage ? 'cur' : ''}" onclick="goPage(${p})">${p}</button>`;
            }
            html += `<button class="pb" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}>›</button>`;
            btns.innerHTML = html;
        }

        function goPage(p) {
            const pages = Math.ceil(filtered.length / PAGE_SIZE);
            if (p < 1 || p > pages) return;
            currentPage = p;
            renderTable();
            document.querySelector('.tbl-card').scrollIntoView({ behavior: 'smooth' });
        }

        // ──────────────────────────────────────────────────────────────
        // FUNCIÓN DE DESCARGA DE PDF CON DATOS RELLENADOS
        // ──────────────────────────────────────────────────────────────
        function descargarPDFContrato(id, nombre, cc, servicio) {
            try {
                const localData = JSON.parse(localStorage.getItem('sonet_contratos') || '[]');
                const savedItem = localData.find(c => c.id === id) || {};

                const datosContrato = {
                    id: id,
                    numeroContrato: id,
                    nombre: nombre,
                    identificacion: cc,
                    cc: cc,
                    servicio: servicio,
                    valorMensual: savedItem.valorMensual || '40.000',
                    mesesVigencia: savedItem.mesesVigencia || '12',
                    fechaInicio: savedItem.fecha ? formatDate(savedItem.fecha) : new Date().toLocaleDateString('es-CO'),
                    renovacionAuto: true,
                    servicios: {
                        internetFijo: servicio.toLowerCase().includes('internet'),
                        telefoniaFija: servicio.toLowerCase().includes('telefonía') || servicio.toLowerCase().includes('telefonia'),
                        television: servicio.toLowerCase().includes('tv') || servicio.toLowerCase().includes('televisión')
                    },
                    fechaActivacion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO'),
                    diaCorte: '15',
                    departamento: savedItem.departamento || 'Huila',
                    municipio: savedItem.municipio || 'Garzón',
                    estrato: savedItem.estrato || '3',
                    email: savedItem.email || 'cliente@example.com',
                    telefono: savedItem.telefono || '(+57) 8330560',
                    permanenciaMinima: false,
                    asesor: JSON.parse(sessionStorage.getItem('user') || '{}').name || 'Asesor'
                };

                if (typeof generarPDFContrato === 'function') {
                    generarPDFContrato(datosContrato);
                } else {
                    alert('Error: El generador de PDF no está disponible.');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Error al generar el PDF: ' + err.message);
            }
        }

        // ──────────────────────────────────────────────────────────────
        // FUNCIONALIDADES DE FIREBASE FIRESTORE (GUARDAR Y ELIMINAR)
        // ──────────────────────────────────────────────────────────────
        function nuevoContrato() {
            document.getElementById('new-contract-form').reset();
            document.getElementById('new-contract-modal').classList.add('show');
        }

        function closeNewContractModal() {
            document.getElementById('new-contract-modal').classList.remove('show');
        }

        async function guardarNuevoContrato() {
            const nombre = document.getElementById('nc-nombre').value.trim();
            const cc = document.getElementById('nc-cc').value.trim();
            const servicio = document.getElementById('nc-servicio').value;
            const valorMensual = document.getElementById('nc-valor').value.trim();
            const estrato = document.getElementById('nc-estrato').value;
            const telefono = document.getElementById('nc-telefono').value.trim();
            const email = document.getElementById('nc-email').value.trim();
            const municipio = document.getElementById('nc-municipio').value.trim();
            const departamento = document.getElementById('nc-departamento').value.trim();

            if (!nombre || !cc) {
                alert('Por favor complete los campos obligatorios.');
                return;
            }

            const nuevoItem = {
                nombre: nombre,
                cc: cc,
                servicio: servicio,
                fecha: new Date().toISOString().split('T')[0],
                pdf_listo: true,
                valorMensual: valorMensual,
                estrato: estrato,
                telefono: telefono,
                email: email,
                municipio: municipio,
                departamento: departamento,
                mesesVigencia: '12',
                asesor: JSON.parse(sessionStorage.getItem('user') || '{}').name || 'Asesor'
            };

            try {
                // Guardar en Firestore
                const docRef = await addDoc(collection(db, 'contratos'), nuevoItem);
                nuevoItem.id = docRef.id;

                allContracts.unshift(nuevoItem);
                localStorage.setItem('sonet_contratos', JSON.stringify(allContracts));
                
                closeNewContractModal();
                setContracts(allContracts);

                // Descargar el PDF automáticamente
                setTimeout(() => {
                    descargarPDFContrato(nuevoItem.id, nuevoItem.nombre, nuevoItem.cc, nuevoItem.servicio);
                }, 300);
            } catch (err) {
                console.error('Error saving to Firebase:', err);
                alert('Error al guardar en Firebase: ' + err.message);
            }
        }

        async function eliminarContrato(id) {
            if (confirm('¿Está seguro de que desea eliminar este contrato?')) {
                try {
                    // Eliminar de Firestore
                    await deleteDoc(doc(db, 'contratos', id));
                    
                    allContracts = allContracts.filter(c => c.id !== id);
                    localStorage.setItem('sonet_contratos', JSON.stringify(allContracts));
                    setContracts(allContracts);
                } catch (err) {
                    console.error('Error deleting from Firebase:', err);
                    alert('Error al eliminar de Firebase: ' + err.message);
                }
            }
        }

        function verContrato(id) {
            window.location.href = 'contrato_internet.html';
        }

        async function logout() {
            try {
                await fetch(API.logout, { method: 'POST', credentials: 'include' });
            } catch (_) { }
            sessionStorage.removeItem('user');
            window.location.href = 'index.html';
        }

        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('overlay').classList.toggle('show');
        }

        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('overlay').classList.remove('show');
        }

        // BINDING DE FUNCIONES AL OBJETO WINDOW (Necesario por el uso de type="module")
        window.nuevoContrato = nuevoContrato;
        window.closeNewContractModal = closeNewContractModal;
        window.guardarNuevoContrato = guardarNuevoContrato;
        window.eliminarContrato = eliminarContrato;
        window.descargarPDFContrato = descargarPDFContrato;
        window.verContrato = verContrato;
        window.logout = logout;
        window.toggleSidebar = toggleSidebar;
        window.closeSidebar = closeSidebar;
        window.goPage = goPage;
        window.filterTable = filterTable;