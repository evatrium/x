const {DEFAULT_EXTENSIONS} = require('@babel/core');
const resolve = require('rollup-plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const sizes = require("@atomico/rollup-plugin-sizes");
import pkg from './package.json';

const external = (id)=> !id.startsWith('.') && !id.startsWith('/');

function outputLib() {
    return {
        input: "src/index.js",
        treeshake: true,
        external, // comment this out to include external dependencies
        output: {
            file: pkg.main,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            resolve({
                extensions: DEFAULT_EXTENSIONS,
            }),
            babel({
                extensions: DEFAULT_EXTENSIONS,
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-syntax-import-meta',
                    ['bundled-import-meta', {importStyle: 'baseURI'}],
                ].filter(_ => !!_),
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: ['chrome 77'],
                            useBuiltIns: false,
                            modules: false,
                        },
                    ],
                ],
            }),
            terser({
                output: {comments: false},
                mangle: {
                    properties: {
                        regex: "^_"
                    }
                },
                compress: {
                    passes: 10,
                    drop_console: true,
                    module: true
                }
            }),
            sizes()
        ],
    };
}

export default [outputLib()];

