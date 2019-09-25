import {DEFAULT_EXTENSIONS} from '@babel/core';
import resolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import sizes from "@atomico/rollup-plugin-sizes";
// import multiInput from 'rollup-plugin-multi-input';
const {createBabelConfig} = require('./createBabelConfig');


const external = (id)=> !id.startsWith('.') && !id.startsWith('/');

function outputLib({input, output}) {
    return {
        input:
        // input,
            // 'src/index.js',
        // "x/*.js",
            ["src/index.js", 'src/utils.js', 'src/routing.js', 'src/obi.js'],
        treeshake: true,
        external, // comment this out to include external dependencies
        output: {
            // file: output,
            dir: './',
            format: 'es',
            chunkFileNames: "core.js",
            sourcemap: true,
        },
        plugins: [
            // multiInput({ relative: 'src/' }),
            resolve({
                extensions: DEFAULT_EXTENSIONS,
            }),
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

export default [
    outputLib({}),
    // outputLib({input:'src/index.js', output: 'lib/index.js'}),
    // outputLib({input:'src/routing.js', output: 'routing/index.js'}),
    // outputLib({input:'src/obi.js', output: 'obi/index.js'}),
];

