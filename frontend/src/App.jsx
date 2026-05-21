import { useState } from 'react';
import { registerUser } from './services/userService';

function App() {
  const [formData, setFormData] = useState({
    numeroContrato: '',
    tipoPersona: 'natural',
    nombreRazonSocial: '',
    identificacion: '',
    correoElectronico: '',
    telefonoContacto: '',
    direccionServicio: '',
    estrato: '1',
    municipio: '',
    tipoVivienda: 'Casa',
    nombrePropietario: '',
    telefoniaFija: false,
    internetFijo: false,
    velocidadInternet: '',
    television: false,
    valorMensual: '',
    tienePermanencia: false,
    vigenciaMeses: '12',
    renovacionAutomatica: false,
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    // Simple validations
    if (!formData.nombreRazonSocial || !formData.identificacion || !formData.direccionServicio) {
      setNotification({
        type: 'error',
        message: 'Por favor, completa los campos requeridos (Nombre/Razón Social, Identificación y Dirección).',
      });
      setLoading(false);
      return;
    }

    try {
      const parsedData = {
        ...formData,
        valorMensual: formData.valorMensual ? parseFloat(formData.valorMensual) : 0,
        vigenciaMeses: formData.tienePermanencia ? parseInt(formData.vigenciaMeses, 10) : 0,
      };

      const result = await registerUser(parsedData);
      if (result.success) {
        setNotification({
          type: 'success',
          message: `¡Contrato registrado con éxito! ID de Firebase: ${result.id}`,
        });
        // Reset form
        setFormData({
          numeroContrato: '',
          tipoPersona: 'natural',
          nombreRazonSocial: '',
          identificacion: '',
          correoElectronico: '',
          telefonoContacto: '',
          direccionServicio: '',
          estrato: '1',
          municipio: '',
          tipoVivienda: 'Casa',
          nombrePropietario: '',
          telefoniaFija: false,
          internetFijo: false,
          velocidadInternet: '',
          television: false,
          valorMensual: '',
          tienePermanencia: false,
          vigenciaMeses: '12',
          renovacionAutomatica: false,
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Error al guardar en Firebase: ${error.message || error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-between">
      {/* Background gradients for premium look */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-10 mb-8 transition-all duration-300">
        
        {/* Header section matching PDF reportlab header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                @sonet
              </span>
              <span className="text-xs px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium rounded-full">
                Colombia S.A.S.
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">NIT: 900.669.038-6 | Cra 7 # 7-84, Garzón - Huila</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <h1 className="text-lg font-bold text-slate-200 uppercase tracking-widest">
              Contrato Único de Servicios Fijos
            </h1>
            <p className="text-xs text-indigo-400 mt-1">Registro y Almacenamiento en Firebase</p>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-xl border mb-8 flex items-center justify-between transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: GENERAL INFORMATION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></span>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-200">
                Información General
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Número de Contrato (Opcional)
                </label>
                <input
                  type="text"
                  name="numeroContrato"
                  value={formData.numeroContrato}
                  onChange={handleChange}
                  placeholder="Ej: SN-2026-001"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Tipo de Persona
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center justify-center py-3 px-4 border rounded-xl cursor-pointer text-sm font-medium transition-all ${
                    formData.tipoPersona === 'natural'
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="tipoPersona"
                      value="natural"
                      checked={formData.tipoPersona === 'natural'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    Persona Natural
                  </label>
                  <label className={`flex items-center justify-center py-3 px-4 border rounded-xl cursor-pointer text-sm font-medium transition-all ${
                    formData.tipoPersona === 'juridica'
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="tipoPersona"
                      value="juridica"
                      checked={formData.tipoPersona === 'juridica'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    Persona Jurídica
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nombre Completo / Razón Social <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombreRazonSocial"
                  value={formData.nombreRazonSocial}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Alejandro Pérez o Sonet Tech S.A.S."
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Identificación (NIT / CC / CE) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 1098765432 o 900.123.456-7"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  name="telefonoContacto"
                  value={formData.telefonoContacto}
                  onChange={handleChange}
                  placeholder="Ej: 3101234567"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  placeholder="Ej: usuario@correo.com"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* SECTION 2: SERVICE LOCATION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></span>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-200">
                Dirección del Servicio
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Dirección de Instalación <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="direccionServicio"
                  value={formData.direccionServicio}
                  onChange={handleChange}
                  required
                  placeholder="Calle, Carrera, Barrio, Detalle..."
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Estrato
                </label>
                <select
                  name="estrato"
                  value={formData.estrato}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="1">Estrato 1</option>
                  <option value="2">Estrato 2</option>
                  <option value="3">Estrato 3</option>
                  <option value="4">Estrato 4</option>
                  <option value="5">Estrato 5</option>
                  <option value="6">Estrato 6</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Municipio
                </label>
                <input
                  type="text"
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  placeholder="Ej: Garzón, Neiva, Pitalito..."
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Tipo de Vivienda
                </label>
                <select
                  name="tipoVivienda"
                  value={formData.tipoVivienda}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Local Comercial">Local Comercial</option>
                  <option value="Lote / Finca">Lote / Finca</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nombre del Propietario (Si aplica)
                </label>
                <input
                  type="text"
                  name="nombrePropietario"
                  value={formData.nombrePropietario}
                  onChange={handleChange}
                  placeholder="Propietario del inmueble"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* SECTION 3: CONTRACTED SERVICES */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></span>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-200">
                Servicios Contratados
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Selecciona los Servicios Activos
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.telefoniaFija 
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      name="telefoniaFija"
                      checked={formData.telefoniaFija}
                      onChange={handleChange}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">Telefonía Fija</span>
                      <span className="text-[10px] text-slate-400">Línea local ilimitada</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.internetFijo 
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      name="internetFijo"
                      checked={formData.internetFijo}
                      onChange={handleChange}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">Internet de Fibra</span>
                      <span className="text-[10px] text-slate-400">Fibra óptica de alta velocidad</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    formData.television 
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                    <input
                      type="checkbox"
                      name="television"
                      checked={formData.television}
                      onChange={handleChange}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">Televisión Digital</span>
                      <span className="text-[10px] text-slate-400">Canales HD y deportes</span>
                    </div>
                  </label>
                </div>
              </div>

              {formData.internetFijo && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Velocidad de Internet contratada
                  </label>
                  <input
                    type="text"
                    name="velocidadInternet"
                    value={formData.velocidadInternet}
                    onChange={handleChange}
                    placeholder="Ej: 100 Mbps o 300 Mbps"
                    className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Valor Mensual (COP)
                </label>
                <input
                  type="number"
                  name="valorMensual"
                  value={formData.valorMensual}
                  onChange={handleChange}
                  placeholder="Ej: 95000"
                  className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* SECTION 4: COMMITMENT & CONDITIONS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></span>
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-200">
                Cláusulas de Permanencia y Condiciones
              </h2>
            </div>

            <div className="space-y-4">
              <label className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${
                formData.tienePermanencia 
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}>
                <input
                  type="checkbox"
                  name="tienePermanencia"
                  checked={formData.tienePermanencia}
                  onChange={handleChange}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-200">¿Tiene Cláusula de Permanencia Mínima?</span>
                  <span className="text-[10px] text-slate-400">Aplica sanción por retiro anticipado</span>
                </div>
              </label>

              {formData.tienePermanencia && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Vigencia (Meses)
                    </label>
                    <select
                      name="vigenciaMeses"
                      value={formData.vigenciaMeses}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      <option value="6">6 Meses</option>
                      <option value="12">12 Meses</option>
                      <option value="18">18 Meses</option>
                      <option value="24">24 Meses</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="renovacionAutomatica"
                        checked={formData.renovacionAutomatica}
                        onChange={handleChange}
                        className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">Renovación Automática</span>
                        <span className="text-[10px] text-slate-400">Renovar automáticamente al culminar el plazo</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-2xl text-base font-bold uppercase tracking-widest text-white transition-all shadow-lg ${
                loading
                  ? 'bg-indigo-500/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-indigo-500/25 transform hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registrando Contrato...</span>
                </div>
              ) : (
                'Guardar Registro en Firebase'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="text-center py-4 text-xs text-slate-500 border-t border-slate-900">
        © {new Date().getFullYear()} SONET Colombia S.A.S. | Todos los derechos reservados.
      </div>
    </div>
  );
}

export default App;

