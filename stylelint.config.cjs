module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['nest'],
      },
    ],
    'no-descending-specificity': null,
    'selector-class-pattern': [
      // Разрешаем kebab-case + BEM
      '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$',
      {
        message: 'Expected class selector to be kebab-case (with BEM allowed)',
      },
    ],
  },
};
