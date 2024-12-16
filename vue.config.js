const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/news-fetcher-platform/' 
    : '/',
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map'
  },
})
