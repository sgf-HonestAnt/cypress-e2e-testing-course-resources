/// <reference types="Cypress" />

describe("Auth", () => {
  beforeEach(() => {
    cy.task("seedDatabase");
  });
  it("should signup", () => {
    cy.login({
      email: "test2@example.com",
      password: "!@£$%^&*",
      path: "/signup",
    });
    // after successful signup, we should be redirected to /takeaways
    cy.url().should("include", "/takeaways");
    cy.location("pathname").should("eq", "/takeaways");
    // after successful signup, a session cookie should exit
    cy.getCookie("__session").its("value").should("not.be.empty");
  });
  it("should login", () => {
    cy.login();
    cy.url().should("include", "/takeaways");
    cy.getCookie("__session").its("value").should("not.be.empty");
  });
  it("should logout", () => {
    cy.login();
    cy.contains("Logout").click();
    cy.location("pathname").should("eq", "/");
    cy.getCookie("__session").its("value").should("be.empty");
  });
});
