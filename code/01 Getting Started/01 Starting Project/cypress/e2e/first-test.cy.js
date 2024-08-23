describe("localhost runs", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173/");
  });
  it("contains a heading with the expected text", () => {
    const text = "Getting Started with Cypress"
    cy.visit("http://localhost:5173/");
    cy.get("h1").should("have.text", text);
  });
  it("contains six list items", () => {
    cy.visit("http://localhost:5173/");
    cy.get("li").should("have.length", 6);
  });
  it("contains a span with the expected text", () => {
    const text = "configure Cypress"
    cy.visit("http://localhost:5173/");
    cy.get("span").contains(text);
  });
});
