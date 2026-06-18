//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    // `video/` is a self-contained Remotion sub-project with its own toolchain
    // (eslint config + tsconfig); it must not be linted by the site config.
    ignores: ['eslint.config.js', 'prettier.config.js', 'video/**'],
  },
]
