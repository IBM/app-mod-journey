// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/*global Cypress,cy*/

/* Visit the playbook app using Cypress configured baseUrl */
Cypress.Commands.add('playbook', (url = '/') => {
  cy.visit(url);
});
