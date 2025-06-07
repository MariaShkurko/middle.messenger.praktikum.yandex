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
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
};
