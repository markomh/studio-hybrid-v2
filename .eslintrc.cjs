module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/docs/**', '**/legacy-src/**', '../docs/**', '../**/docs/**'],
            message: 'Importing from docs or legacy-src is strictly forbidden.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['apps/web/**/*'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "BinaryExpression[operator=/(==|===|!=|!==)/][left.property.name='type'][right.type='Literal'], BinaryExpression[operator=/(==|===|!=|!==)/][right.property.name='type'][left.type='Literal']",
            message: 'UI components must not branch on element.type. Use capabilities from the registry instead (I-3).',
          },
        ],
      },
    },
  ],
};
