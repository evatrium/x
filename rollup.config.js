const {DEFAULT_EXTENSIONS} = require('@babel/core');
const {findSupportedBrowsers} = require('@open-wc/building-utils');
const resolve = require('rollup-plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const sizes = require("@atomico/rollup-plugin-sizes");

import pkg from './package.json';

/*
    options for excluding external dependencies
    - don't use with umd

    function external(id) {
        return !id.startsWith('.') && !id.startsWith('/');
    }

    //or

    external: [
        ...Object.keys(pkg.dependencies || {})
    ],

*/


function external(id) {
    return !id.startsWith('.') && !id.startsWith('/');
}

console.log('building for browsers: ', findSupportedBrowsers());

function outputLib({file, format, min}) {
    let oldSchoolShit = format !== 'esm',
        ESM = format === 'esm',
        UMD = format === 'umd',
        CJS = format === 'cjs';

    let umdName = format === 'umd' ? {name: 'iosiox'} : {};

    return {
        input: "src/index.js",
        treeshake: true,
        external,
        output: {
            file,
            format,
            // dynamicImportFunction: !oldSchoolShit && 'importShim', //--- i think this is for bundling apps not so much for libs
            ...umdName,
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
                            targets: oldSchoolShit ? ['ie 11'] : (ESM ? ['chrome 75'] : findSupportedBrowsers()),
                            // preset-env compiles template literals for safari 12 due to a small bug which
                            // doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
                            exclude: oldSchoolShit ? undefined : ['@babel/plugin-transform-template-literals'],
                            useBuiltIns: false,
                            modules: false,
                        },
                    ],
                ],
            }),
          min && terser({
                output: {comments: false},
                mangle: {
                    properties: {
                        regex: "^_"
                    }
                },
                compress: {
                    passes: 10,
                }
            }),
            sizes()
        ],
    };
}

export default [
    outputLib({file: pkg.main, format: 'cjs'}),
    outputLib({file: pkg.module, format: 'esm'}),
    outputLib({file: pkg['module.min'], format: 'esm', min:true}),
    outputLib({file: pkg.browser, format: 'umd', min: true}),
    // outputLib({ file: 'lib/index.system.js', format: 'system'}), // --- i think this is for bundling apps not so much for libs
];

