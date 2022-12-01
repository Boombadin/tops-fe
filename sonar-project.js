require('dotenv').config();
const { version } = require('./package.json');
const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
  {
    serverUrl: 'https://sonarqube.central.tech',
    token: '85a667227970d74b5d82c45eac03eafca89939a1',
    options: {
      'sonar.projectKey': 'TOPS-FE',
      'sonar.projectName': 'TOPS-FE',
      'sonar.projectVersion': `${version}`,
      'sonar.javascript.file.suffixes': '.js,.jsx',
      'sonar.sources': 'client',
      'sonar.exclusions': 'client/**/*.test.js',
      'sonar.cpd.exclusions':
        'client/graphql/*,client/operations/*,client/apis/*,client/**/__mocks__/*,client/**/*.scss',
      'sonar.test.inclusions': 'client/**/*.test.js',
      'sonar.coverage.exclusions':
        'client/graphql/*,client/operations/*,client/apis/*,client/**/__mocks__/*,client/**/*.test.js,coverage/lcov-report/*',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
      ...(process.env.BITBUCKET_PR_ID
        ? {
            'sonar.pullrequest.key': process.env.BITBUCKET_PR_ID,
            'sonar.pullrequest.branch': process.env.BITBUCKET_BRANCH,
            'sonar.pullrequest.base':
              process.env.BITBUCKET_PR_DESTINATION_BRANCH,
          }
        : {}),
    },
  },
  () => process.exit(),
);
