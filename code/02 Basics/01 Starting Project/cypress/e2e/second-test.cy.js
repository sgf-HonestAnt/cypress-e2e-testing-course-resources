// ? get auto-completion:
/// <reference types="Cypress" />

describe("second-test", () => {
  it("should render the main image", () => {
    cy.visit("http://localhost:5173/");

    cy.get(".main-header")
      .find("img") // find the image inside main-header class
      .should("have.attr", "src", "/src/assets/logo.png");
  });

  it("should display the page title", () => {
    cy.visit("http://localhost:5173/");

    cy.get("h1").should("have.length", 1); // 'get' all the h1s

    cy.get("h1").contains("My Cypress Course Tasks");
  });
});
