import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import del from 'rollup-plugin-delete'

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'es',
    sourcemap: true,
    chunkFileNames: 'chunks/[name].mjs',
    entryFileNames: '[name].mjs',
  },
  plugins: [del({
    targets: 'output/*',
  }), resolve(), json(), commonjs()],
}
