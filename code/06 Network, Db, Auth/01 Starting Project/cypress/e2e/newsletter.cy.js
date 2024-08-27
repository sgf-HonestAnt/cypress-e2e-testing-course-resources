/// <reference types="Cypress" />

describe("Newsletter", () => {
  beforeEach(() => {
    cy.task("seedDatabase");
  });

  it("should display a success message", () => {
    // ? set up a spy + block for certain types of request (see inspect Network tab for the path and method) --> args: method, path, returns

    cy.intercept("POST", "/newsletter*", {
      status: 201, // ? see fn 'NewsletterSignup'
    }).as("subscribe");

    cy.visit("/");

    cy.get('[data-cy="newsletter-email"]').type("test@example.com");

    cy.get('[data-cy="newsletter-submit"]').click();

    cy.wait("@subscribe");
    // not actually needed here; if visit and intercept was placed within beforeEach() it would be.

    cy.get("p").should("contain", "Thanks for signing up!");
  });

  it("should display an error message where signup user exists", () => {
    cy.intercept("POST", "/newsletter*", {
      message: "This email is already subscribed",
    });

    cy.visit("/");

    cy.get('[data-cy="newsletter-email"]').type("test@example.com");

    cy.get('[data-cy="newsletter-submit"]').click();

    cy.get("p").should("contain", "This email is already subscribed");
  });

  // ? here we are decoupling backend and frontend tests - not blocking or intercepting the request as we are above!
  it("should successfully create a new contact", () => {
    cy.request({
      method: "POST",
      url: "/newsletter",
      body: { email: "test@example.com" },
      form: true,
    }).then((res) => {
      expect(res.status).to.eq(201);
    });
  });

  // it("should return an error when contact exists", () => {
  //   cy.request({
  //     method: "POST",
  //     url: "/newsletter",
  //     body: { email: "test2@example.com" },
  //     form: true,
  //   }).then((res) => {
  //     // expect a throw
  //     expect(res.body.message).to.eq("This email is already subscribed");
  //   }); // see `seed-test.js`
  // });
});
