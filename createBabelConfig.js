const {DEFAULT_EXTENSIONS} = require('@babel/core');
const {findSupportedBrowsers} = require('@open-wc/building-utils');


exports.createBabelConfig = ({legacy, rollup, prod, options = {}, buildingLib}) => {

    console.log('babel', 'is prod:', prod);
    console.log('babel', 'is legacy', legacy);
    // const rollupAddition = rollup ? {extensions: DEFAULT_EXTENSIONS} : {};

    const temp = "./node_modules/_tempFiles";

    const context = buildingLib ? 'lib' : 'build';

    const assetsOutput = prod ? `/${context}/assets` : temp;

    const fileLoading = prod ? [] : [];

    const getFileNamePath = () => {
        if (!prod) return temp;
        if (legacy) return '../assets';
        return '/assets'
    };

    const browserTargets = legacy
        ? ['ie 11']
        : (!prod ? ['chrome 77'] : findSupportedBrowsers());

    return {

        ...options,

        presets: [
            !prod && [
                '@babel/preset-env',
                {
                    targets: browserTargets,
                    // preset-env compiles template literals for safari 12 due to a small bug which
                    // doesn't affect most use cases. for example lit-html handles it: (https://github.com/Polymer/lit-html/issues/575)
                    exclude: legacy ? undefined : ['@babel/plugin-transform-template-literals'],
                    useBuiltIns: false,
                    modules: false,
                },
            ],
        ].filter(Boolean),

        plugins: [

            // ...fileLoading,
            [
                "file-loader",
                {
                    "name": prod ? "[hash].[ext]" : "[name].[ext]",
                    "extensions": ["png", "jpg", "jpeg", "gif", "svg"],
                    "publicPath": getFileNamePath(), // what is put in the url
                    "outputPath": assetsOutput, //where the file is placed
                    "context": prod ? `/${context}` : "",
                    "limit": 0
                }
            ],

            ['@iosio/babel-plugin-jcss', {browsers: browserTargets}],

            ["transform-inline-environment-variables"],

            '@babel/plugin-syntax-dynamic-import',

            '@babel/plugin-syntax-import-meta',

            ['bundled-import-meta', {importStyle: 'baseURI'}],

            [
                "@babel/plugin-transform-react-jsx",
                {
                    "pragma": "h",
                    "pragmaFrag": "Fragment"
                }
            ],

            [
                "@babel/plugin-proposal-class-properties",
                {
                    "loose": true
                }
            ],

        ]
    }
};






