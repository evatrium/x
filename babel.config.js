const {createBabelConfig} = require('./createBabelConfig')
console.log('babel config')
const config = createBabelConfig({prod: process.env.NODE_ENV === 'production'});
module.exports = config;
