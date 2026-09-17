async (page) => {
  const base = '/home/jaypy/GitHub-Projects/Notes/ai-synthesizer/workspace/juansilva.design/projects/juansilva-design/motion/allprice-showcase/assets/live';
  const browser = page.context().browser();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light',
  });
  const source = await context.newPage();
  const errors = [];
  source.on('pageerror', (error) => errors.push(error.message));
  await source.goto('https://allprice-lp.juanpablosilva.com.br/', { waitUntil: 'networkidle' });
  await source.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) await image.decode().catch(() => {});
  });
  for (let y = 0; y < 11400; y += 400) {
    await source.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await source.waitForTimeout(100);
  }
  await source.waitForTimeout(400);
  const geometry = await source.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    width: document.documentElement.scrollWidth,
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
    images: [...document.images].map((image) => ({
      alt: image.alt, decoded: image.complete && image.naturalWidth > 0,
      width: image.naturalWidth, height: image.naturalHeight,
      url: image.currentSrc.startsWith('http') ? image.currentSrc : 'inline-svg',
    })),
    sections: [...document.querySelectorAll('section, header')]
      .filter((element) => element.offsetHeight > 0)
      .map((element) => ({
        id: element.id, tag: element.tagName,
        y: element.getBoundingClientRect().top + scrollY,
        height: element.getBoundingClientRect().height,
        heading: element.querySelector('h1,h2,h3')?.textContent || '',
      })),
  }));
  if (geometry.height !== 11279) throw new Error(`Expected measured desktop height 11279; got ${geometry.height}`);
  if (geometry.images.some((image) => !image.decoded)) throw new Error('An image did not decode.');
  await source.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const strips = [];
  for (let top = 0, index = 0; top < geometry.height; top += 1480, index++) {
    const height = Math.min(1600, geometry.height - top);
    const filename = `desktop-strip-${String(index).padStart(2, '0')}.png`;
    await source.screenshot({ path: `${base}/${filename}`, fullPage: true, clip: { x: 0, y: top, width: 1440, height }, animations: 'disabled' });
    strips.push({ path: `assets/live/${filename}`, top, height, width: 1440, scale: 2 });
  }
  await source.screenshot({ path: `${base}/desktop-hero.png`, animations: 'disabled' });
  const states = [];
  for (const [name, target, question] of [
    ['pricing', 7010, null],
    ['faq-closed', 9330, null],
    ['faq-erp-open', 9330, '2. Preciso ter um ERP para usar?'],
    ['faq-pricing-open', 9500, '4. Como o sistema calcula o preço de venda?'],
  ]) {
    await source.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), target);
    if (question) await source.getByRole('button', { name: question, exact: true }).click();
    await source.waitForTimeout(450);
    await source.screenshot({ path: `${base}/desktop-${name}.png`, animations: 'disabled' });
    const state = await source.evaluate(() => ({
      scrollY, height: document.documentElement.scrollHeight,
      expanded: [...document.querySelectorAll('[aria-expanded="true"]')].map((element) => ({
        label: element.textContent,
        box: { x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height },
      })),
    }));
    states.push({ path: `assets/live/desktop-${name}.png`, ...state });
  }
  await context.close();
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    colorScheme: 'light', isMobile: true, hasTouch: true,
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto('https://allprice-lp.juanpablosilva.com.br/', { waitUntil: 'networkidle' });
  await mobile.evaluate(async () => { await document.fonts.ready; for (const image of document.images) await image.decode().catch(() => {}); });
  const mobileGeometry = await mobile.evaluate(() => ({
    height: document.documentElement.scrollHeight, width: document.documentElement.scrollWidth,
    sections: [...document.querySelectorAll('section[id]')].map((element) => ({ id: element.id, y: element.getBoundingClientRect().top + scrollY, height: element.getBoundingClientRect().height })),
    brokenImages: [...document.images].filter((image) => !image.complete || !image.naturalWidth).length,
  }));
  if (mobileGeometry.brokenImages) throw new Error('Mobile image decode failed.');
  await mobile.screenshot({ path: `${base}/mobile-hero.png`, animations: 'disabled' });
  for (const id of ['comofunciona', 'features', 'pricing', 'faq']) {
    const target = mobileGeometry.sections.find((section) => section.id === id).y;
    const from = await mobile.evaluate(() => scrollY);
    for (let y = from; y < target; y += 400) {
      await mobile.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
      await mobile.waitForTimeout(50);
    }
    await mobile.evaluate((top) => scrollTo({ top, behavior: 'instant' }), target);
    await mobile.waitForTimeout(350);
    await mobile.screenshot({ path: `${base}/mobile-${id}.png`, animations: 'disabled' });
  }
  await mobile.getByRole('button', { name: '2. Preciso ter um ERP para usar?', exact: true }).click();
  await mobile.waitForTimeout(450);
  await mobile.screenshot({ path: `${base}/mobile-faq-open.png`, animations: 'disabled' });
  await mobileContext.close();
  return { sourceUrl: 'https://allprice-lp.juanpablosilva.com.br/', geometry, strips, states, mobileGeometry, errors };
}
