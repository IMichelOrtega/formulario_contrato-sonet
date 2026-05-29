/**
 * Generador de PDF de Contratos — Asonet Colombia
 * Este archivo crea un PDF idéntico a contrato_internet.html pero con datos rellenados
 */

function generarPDFContrato(datosContrato) {
    // Verificar que html2pdf esté cargado
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf no cargado. Asegúrate de incluir el script en tu HTML.');
        return;
    }

    // Estructura HTML idéntica a contrato_internet.html pero con campos rellenados
    const htmlContenido = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato Único de Servicios Fijos — @Sonet Colombia SAS</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      background: #fff;
      padding: 0;
    }

    .page {
      font-size: 9px;
      color: #000;
      width: 100%;
      margin: 0;
      border: none;
      background: #fff;
      page-break-after: always;
      position: relative;
      padding: 20px;
    }

    .page-title {
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 8px;
      font-family: Arial, sans-serif;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    td {
      border: 1px solid #000;
      vertical-align: top;
      padding: 0;
    }

    .doc {
      width: 100%;
    }

    .col {
      width: 50%;
      vertical-align: top;
      border-right: 1px solid #000;
    }

    .col:last-child {
      border-right: none;
    }

    .st {
      background: #000;
      color: #fff;
      font-weight: 700;
      font-size: 8.5px;
      padding: 2px 6px;
      text-transform: uppercase;
    }

    .bd {
      padding: 5px 7px;
      font-size: 8.8px;
      line-height: 1.45;
      border-top: 1px solid #000;
    }

    .sec {
      border-bottom: 1px solid #000;
    }

    input[type="text"],
    input[type="number"],
    input[type="date"] {
      border: none;
      border-bottom: 1px solid #000;
      background: transparent;
      font-family: Arial, sans-serif;
      font-size: 9px;
      padding: 1px 2px;
      color: #000;
    }

    input[type="checkbox"] {
      vertical-align: middle;
      cursor: pointer;
    }

    ol {
      padding-left: 13px;
    }

    ol li {
      margin-bottom: 2px;
    }

    a {
      color: #000;
    }

    p {
      margin-bottom: 2px;
    }

    table.inner {
      border-collapse: collapse;
      width: 100%;
      font-size: 8.5px;
    }

    table.inner td {
      border: 1px solid #000;
      padding: 2px 4px;
      vertical-align: top;
    }

    .num-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      border: 1px solid #000;
      border-radius: 50%;
      font-weight: 700;
      font-size: 8px;
      flex-shrink: 0;
      margin-right: 4px;
    }

    .row-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 4px;
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
      }
      .page {
        margin: 0;
        border: none;
        page-break-after: always;
        width: 100%;
        padding: 20px;
      }
    }
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
                <div style="border:1px solid #000;padding:4px 6px;font-size:8.5px;font-weight:700;text-align:center;align-self:center;">
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
              Acepto que mi contrato se renueve sucesiva y automáticamente por un plazo igual al inicial. ${datosContrato.renovacionAuto ? '✓' : '☐'}
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
            <p style="margin-top:3px;">Servicios adicionales: ${datosContrato.serviciosAdicionales || 'Ninguno / Detalles'}</p>
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
            <p>Dirección Suscriptor ${datosContrato.direccionSuscriptor || 'Misma del servicio o alternativa'}</p>
          </div>
        </div>

        <div class="sec">
          <div class="st">CONDICIONES COMERCIALES<br>CARACTERÍSTICAS DEL PLAN</div>
          <div class="bd">
            <p>Los servicios que se presentarán en virtud del presente contrato puede ser uno o varios de los que se
              indican a continuación:</p>
            <p style="margin-top:3px;"><strong>INTERNET FIJO.</strong> "Redes interconectadas" Unión de todas las
              redes y computadoras distribuidas en el mundo, creando una red global conjunta de equipos que trabajan
              sobre protocolos TCP/IP compatibles entre sí. No obstante la descripción que se realiza, en virtud de
              presente contrato @SONET COLOMBIA SAS podrá prestar otra modalidad de servicios distintos a los
              indicados aquí. Los servicios objeto de presente contrato podrán prestarse empaquetados con otro(s) de
              telecomunicaciones ya sea que este(os) sea(n) prestados directamente por @SONET COLOMBIA SAS o
              comercializados por terceros. Los servicios de Internet fijo, que conforme con sus títulos habilitantes,
              son facturados por @SONET COLOMBIA SAS. El servicio de televisión es facturado por CENETWORK.</p>
            <p style="margin-top:3px;">@SONET COLOMBIA SAS debe mantener en buen estado el funcionamiento de servicio
              contratado por el CONTRATANTE, solucionar los cortes o interferencia que se presente en el servicio
              durante las siguientes 72 horas de reportada la falla.</p>
          </div>
        </div>

      </td>

      <td class="col" style="border-right:none;">

        <div class="sec">
          <div class="st">PRINCIPALES OBLIGACIONES DEL USUARIO</div>
          <div class="bd">
            <ol>
              <li>Pagar oportunamente los servicios prestados, incluyendo los intereses de mora cuando haya incumplimiento;</li>
              <li>Suministrar información verdadera</li>
              <li>Hacer uso adecuado de los equipos y los servicios</li>
              <li>No divulgar ni acceder a pornografía infantil (Consultar anexo)</li>
              <li>Avisar a las autoridades cualquier evento de robo o hurto de elementos de la red, como el cable;</li>
              <li>No cometer o ser partícipe de actividades de fraude.</li>
            </ol>
          </div>
        </div>

        <div class="sec">
          <div class="st">CALIDAD Y COMPENSACIÓN</div>
          <div class="bd">
            <p>Cuando se presente indisponibilidad del servicio o este se suspenda a pesar de su pago oportuno, lo
              compensaremos en su próxima factura. Debemos cumplir con las condiciones de calidad e definidas por CRC.
              Consúltelas en la página: <a href="#">www.operador.com/indicadoresdecalidad</a>.</p>
          </div>
        </div>

        <div class="sec">
          <div class="st">CESIÓN</div>
          <div class="bd">
            <p>Si quieres ceder este contrato a otra persona, debe presentar una solicitud por escrito a través de
              nuestros Medios de Atención, acompañada de la aceptación por escrito de la persona a la que se hará
              cesión. Dentro de los 15 días hábiles siguientes, analizaremos su solicitud y le daremos una respuesta.
              Si se acepta la cesión queda liberado de cualquier responsabilidad con nosotros.</p>
          </div>
        </div>

        <div class="sec">
          <div class="st">MODIFICACIÓN</div>
          <div class="bd">
            <p>Nosotros no podemos modificar el contrato sin su autorización. Esto incluye que no podemos cobrarle
              servicios que no haya aceptado expresamente. Si esto ocurre tiene derecho a terminar el contrato,
              incluso estando vigente la cláusula de permanencia mínima, sin la obligación de pagar suma alguna por
              este concepto. No obstante, usted puede en cualquier momento modificar los servicios contratados. Dicha
              modificación se hará efectiva en el período de facturación siguiente, para lo cual deberá presentar la
              solicitud de modificación por lo menos con 3 días hábiles de anterioridad al corte de facturación.</p>
          </div>
        </div>

        <div class="sec">
          <div class="st">SUSPENSIÓN</div>
          <div class="bd">
            <p>Usted tiene derecho a solicitar la suspensión del servicio por un máximo de 2 meses al año. Para esto
              debe presentar la solicitud antes del inicio del ciclo de facturación que desea suspender. Si existe una
              cláusula de permanencia mínima, su vigencia se prorrogará por el tiempo que dure la suspensión.</p>
          </div>
        </div>

        <div class="sec">
          <div class="st">TERMINACIÓN</div>
          <div class="bd">
            <p>Usted puede terminar el contrato en cualquier momento sin penalidades (siempre y cuando no cuente con
              cláusula de permanencia). Para esto debe realizar una solicitud a través de cualquiera de nuestros
              Medios de Atención mínimo 3 días hábiles antes del corte de facturación. (su corte de facturación es el
              día ${datosContrato.diaCorte || '___'} de cada mes). Si presenta la solicitud con una anticipación menor, la terminación del servicio se dará en el siguiente período de facturación.</p>
            <p style="margin-top:3px;">Así mismo, usted puede cancelar cualquiera de los servicios contratados, para
              lo que le informaremos las condiciones en las que serán prestados los servicios no cancelados y
              actualizaremos el contrato. Así mismo, si el operador no inicia la presentación del servicio en el plazo
              acordado, usted puede pedir la restitución de su dinero y la terminación de su contrato.</p>
          </div>
        </div>

        <div style="text-align:right;padding:4px 6px;font-size:8px;color:#555;">1 de 3</div>
      </td>
    </tr>
  </table>
</div>

<div class="page">
  <table class="doc">
    <tr>
      <td class="col">

        <div class="sec">
          <div class="st">PAGO Y FACTURACIÓN</div>
          <div class="bd">
            <p>La factura le debe llegar como mínimo 5 días hábiles antes de la fecha de pago. si no llega, puede
              solicitarla a través de nuestros Medios de Atención y debe pagarla oportunamente.</p>
            <p style="margin-top:3px;">Si no paga a tiempo, previo aviso, suspenderemos sus servicios hasta que pague
              sus saldos pendientes. Contamos con 3 días hábiles luego de su pago para reconectarle el servicio. Si no
              paga a tiempo, también podemos reportar su deuda a las centrales de riesgo. Para esto tenemos que
              avisarle por lo menos con 20 días calendario de anticipación. Si paga luego de este reporte tenemos la
              obligación durante del mes de seguimiento de informar su pago para que ya no aparezca reportado
              negativamente.</p>
            <p style="margin-top:3px;">Si tiene un reclamo sobre su factura, puede presentarlo antes de la fecha de
              pago y en ese caso no debe pagar las sumas reclamadas hasta que resolvamos su solicitud. Si ya pagó,
              tiene 6 meses para presentar la reclamación.</p>
            <div style="border:1px solid #000;padding:4px 6px;margin-top:6px;font-size:8.5px;">
              Con esta firma acepta recibir la factura solamente por medios electrónicos.
            </div>
          </div>
        </div>

        <div class="sec">
          <div class="st">CÓMO COMUNICARSE CON NOSOTROS<br>(MEDIOS DE ATENCIÓN)</div>
          <div class="bd">
            <div class="row-item">
              <span class="num-circle">1</span>
              <span>Nuestros medios de atención son: oficinas físicas: Carrera 7 n° 7-84 centro, Garzón, Huila, página web: www.asonet.com.co, redes sociales: Faceboock, instagram, whatsapp, Líneas telefónicas: 8330560 - 3118666946</span>
            </div>
            <div class="row-item">
              <span class="num-circle">2</span>
              <span>Presente cualquier queja, petición/reclamo o recursos a través de estos medios y le responderemos en máximo de 15 días hábiles.</span>
            </div>
            <div class="row-item">
              <span class="num-circle">3</span>
              <span>Si no respondemos es porque aceptamos su petición o reclamo. Esto se llama silencio administrativo positivo y aplica para internet y telefonía.</span>
            </div>
            <p style="font-weight:700;margin:3px 0;">Si no está de acuerdo con nuestra respuesta</p>
            <div class="row-item">
              <span class="num-circle">4</span>
              <span>Cuando su queja o petición sea por los servicios de telefonía y/o internet, y esté relacionada con actos de negativa del contrato, suspensión del servicio, terminación del contrato, corte y facturación; usted puede insistir en su solicitud ante nosotros, dentro de los 10 días hábiles siguientes a la respuesta, y pedir que si no llegamos a una solución satisfactoria para usted, envíe su reclamo directamente a la SIC (Superintendencia de Industria y Comercio) quien resolverá de definitiva su solicitud. Esto se llama recurso de reposición y en subsidio de apelación.<br><br>Cuando su queja o petición sea por el servicio de televisión puede enviar la misma a la Autoridad Nacional de Televisión, para que esta entidad resuelva su solicitud.</span>
            </div>
          </div>
        </div>

        <div class="sec">
          <div class="st">ACEPTO CLÁUSULA DE PERMANENCIA MÍNIMA ${datosContrato.permanenciaMinima ? '✓' : '☐'}</div>
          <div class="bd">
            <p>En consideración a que le estamos otorgando un descuento respecto del valor de cargo por conexión, o le
              diferimos el pago al mismo, se incluye la presente cláusula de permanencia mínima. En la factura
              encontrará el valor a pagar si decide terminar el contrato.</p>
            <table class="inner" style="margin-top:5px;">
              <tr>
                <td style="width:70%;">Valor del cargo por conexión</td>
                <td>$ ${datosContrato.valorConexion || '_________'}</td>
              </tr>
              <tr>
                <td>Suma que le fue descontada o diferida del valor total del cargo por conexión</td>
                <td>$ ${datosContrato.valorDescontado || '_________'}</td>
              </tr>
              <tr>
                <td>Fecha de inicio de la permanencia mínima</td>
                <td>${datosContrato.fechaInicioPermanencia || '____________'}</td>
              </tr>
              <tr>
                <td>Fecha de finalización de la permanencia mínima</td>
                <td>${datosContrato.fechaFinPermanencia || '____________'}</td>
              </tr>
            </table>
          </div>
        </div>

      </td>

      <td class="col" style="border-right:none;">

        <div class="sec">
          <div class="st">CAMBIO DE DOMICILIO</div>
          <div class="bd">
            <p>Usted puede cambiar de domicilio y continuar con el servicio siempre que sea técnicamente posible. Si
              desde el punto de vista técnico no es viable el traslado del servicio, usted puede ceder su contrato a
              un tercero o terminarlo pagando el valor de la cláusula de permanencia mínima si esta vigente.</p>
          </div>
        </div>

        <div class="sec">
          <div class="st">LARGA DISTANCIA (TELEFONÍA)</div>
          <div class="bd">
            <p>Nos comprometemos a usar el operador de larga distancia que usted nos indique para lo cual debe marcar
              el código de larga distancia del operador que elija.</p>
          </div>
        </div>

        <div class="sec">
          <div class="st">COBRO POR RECONEXIÓN DEL SERVICIO</div>
          <div class="bd">
            <p>En caso de suspensión del servicio por mora in el pago, podremos cobrarle un valor por reconexión, que
              corresponderá estrictamente a los costos asociados a la operación de reconexión. En caso de servicios
              empaquetados procede máximo un cobro de reconexión por cada tipo de conexión empleado en la prestación
              de los servicios.</p>
            <p style="margin-top:3px;">Costo reconexión: $${datosContrato.costoReconexion || '15.000'}</p>
          </div>
        </div>

        <div class="sec">
          <div class="st" style="text-align:center;">INFORMACIÓN ADICIONAL</div>
          <div class="bd">
            <p>Tipo de Vivienda: &nbsp;${datosContrato.tipoVivienda?.propia ? '✓' : '☐'} Propia &nbsp;${datosContrato.tipoVivienda?.arriendo ? '✓' : '☐'} Arriendo &nbsp;${datosContrato.tipoVivienda?.familiar ? '✓' : '☐'} Familiar</p>
            <p style="margin-top:3px;">Nombre propietario: ${datosContrato.nombrePropietario || '_______________'}</p>
            <p>Celular: ${datosContrato.celularPropietario || '_______________'}</p>
            <p style="margin-top:3px;">Persona: &nbsp;${datosContrato.personaJuridica ? '✓' : '☐'} Jurídica &nbsp;${datosContrato.personaNatural ? '✓' : '☐'} Natural</p>
            <p style="margin-top:3px;">Representante Legal: ${datosContrato.representanteLegal || 'Si aplica'}</p>
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
            <p style="margin-top:4px;font-size:8px;">Consulte el régimen de protección de usuarios en www.crcom.gov.co</p>
          </div>
        </div>

        <div style="text-align:right;padding:4px 6px;font-size:8px;color:#555;">2 de 3</div>
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
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opciones).from(elemento).save();
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generarPDFContrato };
}