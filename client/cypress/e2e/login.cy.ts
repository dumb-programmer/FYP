// cypress/e2e/login.cy.js

describe("/login", () => {
  beforeEach(() => {
    cy.intercept("http://localhost:3000/user", {
      statusCode: 200,
      body: {},
    }).as("userRequest");
    cy.visit("/login");
  });

  it("should display the login form", () => {
    cy.get("h1").should("have.text", "Login");
  });

  it("should show validation errors for empty fields", () => {
    cy.get("button").click();

    cy.get("#email")
      .parent()
      .find("span")
      .should("have.text", "Email is required");
    cy.get("#password")
      .parent()
      .find("span")
      .should("have.text", "Password must be at least 8 characters");
  });

  it("should show error for invalid credentials", () => {
    cy.intercept("POST", "http://localhost:3000/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    });

    cy.get("#email").type("invalid@example.com");
    cy.get("#password").type("WrongPassword123");

    cy.get("button").click();

    cy.get("span").should("have.text", "Invalid credentials");
  });

  it("should successfully submit the form with valid data and redirect", () => {
    cy.intercept("POST", "http://localhost:3000/login", {
      statusCode: 200,
      body: { message: "Login successful" },
    }).as("loginRequest");

    cy.get("#email").type("john@gmail.com");
    cy.get("#password").type("Password123");

    cy.get("button").click();

    cy.intercept("http://localhost:3000/user", {
      statusCode: 200,
      body: { firstName: "test", lastName: "test", email: "john@gmail.com" },
    }).as("userRequest");

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);

    cy.get("[data-testid='welcome-heading']").should("have.text", "Welcome");
  });

  it("should successfully submit the form with valid data and redirect to specified path", () => {
    const redirectPath = "/chat/123";
    cy.visit(`/login?redirect=${redirectPath}`);

    cy.intercept("POST", "http://localhost:3000/login", {
      statusCode: 200,
      body: { message: "Login successful" },
    }).as("loginRequest");

    cy.get("#email").type("john@gmail.com");
    cy.get("#password").type("Password123");

    cy.get("button").click();

    cy.intercept("http://localhost:3000/user", {
      statusCode: 200,
      body: { firstName: "test", lastName: "test", email: "john@gmail.com" },
    }).as("userRequest");

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.url().should("eq", `${Cypress.config().baseUrl}${redirectPath}`);
  });

  it("should navigate to signup page", () => {
    cy.get('a[href="/signup"]').click();
    cy.url().should("include", "/signup");
  });
});
