module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      parser: '@typescript-eslint/parser',
    },
    rules: {
    },
  };
  