import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

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
  plugins: [resolve(), json(), commonjs()],
}
