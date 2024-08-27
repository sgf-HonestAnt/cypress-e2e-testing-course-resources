/// <reference types="Cypress" />

// ! we never want to test using the real DB: we will be creating new data and our tests should never change the DB, prod DB in particular. therefore, we will set up our tests with a test-specific DB by adding 'dotenv.test', and changing the scripts to use it (see package.json).

describe("Takeaways", () => {
  beforeEach(() => {
    // ? we will seed the DB before every test run, which ensures we keep test isolation and start every test with a brand new DB. see 'cypress.config.js'
    cy.task("seedDatabase");
  });
  it("should display a list of fetched takeaways", () => {
    cy.visit("/");
    cy.get('[data-cy="takeaway-item"]').should("have.length", 2);
  });
  it("should add a new takeaway", () => {
    cy.intercept("POST", "/takeaways/new*").as("createTakeaway");
    cy.login();
    cy.get('[href="/takeaways/new"]').click();
    cy.get('[data-cy="title"]').click();
    cy.get('[data-cy="title"]').type("TestTitle1");
    cy.get('[data-cy="body"]').type("TestBody1");
    cy.get('[data-cy="create-takeaway"]').click();
    cy.wait("@createTakeaway")
      .its(
        "request.body" // this is the request body we are intercepting
      )
      .should("match", /TestTitle1.*TestBody1/);
  });
});
