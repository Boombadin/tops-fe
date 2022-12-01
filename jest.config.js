process.env.NODE_ENV = 'test';
const { version } = require('./package.json');
// Jest configuration
// https://facebook.github.io/jest/docs/en/configuration.html
module.exports = {
  testResultsProcessor: 'jest-sonar-reporter',
  testRunner: 'jest-circus/runner',
  collectCoverageFrom: [
    'client/components/**/*.{js,jsx}',
    'client/pages/**/*.{js,jsx}',
    'client/reducers/**/*.{js,jsx}',
    'client/contexts/**/*.{js,jsx}',
    'client/features/**/*.{js,jsx}',
    'client/utils/**/*.{js,jsx}',
    'client/hooks/**/*.{js,jsx}',
    'client/routes/url-rewrite/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coveragePathIgnorePatterns: [
    'utils/gtm/*',
    'utils/decorators',
    'utils/cookie.js',
    'utils/location.js',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/client/__mocks__/fileMock.js',
    '\\.(css|less|styl|scss|sass|sss)$': 'identity-obj-proxy',
    'isomorphic-style-loader/lib/withStyles': '<rootDir>/tools/withStyles.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  reporters: [
    'default',
    [
      '@reportportal/agent-js-jest',
      {
        token: 'f0065832-58d1-4952-a56b-00b84fe237e9',
        endpoint: 'https://report-portal.central.tech/api/v1',
        project: 'tops-fe',
        launch: 'TOPS-FE',
        description: 'tops-fe',
        attributes: [
          {
            key: 'Version',
            value: version,
          },
        ],
      },
    ],
  ],
  clearMocks: true,
};
