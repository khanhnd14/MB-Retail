module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['jest'],
  parserOptions: {
    ecmaFeatures: {
      classes: true,
    },
  },
  env: {
    'jest/globals': true,
  },
  rules: {
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    "no-restricted-globals": [
        "error",
        {
            "name": "event",
            "message": "Use local parameter instead."
        },
        {
            "name": "fdescribe",
            "message": "Do not commit fdescribe. Use describe instead."
        }
    ],
    'global-require': 'off',
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-underscore-dangle': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-nested-ternary': 'off',
    'react/no-multi-comp': 'off',
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-fragments': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'max-len': 'off',
    'react/prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'react/no-array-index-key': 'off',
    'arrow-parens': 'off',
    indent: 'off',
    'operator-linebreak': 'off',
    'consistent-return': 'off',
    'no-return-assign': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-restricted-syntax': 'off',
    'no-prototype-builtins': 'off',
    'no-confusing-arrow': 'off',
    'react/jsx-curly-newline': 'off',
    'no-plusplus': 'off',
    camelcase: 'off',
    semi: 'off',
    'space-before-function-paren': 'off',
    'react/require-default-props': 'off',
    'react/forbid-prop-types': 'off',
    'import/no-cycle': 'off',
    'comma-dangle': 'off',
    'react/sort-comp': 'off',
    'no-unused-expressions': 'off',
    'no-var':'off'
  },
}
