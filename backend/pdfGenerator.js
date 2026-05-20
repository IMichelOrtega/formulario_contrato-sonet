// ============================================
// PDF GENERATOR: Reportlab para Node.js
// ============================================

const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

async function generatePDF(contrato) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 20,
        size: 'A4',
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', reject);

      // ===== ENCABEZADO =====
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .text('@sonet', 50, 40);

      doc.fontSize(14)
        .font('Helvetica')
        .text('Colombia sas', 50, 67);

      doc.fontSize(10)
        .font('Helvetica')
        .text('NIT: 900.669.038-6', 50, 85)
        .text('Cra 7 # 7-84', 50, 100)
        .text('barrio el centro Garzón - Huila', 50, 115);

      // Título en la derecha
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .text('CONTRATO ÚNICO', 400, 40, { width: 120, align: 'center' })
        .text('DE SERVICIOS FIJOS', 400, 65, { width: 120, align: 'center' });

      // Línea separadora
      doc.moveTo(50, 140)
        .lineTo(550, 140)
        .stroke();

      let y = 160;

      // ===== INFORMACIÓN GENERAL =====
      doc.fontSize(11)
        .font('Helvetica-Bold')
        .text('INFORMACIÓN GENERAL', 50, y);

      y += 25;
      doc.fontSize(10)
        .font('Helvetica');

      const campos = [
        ['Número Contrato:', contrato.numeroContrato || ''],
        ['Nombre/Razón Social:', contrato.nombreRazonSocial],
        ['Identificación:', contrato.identificacion],
        ['Correo Electrónico:', contrato.correoElectronico],
        ['Teléfono de Contacto:', contrato.telefonoContacto || ''],
      ];

      campos.forEach(([label, valor]) => {
        doc.font('Helvetica-Bold').text(label, 50, y, { width: 150 });
        doc.font('Helvetica').text(valor, 200, y, { width: 350 });
        y += 18;
      });

      y += 10;

      // ===== DIRECCIÓN DEL SERVICIO =====
      doc.font('Helvetica-Bold')
        .fontSize(11)
        .text('DIRECCIÓN DEL SERVICIO', 50, y);

      y += 20;
      doc.font('Helvetica')
        .fontSize(10);

      const direccionCampos = [
        ['Dirección:', contrato.direccionServicio],
        ['Estrato:', contrato.estrato || ''],
        ['Municipio:', contrato.municipio || ''],
      ];

      direccionCampos.forEach(([label, valor]) => {
        doc.font('Helvetica-Bold').text(label, 50, y, { width: 150 });
        doc.font('Helvetica').text(valor, 200, y, { width: 350 });
        y += 18;
      });

      y += 10;

      // ===== SERVICIOS CONTRATADOS =====
      doc.font('Helvetica-Bold')
        .fontSize(11)
        .text('SERVICIOS CONTRATADOS', 50, y);

      y += 20;
      doc.font('Helvetica')
        .fontSize(10);

      if (contrato.telefoniaFija) {
        doc.text('✓ Telefonía Fija', 50, y);
        y += 15;
      }

      if (contrato.internetFijo) {
        doc.text(`✓ Internet Fijo ${contrato.velocidadInternet ? `(${contrato.velocidadInternet})` : ''}`, 50, y);
        y += 15;
      }

      if (contrato.television) {
        doc.text('✓ Televisión', 50, y);
        y += 15;
      }

      y += 5;
      doc.font('Helvetica-Bold')
        .text(`Valor Mensual: $${contrato.valorMensual.toLocaleString('es-CO')}`, 50, y);

      y += 20;

      // ===== CLÁUSULA DE PERMANENCIA =====
      if (contrato.tienePermanencia) {
        doc.font('Helvetica-Bold')
          .fontSize(11)
          .text('CLÁUSULA DE PERMANENCIA MÍNIMA', 50, y);

        y += 20;
        doc.font('Helvetica')
          .fontSize(10);

        doc.text(
          `Acepto cláusula de permanencia mínima de ${contrato.vigenciaMeses} meses`,
          50,
          y
        );
        y += 15;
        doc.text(
          `Renovación automática: ${contrato.renovacionAutomatica ? 'Sí' : 'No'}`,
          50,
          y
        );

        y += 20;
      }

      // ===== INFORMACIÓN ADICIONAL =====
      y += 10;
      doc.font('Helvetica-Bold')
        .fontSize(11)
        .text('INFORMACIÓN ADICIONAL', 50, y);

      y += 20;
      doc.font('Helvetica')
        .fontSize(10);

      if (contrato.tipoVivienda) {
        doc.font('Helvetica-Bold').text('Tipo de Vivienda:', 50, y);
        doc.font('Helvetica').text(contrato.tipoVivienda, 200, y);
        y += 15;
      }

      if (contrato.nombrePropietario) {
        doc.font('Helvetica-Bold').text('Nombre Propietario:', 50, y);
        doc.font('Helvetica').text(contrato.nombrePropietario, 200, y);
        y += 15;
      }

      if (contrato.tipoPersona) {
        doc.font('Helvetica-Bold').text('Tipo de Persona:', 50, y);
        doc.font('Helvetica').text(contrato.tipoPersona === 'natural' ? 'Natural' : 'Jurídica', 200, y);
        y += 15;
      }

      // ===== PIE DE PÁGINA =====
      const pageHeight = doc.page.height;
      doc.fontSize(8)
        .font('Helvetica')
        .text(
          `Fecha: ${new Date().toLocaleDateString('es-CO')}`,
          50,
          pageHeight - 60
        );

      doc.moveTo(50, pageHeight - 80)
        .lineTo(550, pageHeight - 80)
        .stroke();

      doc.fontSize(10)
        .font('Helvetica-Bold')
        .text('Firma Suscriptor:', 50, pageHeight - 70, { width: 200 })
        .text('Firma Asesor:', 350, pageHeight - 70, { width: 200 });

      // Finalizar documento
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generatePDF };
