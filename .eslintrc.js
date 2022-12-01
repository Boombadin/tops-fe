// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: 'babel-eslint',

  extends: ['plugin:react-hooks/recommended', 'plugin:flowtype/recommended', 'prettier', 'prettier/react'],

  plugins: ['import', 'react', 'css-modules', 'prettier', 'jest', 'simple-import-sort'],

  globals: {
    __DEV__: true,
  },

  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  rules: {
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-unresolved': ['error', { ignore: ['!!isomorphic-style-loader'] }],
    'import/named': 'error',

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-debugger': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-semi': 'error',
    'no-func-assign': 'error',
    'no-inner-declarations': 'error',
    'no-else-return': 'error',
    'no-multi-spaces': 'error',
    'no-useless-return': 'error',
    'no-undef-init': 'error',
    'no-const-assign': 'error',
    'no-this-before-super': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'template-curly-spacing': ['error', 'never'],
    'no-multiple-empty-lines': 'error',
    'no-lonely-if': 'error',
    'no-trailing-spaces': 'error',
    'no-unneeded-ternary': 'error',
    'no-nested-ternary': 'warn',
    'no-dupe-keys': 'error',
    'no-dupe-args': 'error',
    'no-undef': 'warn',
    'no-unused-vars': 'error',

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',
    quotes: ['warn', 'single', { allowTemplateLiterals: true }],
    'react/no-string-refs': 'error',
    'react/no-this-in-sfc': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/no-multi-comp': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/no-deprecated': 'warn',
    'react/no-array-index-key': 'warn',
    'react/no-redundant-should-component-update': 'error',
    'react/no-unused-state': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-boolean-value': 'error',
    'react/no-unused-prop-types': 'error',
    'react/default-props-match-prop-types': 'error',
    'react/jsx-no-undef': 'error',

    // ESLint plugin for formatting import order
    // It helps code to look cleaner
    // https://github.com/lydell/eslint-plugin-simple-import-sort
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/sort': [
      'error', {
        'groups': [
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          // Except for @client and @app
          ["^(?!@client)(?!@app)(@?\\w)"],
          // Absolute imports 
          ["^(@client)|(@app)|@"],
          // Anything that does not start with a dot.
          ["^[^.]"],
          // Relative imports.
          // Anything that starts with a dot.
          ["^\\."]
        ]
      }
    ],

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error',

    'css-modules/no-unused-class': 'warn',
    'css-modules/no-undef-class': 'warn',
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      "babel-module": {
        "@": "./",
        '@client': './client',
        '@app': './app',
      }
    },
  },
};
