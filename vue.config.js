module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/cake-shop': {
        target: 'http://localhost:10001/',
        pathRewrite: { '^/cake-shop': '/' },
      },
    }
  }
}