/// <reference types="cypress" />

describe("contact form", () => {
  // before(()=>{
  //   cy.log('before all')
  // })

  beforeEach(() => {
    cy.visit("/about");
  });

  it("should submit the form", () => {
    // ? this code will be triggered by the test, could be used to mock data fetch etc etc
    cy.task("seedDatabase", "hello").then((returnValue) => {
      console.log(returnValue);
    });
    cy.getById("contact-input-message").type("Hello world!");
    cy.getById("contact-input-name").type("John Doe");
    cy.getById("contact-btn-submit").then((el) => {
      expect(el.attr("disabled")).to.be.undefined;
      expect(el.text()).to.eq("Send Message");
    });
    cy.screenshot();
    cy.getById("contact-input-email").type("test@example.com");
    cy.getById("contact-btn-submit").as("submitBtn");
    // cy.get('[data-cy="contact-btn-submit"]')
    //   .contains('Send Message')
    //   .should('not.have.attr', 'disabled');
    cy.screenshot();
    cy.submitForm();
    cy.get("@submitBtn").contains("Sending...");
    cy.get("@submitBtn").should("have.attr", "disabled");
  });

  it("should validate the form input", () => {
    cy.submitForm();
    cy.getById("contact-btn-submit").then((el) => {
      expect(el).to.not.have.attr("disabled");
      expect(el.text()).to.not.equal("Sending...");
    });
    cy.getById("contact-btn-submit").contains("Send Message");
    cy.getById("contact-input-message").as("msgInput");
    cy.get("@msgInput").focus().blur();
    cy.get("@msgInput")
      .parent()
      .should((el) => {
        expect(el.attr("class")).not.to.be.undefined;
        expect(el.attr("class")).contains("invalid");
      });

    cy.getById("contact-input-name").focus().blur();
    cy.getById("contact-input-name")
      .parent()
      .should((el) => {
        expect(el.attr("class")).not.to.be.undefined;
        expect(el.attr("class")).contains("invalid");
      });

    cy.getById("contact-input-email").focus().blur();
    cy.getById("contact-input-email")
      .parent()
      .should((el) => {
        expect(el.attr("class")).not.to.be.undefined;
        expect(el.attr("class")).contains("invalid");
      });
  });
});
