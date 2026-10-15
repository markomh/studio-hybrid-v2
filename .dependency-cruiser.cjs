/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'core-no-react',
      severity: 'error',
      comment: 'Core package must not import React or react-dom (I-2).',
      from: { path: '^packages/core' },
      to: {
        dependencyTypes: ['npm'],
        path: '^(react|react-dom)',
      },
    },
    {
      name: 'core-no-legacy',
      severity: 'error',
      comment: 'Core package must not import from docs or legacy-src.',
      from: { path: '^packages/core' },
      to: { path: '(docs|legacy-src)' },
    },
    {
      name: 'apps-no-legacy',
      severity: 'error',
      comment: 'Apps must not import from docs or legacy-src.',
      from: { path: '^apps' },
      to: { path: '(docs|legacy-src)' },
    },
    {
      name: 'apps-no-core-internal',
      severity: 'error',
      comment: 'Apps must not import from core internal modules.',
      from: { path: '^apps' },
      to: { path: '^packages/core/src/internal' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsConfig: {
      fileName: 'tsconfig.base.json',
    },
  },
};
