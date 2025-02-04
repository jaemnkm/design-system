module.exports = {
  presets: ['@babel/env', '@babel/react'],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining'
  ],
  env: {
    test: {
      plugins: ['@babel/transform-runtime']
    }
  }
}
