console.log('babel')
module.exports = {
    // "presets": process.env.NODE_ENV === 'test' ? ["@babel/preset-env"] : [],
    plugins: [
        ['@iosio/babel-plugin-jcss'],
        ["transform-inline-environment-variables"],
        ["@babel/plugin-syntax-dynamic-import"],
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
};