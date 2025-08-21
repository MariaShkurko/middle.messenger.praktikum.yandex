module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        js: 'ignorePackages',
      },
    ],
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'prettier/prettier': ['error'],
    'import/prefer-default-export': 'off',
    'no-use-before-define': ['error', { 'functions': true, 'classes': true, 'variables': true, 'typedefs': false }],
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
};
