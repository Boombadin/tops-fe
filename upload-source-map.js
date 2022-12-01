require('dotenv').config();
const SentryCli = require('@sentry/cli');
const Package = require('./package.json');
const project = process.env.SENTRY_PROJECT_PREFIX;
const release = `${project}@${Package.version}`;

async function uploadSourceMap(config, releasesConfig) {
  const cli = new SentryCli(config, {});
  try {
    await cli.releases.new(release);
    await cli.releases.uploadSourceMaps(release, releasesConfig);
  } catch (e) {
    console.log(e);
  }
}

async function upload() {
  await uploadSourceMap('sentry-server.properties', {
    include: ['./build/app.js', './build/app.js.map'],
    urlPrefix: '/usr/src/app/build/',
    rewrite: true,
  });
  await uploadSourceMap('sentry-client.properties', {
    include: ['./build/public/'],
    urlPrefix: '/assets/',
    rewrite: true,
  });
}

if (
  process.env.SENTRY_PROJECT_PREFIX &&
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG
) {
  upload()
    .then(() => {
      console.log('upload SourceMaps Success');
    })
    .catch(console.error);
} else {
  console.log('Skip uploadSourceMaps');
}
