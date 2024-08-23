/// <reference types="Cypress" />

describe("contact form", () => {
  it("should submit a message", () => {
    cy.visit("http://localhost:5173/about");

    // provide an alias to make the code more DRY
    cy.get('[data-cy="contact-btn-submit"]').as("submitBtn");

    cy.get("@submitBtn").contains("Send Message");

    cy.get('[data-cy="contact-input-message"]').type(
      "This is a message from your future self"
    );

    cy.get('[data-cy="contact-input-name"]').type("Dwight Schrute");

    // ? test submitting the button by pressing enter
    cy.get('[data-cy="contact-input-email"]').type(
      "dwight.schrute@email.com{enter}"
    );

    // cy.get("@submitBtn").click();

    cy.get("@submitBtn").contains("Sending...").and("have.attr", "disabled");
    cy.get("@submitBtn").should("have.css", "cursor", "not-allowed");

    cy.wait(1000);

    // alternatively, use then()
    cy.get("@submitBtn")
      .screenshot()
      .then(($el) => {
        expect($el).not.to.have.attr("disabled");
        expect($el.attr("disabled")).to.be.undefined;
        expect($el).to.contain("Send Message");
        expect($el).to.have.css("background-color", "rgb(58, 59, 184)");
      });

    // we would expect the inputs to be cleared if the message was sent
    // cy.get('[data-cy="contact-input-message"]').should("have.value", "");
    // cy.get('[data-cy="contact-input-name"]').should("have.value", "");
    // cy.get('[data-cy="contact-input-email"]').should("have.value", "");
  });

  it("should validate the form", () => {
    cy.visit("http://localhost:5173/about");
    cy.get('[data-cy="contact-btn-submit"]').as("submitBtn");

    function attemptSubmit(className) {
      cy.get("@submitBtn")
        .click()
        .then(($el) => {
          expect($el).not.to.have.attr("disabled");
          expect($el).not.to.contain("Sending...");
        });

      cy.get(`[data-cy="${className}"]`).focus().blur();

      cy.get(`[data-cy="${className}"]`)
        .parent()
        .should("have.attr", "class")
        .and("match", /invalid/i); // in this case, this line 'and' yields the same subject as it was given from the previous line - the attribute. Another way to do this is:

      cy.get(`[data-cy="${className}"]`)
        .parent()
        .should((el) => {
          expect(el).to.have.attr("class");
          expect(el.attr("class")).contains("invalid");
        });
    }

    attemptSubmit("contact-input-message");

    cy.get('[data-cy="contact-input-message"]').type(
      "Bears, beets, battlestar galactica"
    );

    attemptSubmit("contact-input-name");

    cy.get('[data-cy="contact-input-name"]').type("Jim Halpert");

    attemptSubmit("contact-input-email");

    cy.get('[data-cy="contact-input-email"]').type("jimhalpert@email.com");

    cy.get("@submitBtn")
      .click()
      .screenshot()
      .then(($el) => {
        expect($el).to.have.attr("disabled");
        expect($el).to.contain("Sending...");
      });

    cy.wait(1000);

    cy.get("@submitBtn").then(($el) => {
      expect($el).not.to.have.attr("disabled");
      expect($el.attr("disabled")).to.be.undefined;
      expect($el).to.contain("Send Message");
    });
  });
});
