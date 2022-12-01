module.exports = {
  noVerify: true,
  tagPrefix: 'version/',
  infile: 'CHANGELOG.md',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}} [skip ci]',
  silent: false,
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commits/{{hash}}',
  compareUrlFormat:
    '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}%0D{{currentTag}}',
  types: [
    { type: 'chore', section: 'Others', hidden: false },
    { type: 'revert', section: 'Reverts', hidden: false },
    { type: 'feat', section: 'Features', hidden: false },
    { type: 'fix', section: 'Bug Fixes', hidden: false },
    { type: 'improvement', section: 'Feature Improvements', hidden: false },
    { type: 'docs', section: 'Docs', hidden: false },
    { type: 'style', section: 'Styling', hidden: false },
    { type: 'refactor', section: 'Code Refactoring', hidden: false },
    { type: 'perf', section: 'Performance Improvements', hidden: false },
    { type: 'test', section: 'Tests', hidden: false },
    { type: 'build', section: 'Build System', hidden: false },
    { type: 'ci', section: 'CI', hidden: false },
  ],
};