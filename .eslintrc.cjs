module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Treat unused vars as warnings rather than errors while codebase is legacy
    '@typescript-eslint/no-unused-vars': 'warn',
    // Allow explicit any for now during refactor; aim to reduce gradually
    '@typescript-eslint/no-explicit-any': 'off',
    // Allow literal quotes inside JSX text without needing HTML entities
    'react/no-unescaped-entities': 'off',
    // Relax prefer-const until later clean-up
    'prefer-const': 'off',
  },
};
