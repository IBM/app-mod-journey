import cypress from 'eslint-plugin-cypress';

export default [
  cypress.configs.recommended,
  {
    files: ['cypress/**/*.js', 'src/**/*.cy.js', 'src/**/*.cy.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },
];
