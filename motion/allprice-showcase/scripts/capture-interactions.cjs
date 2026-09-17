async (page) => {
  const root = '/home/jaypy/GitHub-Projects/Notes/ai-synthesizer/workspace/juansilva.design/projects/juansilva-design/motion/allprice-showcase/assets/live';
  const browser = page.context().browser();
  const states = [];
  for (const device of ['desktop', 'mobile']) {
    const context = await browser.newContext({
      viewport: device === 'desktop' ? { width: 1440, height: 900 } : { width: 390, height: 844 },
      deviceScaleFactor: 2, colorScheme: 'light',
      isMobile: device === 'mobile', hasTouch: device === 'mobile',
    });
    const source = await context.newPage();
    try {
      await source.goto('https://allprice-lp.juanpablosilva.com.br/', { waitUntil: 'domcontentloaded', timeout: 25000 });
      await source.evaluate(async () => {
        await Promise.race([
          Promise.all([document.fonts.ready, ...[...document.images].map(image => image.decode().catch(() => {}))]),
          new Promise(resolve => setTimeout(resolve, 8000)),
        ]);
      });
      const ready = await source.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).length,
      }));
      const expectedHeight = device === 'desktop' ? 11279 : 15607;
      if (ready.height !== expectedHeight || ready.broken) throw new Error(`Source not ready: ${JSON.stringify(ready)}`);
      async function scrollToSection(id, offset) {
        const target = await source.locator(`#${id}`).evaluate((element, offset) => element.getBoundingClientRect().top + scrollY + offset, offset);
        const start = await source.evaluate(() => scrollY);
        for (let y = start; y < target; y += 400) {
          await source.evaluate(top => scrollTo({ top, behavior: 'instant' }), y);
          await source.waitForTimeout(60);
        }
        await source.evaluate(top => scrollTo({ top, behavior: 'instant' }), target);
      }
      async function capture(name) {
        await source.waitForTimeout(400);
        const filename = `${device}-${name}.png`;
        await source.screenshot({ path: `${root}/${filename}`, animations: 'disabled' });
        states.push({ path: `assets/live/${filename}`, device, ...await source.evaluate(() => ({
          scrollY, height: document.documentElement.scrollHeight,
          expanded: [...document.querySelectorAll('[aria-expanded="true"]')].map(e => e.textContent),
          featuresScrollLeft: document.querySelector('#features .overflow-x-auto')?.scrollLeft,
          featureHeadings: [...document.querySelectorAll('#features h3')].map(e => e.textContent),
        })) });
      }
      if (device === 'mobile') {
        // This source button has no accessible name; verify it is the SVG-only
        // menu control, never the external account-registration link.
        const menu = source.locator('header button').filter({ has: source.locator('svg') }).last();
        if (await menu.locator('a').count()) throw new Error('Menu selector resolved to an external CTA.');
        await menu.click();
        await capture('menu-open');
        states[states.length - 1].navigation = await source.locator('header a').evaluateAll(elements => elements.map(e => ({ text: e.textContent, href: e.getAttribute('href') })));
        // Close via the visible X in the captured modal. The underlying burger
        // is intentionally blocked by the backdrop while the modal is open.
        await source.mouse.click(356, 114);
        await source.locator('.fixed.inset-0.z-40').waitFor({ state: 'hidden', timeout: 3000 });
      }
      await scrollToSection('features', device === 'desktop' ? 0 : 300);
      await capture('features-left');
      const scroller = source.locator('#features .overflow-x-auto');
      await scroller.evaluate(e => { e.scrollLeft = e.scrollWidth - e.clientWidth; });
      await capture('features-right');
      if (device === 'desktop') {
        await scrollToSection('faq', -90);
        await capture('faq-framed-closed');
        await source.getByRole('button', { name: '2. Preciso ter um ERP para usar?', exact: true }).click();
        await capture('faq-framed-open');
      }
    } finally {
      await context.close();
    }
  }
  return { sourceUrl: 'https://allprice-lp.juanpablosilva.com.br/', states };
}
