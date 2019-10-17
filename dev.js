import {DEFAULT_EXTENSIONS} from '@babel/core';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import url from 'rollup-plugin-url';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import indexHTML from 'rollup-plugin-index-html';
import {exec} from 'child_process';

const ex = (cmd) => new Promise((resolve) => exec(cmd, resolve));

let browsers = ['chrome 77'];

const babelPlugins = [
    ['@iosio/babel-plugin-jcss', {browsers}],
    "transform-inline-environment-variables",
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['bundled-import-meta', {importStyle: 'baseURI'}],
    ["@babel/plugin-transform-react-jsx", {pragma: 'h', pragmaFrag: "Fragment"}],
    ["@babel/plugin-proposal-class-properties", {"loose": true}],
];

process.env.NODE_ENV = 'development';

const outputDir = './node_modules/_iosio_temp_dev_build';

export default ex(`rimraf ${outputDir}`).then(() => ({
    entry: 'demo/src/index.js',
    treeshake: false,
    output: {
        dir: outputDir,
        format: 'esm',
        sourcemap: true,
        chunkFileNames: "common.js"
    },
    plugins: [
        resolve({
            extensions: DEFAULT_EXTENSIONS,
        }),
        indexHTML({
            indexHTML: 'demo/index.html'
        }),
        babel({
            extensions: DEFAULT_EXTENSIONS,
            babelrc: false,
            configFile: false,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: ['chrome 77'],
                        useBuiltIns: false,
                        modules: false,
                    },
                ]
            ],
            plugins: babelPlugins
        }),
        url({limit: 0, fileName: "[dirname][hash][extname]"}),
        serve({contentBase: outputDir, historyApiFallback: true}),
        livereload({watch: outputDir})
    ]
}));
