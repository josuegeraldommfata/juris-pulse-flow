const { chromium } = require('playwright');

/**
 * Identifica o tribunal pelo numero CNJ
 */
function identifyCourt(processNumber) {
  const clean = processNumber.replace(/[^\d]/g, '');
  if (clean.length !== 20) return { type: 'unknown' };

  const j = clean.substring(13, 14);
  const tr = clean.substring(14, 16);

  if (j === '5') return { type: 'TRT', region: tr };
  if (j === '8' && tr === '26') return { type: 'TJSP', region: '26' };
  if (j === '8' && tr === '19') return { type: 'TJRJ', region: '19' };

  return { type: 'UNKNOWN', j, tr };
}

/**
 * Delay helper
 */
const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Função principal
 */
async function scrapeProcess(rawInput) {
  const cnjRegex = /\d{7}-?\d{2}\.?\d{4}\.?\d\.?\d{2}\.?\d{4}/;
  const match = rawInput.match(cnjRegex);

  if (!match) {
    return { success: false, error: 'Número CNJ inválido' };
  }

  const processNumber = match[0].replace(/[^\d.-]/g, '');
  console.log(`🔍 Processo: ${processNumber}`);

  const court = identifyCourt(processNumber);
  console.log(`🏛 Tribunal: ${court.type}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  try {
    if (court.type === 'TJSP') {
      return await retry(() => scrapeTJSP(page, processNumber));
    }

    if (court.type === 'TRT') {
      return await retry(() => scrapeTRT(page, processNumber, court.region));
    }

    return { success: false, error: `Tribunal não suportado: ${court.type}` };

  } catch (err) {
    return { success: false, error: err.message };
  } finally {
    await browser.close();
  }
}

/**
 * Retry automático
 */
async function retry(fn, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === attempts - 1) throw e;
      await delay(2000);
    }
  }
}

/**
 * SCRAPER TJSP (MELHORADO)
 */
async function scrapeTJSP(page, processNumber) {
  await page.goto('https://esaj.tjsp.jus.br/cpopg/open.do', { timeout: 30000 });

  await page.fill('#numeroDigitado', processNumber);
  await page.click('#botaoConsultarProcesso');

  await page.waitForLoadState('networkidle');

  const existsError = await page.$('.mensagemRetorno');
  if (existsError) {
    const msg = await existsError.innerText();
    throw new Error(msg.trim());
  }

  await page.waitForSelector('.unj-entity-header__summary', { timeout: 15000 });

  const data = await page.evaluate(() => {
    const getText = (sel) => document.querySelector(sel)?.innerText?.trim() || null;

    const movimentacoes = Array.from(document.querySelectorAll('.movimentacaoProcesso'))
      .slice(0, 5)
      .map(el => ({
        data: el.querySelector('.dataMovimentacao')?.innerText?.trim(),
        descricao: el.querySelector('.descricaoMovimentacao')?.innerText?.trim()
      }));

    const partes = Array.from(document.querySelectorAll('#tableTodasPartes tr, #tablePartesPrincipal tr'))
      .map(tr => {
        const papel = tr.querySelector('.labelPartes')?.innerText?.trim();
        const nome = tr.querySelector('.nomeParteEAdvogado')?.innerText?.split('\n')[0]?.trim();
        return papel && nome ? `${papel}: ${nome}` : null;
      }).filter(Boolean);

    return {
      tribunal: 'TJSP',
      numero: getText('#numeroProcesso'),
      classe: getText('#classeProcesso'),
      assunto: getText('#assuntoProcesso'),
      foro: getText('#foroProcesso'),
      vara: getText('#varaProcesso'),
      juiz: getText('#juizProcesso'),
      partes,
      status: 'Ativo',
      movimentacoes
    };
  });

  return { success: true, data };
}

/**
 * SCRAPER TRT (ANTI-BLOQUEIO)
 */
async function scrapeTRT(page, processNumber, region) {
  const url = `https://pje.trt${region}.jus.br/consultaprocessual/detalhe-processo/${processNumber}`;

  await page.goto(url, { timeout: 30000 });

  // TRT costuma ter captcha → apenas valida acesso
  const content = await page.content();

  if (content.includes('captcha') || content.includes('robô')) {
    throw new Error('Bloqueado por CAPTCHA no TRT');
  }

  return {
    success: true,
    data: {
      tribunal: `TRT-${region}`,
      numero: processNumber,
      status: 'Consulta acessada (PJE)',
      aviso: 'TRT pode exigir bypass de captcha'
    }
  };
}

module.exports = { scrapeProcess };