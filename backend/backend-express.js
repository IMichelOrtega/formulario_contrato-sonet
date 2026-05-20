// ============================================
// BACKEND: Express + MongoDB para Contratos
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { generatePDF } = require('./utils/pdfGenerator');
const path = require('path');

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ===== CONEXIÓN MONGODB =====
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sonet_contratos')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ===== MODELOS =====

// Schema Contrato
const ContratoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaCreacion: { type: Date, default: Date.now },
  numeroContrato: String,
  valorMensual: { type: Number, required: true },
  vigenciaMeses: { type: Number, required: true },
  fechaInicio: Date,
  renovacionAutomatica: { type: Boolean, default: false },

  // Servicios
  telefoniaFija: { type: Boolean, default: false },
  internetFijo: { type: Boolean, default: false },
  television: { type: Boolean, default: false },
  serviciosAdicionales: String,
  velocidadInternet: String,
  fechaActivacion: Date,

  // Datos del suscriptor
  nombreRazonSocial: { type: String, required: true },
  identificacion: { type: String, required: true },
  correoElectronico: { type: String, required: true },
  telefonoContacto: String,
  direccionServicio: { type: String, required: true },
  estrato: String,
  departamento: String,
  municipio: String,
  direccionSuscriptor: String,

  // Información adicional
  tipoVivienda: { type: String, enum: ['propia', 'arriendo', 'familiar'] },
  nombrePropietario: String,
  celularPropietario: String,

  // Referencias
  ref1Nombre: String,
  ref1Celular: String,
  ref2Nombre: String,
  ref2Celular: String,
  refFamNombre: String,
  refFamCelular: String,

  // Tipo persona
  tipoPersona: { type: String, enum: ['natural', 'juridica'], default: 'natural' },
  representanteLegal: String,

  // Asesor
  asesor: String,

  // Permanencia
  tienePermanencia: { type: Boolean, default: false },
  valorCargoConexion: Number,
  valorDescuentoConexion: Number,
  fechaInicioPermanencia: Date,
  fechaFinPermanencia: Date,

  // PDF
  pdfUrl: String,
  pdfGenerado: { type: Boolean, default: false },
}, { timestamps: true });

// Schema Usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['asesor', 'admin'], default: 'asesor' },
  fechaRegistro: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
});

const Contrato = mongoose.model('Contrato', ContratoSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// ===== FUNCIONES AUXILIARES =====

// JWT
const SECRET_KEY = process.env.SECRET_KEY || 'tu-clave-secreta-super-segura';

const generarToken = (id) => jwt.sign({ id }, SECRET_KEY, { expiresIn: '7d' });

const verificarToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

// Middleware autenticación
const autenticar = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  const decoded = verificarToken(token);
  if (!decoded) return res.status(401).json({ error: 'Token inválido' });

  req.userId = decoded.id;
  next();
};

// ===== RUTAS AUTENTICACIÓN =====

// Registro
app.post('/api/auth/registro', async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = new Usuario({
      nombre,
      apellido,
      email,
      password: passwordHash,
    });

    await usuario.save();

    const token = generarToken(usuario._id);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario._id);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== RUTAS CONTRATOS =====

// Crear contrato
app.post('/api/contratos', autenticar, async (req, res) => {
  try {
    const datosContrato = {
      ...req.body,
      usuario: req.userId,
    };

    // Generar número de contrato si no existe
    if (!datosContrato.numeroContrato) {
      const contador = await Contrato.countDocuments({ usuario: req.userId });
      datosContrato.numeroContrato = `CT-${req.userId.toString().slice(-4)}-${contador + 1}`;
    }

    const contrato = new Contrato(datosContrato);
    await contrato.save();

    // Generar PDF en background
    try {
      const pdfBuffer = await generatePDF(contrato);
      // Aquí puedes guardar en cloud storage (AWS S3, Google Drive, etc)
      contrato.pdfGenerado = true;
      await contrato.save();
    } catch (err) {
      console.error('Error generando PDF:', err);
    }

    res.status(201).json({
      mensaje: 'Contrato creado exitosamente',
      contrato,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener contratos del usuario
app.get('/api/contratos', autenticar, async (req, res) => {
  try {
    const contratos = await Contrato.find({ usuario: req.userId })
      .sort({ fechaCreacion: -1 });

    const total = contratos.length;
    const conPdf = contratos.filter(c => c.pdfGenerado).length;
    const esteMes = contratos.filter(c => {
      const hoy = new Date();
      return c.fechaCreacion.getMonth() === hoy.getMonth() &&
             c.fechaCreacion.getFullYear() === hoy.getFullYear();
    }).length;

    res.json({
      contratos,
      estadisticas: { total, conPdf, esteMes },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener detalle de contrato
app.get('/api/contratos/:id', autenticar, async (req, res) => {
  try {
    const contrato = await Contrato.findOne({ _id: req.params.id, usuario: req.userId });
    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json(contrato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar contrato
app.put('/api/contratos/:id', autenticar, async (req, res) => {
  try {
    const contrato = await Contrato.findOneAndUpdate(
      { _id: req.params.id, usuario: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    // Regenerar PDF
    try {
      const pdfBuffer = await generatePDF(contrato);
      contrato.pdfGenerado = true;
      await contrato.save();
    } catch (err) {
      console.error('Error regenerando PDF:', err);
    }

    res.json({
      mensaje: 'Contrato actualizado exitosamente',
      contrato,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar contrato
app.delete('/api/contratos/:id', autenticar, async (req, res) => {
  try {
    const contrato = await Contrato.findOneAndDelete({
      _id: req.params.id,
      usuario: req.userId,
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    res.json({ mensaje: 'Contrato eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Descargar PDF
app.get('/api/contratos/:id/pdf', autenticar, async (req, res) => {
  try {
    const contrato = await Contrato.findOne({
      _id: req.params.id,
      usuario: req.userId,
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    const pdfBuffer = await generatePDF(contrato);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="contrato_${contrato._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== RUTAS ADMIN =====

// Obtener todos los usuarios (solo admin)
app.get('/api/admin/usuarios', autenticar, async (req, res) => {
  try {
    const usuarioActual = await Usuario.findById(req.userId);
    if (usuarioActual.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos de administrador' });
    }

    const usuarios = await Usuario.find({}, '-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ status: '✅ Backend de contratos activo' });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📚 API documentation:`);
  console.log(`  POST   /api/auth/registro`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  POST   /api/contratos`);
  console.log(`  GET    /api/contratos`);
  console.log(`  GET    /api/contratos/:id`);
  console.log(`  PUT    /api/contratos/:id`);
  console.log(`  DELETE /api/contratos/:id`);
  console.log(`  GET    /api/contratos/:id/pdf`);
});

module.exports = app;
