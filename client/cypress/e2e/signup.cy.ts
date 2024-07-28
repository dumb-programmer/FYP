describe("/signup", () => {
  beforeEach(() => {
    cy.intercept("http://localhost:3000/user", {
      statusCode: 200,
      body: {},
    }).as("signupRequest");
    cy.visit("/signup");
  });

  it("signup form should be displayed", () => {
    cy.get("h1").should("have.text", "Signup");
  });

  it("should show validation errors for empty fields", () => {
    cy.get("button").click();

    cy.get("#firstName")
      .parent()
      .find("span")
      .should("have.text", "First name is required");

    cy.get("#lastName")
      .parent()
      .find("span")
      .should("have.text", "Last name is required");

    cy.get("#email")
      .parent()
      .find("span")
      .should("have.text", "Email is required");

    cy.get("#password")
      .parent()
      .find("span")
      .should("have.text", "Password must be at least 8 characters");

    cy.get("#confirmPassword")
      .parent()
      .find("span")
      .should("have.text", "Confirm password must be at least 8 characters");
  });

  it("should show error for existing email", () => {
    cy.intercept("POST", "http://localhost:3000/signup", {
      statusCode: 409,
      body: { message: "A user with this email already exists" },
    });

    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Doe");
    cy.get("#email").type("existing@example.com");
    cy.get("#password").type("Password123");
    cy.get("#confirmPassword").type("Password123");

    cy.get("button").click();

    cy.get("#email")
      .parent()
      .find("span")
      .should("have.text", "A user with this email already exists");
  });

  it("should successfully submit the form with valid data", () => {
    cy.intercept("POST", "http://localhost:3000/signup", {
      statusCode: 201,
      body: { message: "Signup successful" },
    }).as("signupRequest");

    cy.get("#firstName").type("John");
    cy.get("#lastName").type("Doe");
    cy.get("#email").type("john.doe@example.com");
    cy.get("#password").type("Password123");
    cy.get("#confirmPassword").type("Password123");

    cy.get("button").click();

    cy.wait("@signupRequest").its("response.statusCode").should("eq", 201);
    // cy.url().should("include", "/welcome");
  });

  it("should navigate to login page", () => {
    cy.get("a[href='/login']").click();
    cy.url().should("include", "/login");
  });
});
