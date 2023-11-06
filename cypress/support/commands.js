// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/*global Cypress,cy*/

const Constants = require('./constants/constants');

/* Pages to visit for accessibility pages */
//https://ibm.github.io/app-mod-journey/tree/index.html
Cypress.Commands.add('playbook', (baseUrl = 'http://localhost:3000') => {
  cy.visit(baseUrl);
  cy.get('body')
    .then($body => {
      cy.log('i am here');
    });
});