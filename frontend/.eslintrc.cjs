module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unstable-nested-components': 'off',
    'implicit-arrow-linebreak': 'off',
    'react/jsx-curly-newline': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-confusing-arrow': 'off',
    'no-case-declarations': 'off',
    'no-continue': 'off',
    'react/no-array-index-key': 'off',
    indent: 'off',
  },
};
