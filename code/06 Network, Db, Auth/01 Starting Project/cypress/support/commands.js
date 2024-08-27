/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add(
  "login",
  (
    credentials = {
      email: "test@example.com",
      password: "testpassword",
      path: "/login",
    }
  ) => {
    cy.visit(credentials.path);
    // sometimes there is a bug where it does not type right away...
    cy.get('[data-cy="auth-email"]').click();
    cy.get('[data-cy="auth-email"]').type(credentials.email);
    cy.get('[data-cy="auth-password"]').type(credentials.password);
    cy.get('[data-cy="auth-submit"]').click();
  }
);

// the below code snippet is required to handle a React hydration bug that would cause tests to fail
// it's only a workaround until this React behavior / bug is fixed
Cypress.on("uncaught:exception", (err) => {
  // we check if the error is
  if (
    err.message.includes("Minified React error #418;") ||
    err.message.includes("Minified React error #423;") ||
    err.message.includes("hydrating") ||
    err.message.includes("Hydration")
  ) {
    return false;
  }
});
