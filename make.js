#!/user/bin/env nodejs
'use strict';

const fs = require('fs');
const svelte = require('svelte/compiler');

let components = ['ChangePassword', 'Login', 'Recover'];

try {
  fs.mkdirSync('lib');
} catch (e) {}

// Compile Svelte component.
for (let name of components) {
  const srcFilename = 'src/' + name + '.svelte';
  const dstFilenameJs = 'lib/' + name + '.js';
  const dstFilenameCss = 'lib/' + name + '.css';
  let source = fs.readFileSync(srcFilename, 'utf8');

  const { js, css } = svelte.compile(source, {
    format: 'esm',
    filename: srcFilename,
    name,
    css: false,
  });

  let { code, map } = js;
  if (map) {
    code += '\n//# sourceMappingURL=' + name + '.js.map';
  }
  fs.writeFileSync(dstFilenameJs, code);
  if (map) {
    fs.writeFileSync(dstFilenameJs + '.map', JSON.stringify(map));
  }

  ({ code } = css);
  fs.writeFileSync(dstFilenameCss, code);
}
