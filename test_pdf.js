const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('pageerror: ' + err.message));

  await page.addInitScript(() => {
    sessionStorage.setItem('user', JSON.stringify({ name: 'Test', uid: 'test123' }));
  });

  await page.goto('http://localhost:8123/contrato_internet.html');
  await page.waitForTimeout(1000);

  // Fill fields
  const fields = {
    numero_contrato: '12200212',
    valor_mensual: '63000',
    vigencia_meses: '12',
    fecha_inicio: '2026-06-10',
    servicios_adicionales: '100 MB',
    fecha_activacion: '2026-06-28',
    suscriptor_contrato: '12200212',
    suscriptor_nombre: 'YOHANY ANDRES MEDINA ARTUNDUAGA',
    suscriptor_identificacion: '1212200212',
    suscriptor_correo: 'yohanyandresmedinaartunduaga@outlook.com',
    suscriptor_telefono: '3115441872',
    suscriptor_direccion_servicio: 'CL 6 S 15 41',
    suscriptor_estrato: '3',
    suscriptor_municipio: 'GARZON',
    suscriptor_direccion_suscriptor: 'LOS SAMANES',
  };
  for (const [id, val] of Object.entries(fields)) {
    const exists = await page.$('#' + id);
    if (exists) await page.fill('#' + id, val);
  }

  await page.waitForTimeout(300);

  console.log('Console/page errors before:', JSON.stringify(errors, null, 2));

  const numPages = await page.evaluate(() => document.querySelectorAll('.page-wrapper').length);
  console.log('Number of page-wrapper:', numPages);

  for (let idx = 0; idx < numPages; idx++) {
    const dataUrl = await page.evaluate(async (i) => {
      const wrappers = Array.from(document.querySelectorAll('.page-wrapper'));
      const scroll = document.querySelector('.contract-scroll');
      if (scroll) { scroll.style.overflow = 'visible'; scroll.style.alignItems = 'flex-start'; }
      wrappers.forEach(w => {
        w.style.transform = 'none';
        w.style.overflow = 'visible';
        w.style.height = 'auto';
        w.style.width = '794px';
        w.style.marginLeft = '0';
        w.style.marginRight = '0';
        if (w.firstElementChild) {
          w.firstElementChild.style.transform = 'none';
          w.firstElementChild.style.transformOrigin = '';
        }
      });
      await new Promise(r => setTimeout(r, 250));
      const pageEl = wrappers[i].firstElementChild;
      const cambios = reemplazarCamposPorTexto(pageEl);
      await new Promise(r => setTimeout(r, 30));
      const canvas = await html2canvas(pageEl, {
        scale: 1.5, useCORS: true, allowTaint: true, logging: false, backgroundColor: '#ffffff', windowWidth: 1200,
      });
      restaurarCampos(cambios);
      return canvas.toDataURL('image/png');
    }, idx);

    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    require('fs').writeFileSync(`C:\\Users\\aleja\\Documents\\SONET\\contrato_page_${idx + 1}.png`, Buffer.from(base64, 'base64'));
  }

  console.log('Console/page errors after:', JSON.stringify(errors, null, 2));

  await browser.close();
})();
