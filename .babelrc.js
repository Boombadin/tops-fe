// Babel configuration
// https://babeljs.io/docs/usage/api/
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    // Stage 2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    // Stage 3
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-optional-chaining',
    ['babel-plugin-styled-components', {
      "ssr": true
    }],
    ['module-resolver', {
      'alias': {
        '@': './',
        '@client': './client',
        '@app': './app',
      }
    }]
  ],
  ignore: ['node_modules', 'build'],
  env: {
    //scoped to test only
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [['@babel/transform-runtime']],
    },
  },
};
