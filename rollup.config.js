import {DEFAULT_EXTENSIONS} from '@babel/core';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import sizes from "@atomico/rollup-plugin-sizes";
import multiInput from 'rollup-plugin-multi-input';
const {createBabelConfig} = require('./createBabelConfig');


const external = (id)=> !id.startsWith('.') && !id.startsWith('/');

function outputLib(options) {
    return {
        input:
        // "x/*.js",
            ["./src/index.js", './src/utils.js', './src/routing.js', './src/obi.js'],
        treeshake: true,
        external, // comment this out to include external dependencies
        output: {
            // file: pkg.main,
            dir: 'lib',// path.join('lib', ''),
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            // multiEntry(),
            multiInput({ relative: 'src/' }),
            resolve({
                extensions: DEFAULT_EXTENSIONS,
            }),
            // babel({
            //     extensions: DEFAULT_EXTENSIONS,
            //     plugins: [
            //         '@babel/plugin-syntax-dynamic-import',
            //         '@babel/plugin-syntax-import-meta',
            //         ['bundled-import-meta', {importStyle: 'baseURI'}],
            //     ].filter(_ => !!_),
            //     presets: [
            //         [
            //             '@babel/preset-env',
            //             {
            //                 targets: ['chrome 77'],
            //                 useBuiltIns: false,
            //                 modules: false,
            //             },
            //         ],
            //     ],
            // }),
            babel({
                    babelrc: false,
                    configFile: false,
                    ...createBabelConfig({rollup:true, prod: true, buildingLib: true})
                }
            ),
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

export default outputLib();

