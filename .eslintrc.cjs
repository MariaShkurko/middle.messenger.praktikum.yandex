module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        js: 'ignorePackages',
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }],
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    'prettier/prettier': ['error'],
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
  ignorePatterns: ['vite.config.js', 'postcss.config.js', '*.cjs'],
};
