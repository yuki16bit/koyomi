import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const viteDir = join(root, 'dist');
const gasDir = join(root, 'dist-gas');

let html = await readFile(join(viteDir, 'index.html'), 'utf8');
const scriptTag = html.match(/<script type="module" crossorigin src="\/([^"?]+)"><\/script>/);
const styleTag = html.match(/<link rel="stylesheet" crossorigin href="\/([^"?]+)">/);

assert(scriptTag, 'Vite script asset not found in dist/index.html');
assert(styleTag, 'Vite stylesheet asset not found in dist/index.html');

let clientJs = await readFile(join(viteDir, scriptTag[1]), 'utf8');
const clientCss = await readFile(join(viteDir, styleTag[1]), 'utf8');
const icons = await readFile(join(root, 'public', 'icons.svg'), 'utf8');
const favicon = await readFile(join(root, 'public', 'favicon.svg'), 'utf8');

assert(clientJs.includes('/icons.svg#'), 'Expected Vite icon references were not found');
clientJs = clientJs.replaceAll('/icons.svg#', '#');
assert(!clientJs.includes('/assets/'), 'The client bundle still references separate assets');

const inlineIcons = icons.replace(
  '<svg ',
  '<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden" '
);
const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(favicon)}`;

html = html
  .replace(
    scriptTag[0],
    () => `<script type="module">${clientJs.replaceAll('</script', '<\\/script')}</script>`
  )
  .replace(styleTag[0], () => `<style>${clientCss}</style>`)
  .replace('href="/favicon.svg"', `href="${faviconDataUrl}"`)
  .replace('<div id="root"></div>', `${inlineIcons}\n    <div id="root"></div>`)
  .replace(
    '</body>',
    `  <script>
      if (window.google?.script?.run) {
        google.script.run
          .withSuccessHandler((message) => console.info('[Koyomi] Apps Script:', message))
          .withFailureHandler((error) => console.error('[Koyomi] Apps Script error:', error))
          .helloGws();
      }
    </script>
  </body>`
  );

assert(!html.includes('/assets/'), 'The generated HTML still references separate assets');

await mkdir(gasDir, { recursive: true });
await Promise.all([
  writeFile(join(gasDir, 'Index.html'), html),
  writeFile(join(gasDir, 'Code.js'), await readFile(join(root, 'src', 'server', 'Code.js'))),
  writeFile(join(gasDir, 'appsscript.json'), await readFile(join(root, 'gas', 'appsscript.json'))),
]);

console.log('Built Apps Script files in dist-gas/');
