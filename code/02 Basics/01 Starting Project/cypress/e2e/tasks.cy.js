import tasks from "../fixtures/tasks.json";

// ? get auto-completion:
/// <reference types="Cypress" />

// ! NOTE: Cypress offers TEST ISOLATION: page is reloaded with new context and clear cache before running every test. Creating a task in one test should not affect the creation of tasks in the next.

function shouldExist(exists) {
  if (exists) {
    cy.get("dialog.modal").should("exist");
    cy.get(".backdrop").should("exist");
  } else {
    cy.get("dialog.modal").should("not.exist");
    cy.get(".backdrop").should("not.exist");
  }
}

function addTask(task) {
  cy.contains("Add Task").click();

  shouldExist(true);

  for (const key in task) {
    !key.includes("select")
      ? cy.get(key).type(task[key])
      : cy.get(key).select(task[key]);
  }

  cy.get(".modal").contains("Add Task").click();

  shouldExist(false);
}

describe("tasks management", () => {
  it("should open and close the new task modal", () => {
    cy.visit("http://localhost:5173/");

    cy.contains("Add Task").click();

    shouldExist(true);

    // ? clicking the backdrop should close the modal, *but* elements are by default clicked in the centre! Coords can be changed, but { force: true } can also be used.
    cy.get(".backdrop").click({
      force: true,
    });

    shouldExist(false);

    cy.contains("Add Task").click();

    shouldExist(true);

    cy.contains("Cancel").click();

    shouldExist(false);
  });

  it("should add a task", () => {
    cy.visit("http://localhost:5173/");

    addTask({
      "input#title": "My First Test Task",
      "textarea#summary": "My First Test Task Summary",
    });

    cy.get("li.task").should("have.length", 1);

    cy.get("li.task h2").should("contain", "My First Test Task");
    cy.get("li.task p").should("contain", "My First Test Task Summary");
  });

  it("should add two new tasks in the right order", () => {
    cy.visit("http://localhost:5173/");

    tasks.forEach((task) => addTask(task));

    // finally, let's check the tasks exist
    cy.get("li.task").should("have.length", 2);

    cy.get("li.task h2").should("contain", tasks[0]["input#title"]);
    cy.get("li.task p").should("contain", tasks[0]["textarea#summary"]);
    cy.get("li.task span.task-category").should("contain", "🚨");

    cy.get("li.task h2").should("contain", tasks[1]["input#title"]);
    cy.get("li.task p").should("contain", tasks[1]["textarea#summary"]);
    cy.get("li.task span.task-category").should("contain", "🟢");

    cy.get("li.task h2").eq(0).should("contain", tasks[0]["input#title"]);
    cy.get("li.task p").eq(0).should("contain", tasks[0]["textarea#summary"]);
    cy.get("li.task h2").eq(1).should("contain", tasks[1]["input#title"]);
    cy.get("li.task p").eq(1).should("contain", tasks[1]["textarea#summary"]);
  });

  it("should validate user input", () => {
    cy.visit("http://localhost:5173/");

    cy.contains("Add Task").click(); // click to open the modal

    shouldExist(true);

    cy.contains("Add Task").click(); // click inside the modal to add a task

    shouldExist(true);

    cy.get(".error-message").contains("Please provide"); // 'contains' by default will search for any text that includes the (case-sensitive) content
  });

  it("should filter tasks by category", () => {
    cy.visit("http://localhost:5173/");

    tasks.forEach((task) => addTask(task));

    cy.get("li.task").should("have.length", 2);

    cy.get("select#filter").select("urgent");

    cy.get("li.task span.task-category").should("contain", "🚨");

    cy.get("li.task span.task-category").should("not.contain", "🟢");

    cy.get("select#filter").select("low");

    cy.get("li.task span.task-category").should("not.contain", "🚨");

    cy.get("li.task span.task-category").should("contain", "🟢");

    cy.get("select#filter").select("important");

    cy.get("li.task").should("not.exist");

    cy.get("select#filter").select("moderate");

    cy.get("li.task").should("not.exist");

    cy.get("select#filter").select("all");

    cy.get("li.task").should("have.length", 2);
  });
});
