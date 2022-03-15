import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import fs from 'fs';
import * as info from './package.json';

var license = fs.readFileSync(path.join(__dirname, 'LICENSE'), 'utf-8');
var banner = '/**\n *\n' + license.split('\n').map(function (line) {
  return ' *' + (line.length ? ' ' : '') + line;
}).join('\n') + '\n */';
var copyright = license.split('\n').filter(function (line) {
  return /Copyright/.test(line);
}).join(', ');

export default [
  {
    input: 'src/bundle.js',
    output: [
      {
        file: 'dist/unrandomize.js',
        name: 'unrandomize',
        banner,
        format: 'umd'
      },
      {
        file: 'dist/unrandomize.min.js',
        name: 'unrandomize',
        plugins: [ terser({
          format: { preamble: '// timeweb v' + info.version + ' ' + copyright }
        }) ],
        format: 'umd'
      }
    ],
    plugins: [ json() ]
  }
];