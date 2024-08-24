/// <reference types="cypress" />

const username = "Dwight Schrute";

describe("share location", () => {
  beforeEach(() => {
    cy.clock(); // allows us to manipulate the time

    cy.fixture("user-location.json").as("data");

    cy.visit("/").then((_window) => {
      cy.get("@data").then((data) => {
        const { coords } = data;
        // assign an alias to the stub to replace the real fn
        // it now returns a dummy value
        cy.stub(_window.navigator.geolocation, "getCurrentPosition")
          .as("getUserPosition")
          .callsFake((callback) => {
            setTimeout(() => {
              callback({
                coords,
              });
            }, 100);
          });
      });

      cy.stub(_window.navigator.clipboard, "writeText")
        .as("saveToClipboard")
        .resolves();
      // by passing resolves() we make sure 'writeText' returns a promise
      // which resolves immediately - see main.js for the fn we are mocking -
      // and returns the actual value from the clipboard

      cy.spy(_window.localStorage, "setItem").as("storeLocation");
      cy.spy(_window.localStorage, "getItem").as("getStoredLocation");
    });
  });

  it("should call the getLocation fn exactly once", () => {
    cy.visit("/").then((_window) => {
      // assign an alias to the stub to replace the real fn
      // it is an empty fn that returns nothing, unlike the shared stub
      cy.stub(_window.navigator.geolocation, "getCurrentPosition").as(
        "getUserPositionEmpty"
      );
    });

    cy.getById("name-input").type(username);

    cy.getById("get-loc-btn").then(($el) => {
      expect($el).not.to.have.attr("disabled");
      expect($el).to.have.attr("class", "active");
      expect($el).to.contain("Get Location");
    });

    cy.getById("get-loc-btn").click();

    cy.get("@getUserPositionEmpty").should("have.been.calledOnce");

    cy.getById("get-loc-btn").should("be.disabled");

    cy.getById("share-loc-btn").should("be.disabled");
  });

  it("should fetch a location", () => {
    cy.getById("name-input").type(username);

    cy.getById("get-loc-btn").should("not.be.disabled");

    cy.getById("share-loc-btn").should("be.disabled");

    cy.getById("get-loc-btn").click();

    cy.getById("get-loc-btn").should("be.disabled");

    cy.tick(2000); // allows us to skip ahead 2000 ms

    cy.getById("get-loc-btn").should("not.exist");

    cy.getById("share-loc-btn").should("not.be.disabled");

    cy.getById("actions").should("contain", "Location fetched!");
  });

  it("should share and store the correct bing maps url", () => {
    cy.getById("name-input").type(username);

    cy.getById("get-loc-btn").click(); // ? 'Get Location'

    // ? after clicking 'Get Location', the following spies should not yet have been called:

    cy.get("@storeLocation").should("not.have.been.called");

    cy.get("@getStoredLocation").should("not.have.been.called");

    cy.getById("share-loc-btn").click(); // ? 'Share Link'

    cy.getById("info-message")
      .should("be.visible")
      .and("contain", "copied to clipboard");

    cy.tick(2000);

    cy.getById("info-message").should("not.be.visible");

    cy.get("@data").then((data) => {
      const { latitude, longitude } = data.coords;

      // ? after clicking 'Share Link', the following stubs and spies should have been called:

      cy.get("@saveToClipboard").should(
        "have.been.calledWithMatch",
        new RegExp(`${latitude}.*${longitude}.*${encodeURI(username)}`)
      );

      cy.get("@storeLocation").should(
        "have.been.calledWithMatch",
        new RegExp(username),
        new RegExp(`${latitude}.*${longitude}.*${encodeURI(username)}`)
      );

      cy.get("@getStoredLocation").should("have.been.calledOnce");
    });

    // ? finally after clicking 'Share Link' again, the following spy should have been twice:

    cy.getById("share-loc-btn").click();

    cy.getById("info-message").should("be.visible");

    cy.tick(2000);

    cy.getById("info-message").should("not.be.visible");

    cy.get("@getStoredLocation").should("have.been.calledTwice");
  });
});
