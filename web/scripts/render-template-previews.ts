/**
 * Makes the static preview images for the template library.
 *
 *   npm run templates:previews              # every template
 *   npm run templates:previews -- my-slug   # just these
 *
 * For each template in src/content/templates/ it renders the email with the same renderer the product
 * uses, screenshots it in a headless browser (your installed Edge or Chrome; set CHROME_PATH to override),
 * and writes into public/template-previews/:
 *   <slug>-thumb.webp   grid thumbnail (top of the email, 3:4)
 *   <slug>-full.webp    the whole email, shown on the template page
 * plus their pixel sizes into src/lib/content/template-preview-sizes.json, so pages can reserve the exact
 * space (no layout shift). Commit the results; they are only regenerated when a template changes.
 * Drafts are included here, so you can preview work in progress.
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { getAllTemplatesMeta, loadTemplate } from '../src/lib/content/templates-registry';
import { renderTemplateHtml } from '../src/lib/content/template-render';
import type { PreviewSize } from '../src/lib/content/templates';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public/template-previews');
const SIZES_FILE = path.join(ROOT, 'src/lib/content/template-preview-sizes.json');

const VIEWPORT_WIDTH = 640; // a 600px email plus a little page margin
const CAPTURE_SCALE = 2; // capture sharp, then downscale
const FULL_WIDTH = 600;
const THUMB_WIDTH = 360;
const THUMB_MAX_HEIGHT = 480;

function findBrowser(): string {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  const found = candidates.find((p) => p && fs.existsSync(p));
  if (!found) throw new Error('No Chrome or Edge found. Set CHROME_PATH to a browser executable.');
  return found;
}

async function main() {
  const onlySlugs = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const all = await getAllTemplatesMeta();
  const slugs = all.map((t) => t.slug).filter((s) => onlySlugs.length === 0 || onlySlugs.includes(s));
  if (slugs.length === 0) {
    console.log('No templates to render.');
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const sizes: Record<string, PreviewSize> = fs.existsSync(SIZES_FILE) ? JSON.parse(fs.readFileSync(SIZES_FILE, 'utf8')) : {};

  const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: true });
  try {
    for (const slug of slugs) {
      const template = await loadTemplate(slug);
      if (!template) continue;
      const html = await renderTemplateHtml(template.meta, template.email);

      const page = await browser.newPage();
      await page.setViewport({ width: VIEWPORT_WIDTH, height: 900, deviceScaleFactor: CAPTURE_SCALE });
      await page.setContent(html, { waitUntil: 'load', timeout: 60_000 });
      await page.waitForNetworkIdle({ idleTime: 800, timeout: 30_000 }).catch(() => {}); // photos and web fonts
      await page.evaluate(() => document.fonts.ready);
      const png = Buffer.from(await page.screenshot({ fullPage: true, type: 'png' }));
      await page.close();

      const fullBuf = await sharp(png).resize({ width: FULL_WIDTH }).webp({ quality: 72 }).toBuffer();
      const fullMeta = await sharp(fullBuf).metadata();

      const scaled = await sharp(png).resize({ width: THUMB_WIDTH }).toBuffer();
      const scaledMeta = await sharp(scaled).metadata();
      const thumbBuf = await sharp(scaled)
        .extract({ left: 0, top: 0, width: THUMB_WIDTH, height: Math.min(scaledMeta.height ?? THUMB_MAX_HEIGHT, THUMB_MAX_HEIGHT) })
        .webp({ quality: 74 })
        .toBuffer();
      const thumbMeta = await sharp(thumbBuf).metadata();

      fs.writeFileSync(path.join(OUT_DIR, `${slug}-full.webp`), fullBuf);
      fs.writeFileSync(path.join(OUT_DIR, `${slug}-thumb.webp`), thumbBuf);
      sizes[slug] = {
        fullW: fullMeta.width ?? FULL_WIDTH,
        fullH: fullMeta.height ?? 0,
        thumbW: thumbMeta.width ?? THUMB_WIDTH,
        thumbH: thumbMeta.height ?? THUMB_MAX_HEIGHT,
      };
      console.log(
        `${slug}: full ${sizes[slug].fullW}x${sizes[slug].fullH} (${Math.round(fullBuf.length / 1024)} KB), ` +
          `thumb ${sizes[slug].thumbW}x${sizes[slug].thumbH} (${Math.round(thumbBuf.length / 1024)} KB)`,
      );
    }
  } finally {
    await browser.close();
  }

  // Drop entries (and images) of templates that no longer exist.
  const existing = new Set(all.map((t) => t.slug));
  for (const slug of Object.keys(sizes)) {
    if (existing.has(slug)) continue;
    delete sizes[slug];
    for (const kind of ['thumb', 'full']) fs.rmSync(path.join(OUT_DIR, `${slug}-${kind}.webp`), { force: true });
  }
  fs.writeFileSync(SIZES_FILE, JSON.stringify(sizes, null, 2) + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
