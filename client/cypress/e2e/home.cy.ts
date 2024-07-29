describe("/", () => {
  let loggedOut = false;
  let chats = [];

  beforeEach(() => {
    cy.fixture("user.json").then((userData) => {
      cy.intercept("http://localhost:3000/user", {
        statusCode: !loggedOut ? 200 : 403,
        body: !loggedOut ? userData : {},
      }).as("userRequest");

      cy.intercept("GET", "http://localhost:3000/chats**", (req) => {
        req.reply({
          statusCode: 200,
          body: { chats, hasMore: false },
        });
      }).as("fetchChatsRequest");

      cy.intercept("POST", "http://localhost:3000/chats", (req) => {
        const boundary = req.headers["content-type"].split("boundary=")[1];
        const body = req.body;
        const parts = body.split(`--${boundary}`);

        let name;

        parts.forEach((part) => {
          if (part.includes('name="name"')) {
            name = part.split("\r\n\r\n")[1].trim();
          }
        });

        chats.push({ id: 1, name });

        req.reply({
          statusCode: 200,
          body: {},
        });
      }).as("createChatRequest");

      cy.intercept("GET", "/socket.io/*", {
        statusCode: 200,
        body: {},
      }).as("socketRequests");

      cy.intercept("POST", "http://localhost:3000/logout", (req) => {
        loggedOut = true;

        req.reply({
          statusCode: 200,
          body: {},
        });
      }).as("logoutRequest");
    });

    cy.visit("/");
  });

  it("renders", () => {
    cy.get("[data-testid='welcome-heading']").should("have.text", "Welcome");
  });

  describe("create chat modal", () => {
    beforeEach(() => {
      cy.get("[data-testid='create-chat-btn'").click();
    });

    it("create chat modal opens on button click", () => {
      cy.get("dialog").should("be.visible").and("have.attr", "open");
    });

    it("closes the create chat modal", () => {
      cy.get("dialog").within(() => {
        cy.get("button").contains("Cancel").click();
      });

      cy.get("dialog").should("not.have.attr", "open");
    });

    it("fills and submits the create chat form", () => {
      cy.get("#name").type("Test Chat");
      cy.get("#document").selectFile("cypress/fixtures/document.txt");

      cy.get("button[type='submit']").click();

      cy.wait("@createChatRequest");
      cy.wait("@fetchChatsRequest");

      cy.get("dialog").should("not.have.attr", "open");

      cy.get("a").first().should("contain.text", "Test Chat");
    });
  });

  describe("chat links", () => {
    let chats = [];

    beforeEach(() => {
      cy.fixture("chats").then((fixtureChats) => {
        chats = fixtureChats;
        cy.intercept("GET", "http://localhost:3000/chats**", (req) => {
          req.reply({
            statusCode: 200,
            body: { chats, hasMore: false },
          });
        }).as("fetchChatsRequest");

        cy.intercept("PATCH", "http://localhost:3000/chats/*", (req) => {
          const { body } = req;
          const chatIndex = chats.findIndex(
            (chat) => chat._id === req.url.split("/").pop()
          );
          if (chatIndex !== -1) {
            chats[chatIndex].name = body.name;
          }
          req.reply({
            statusCode: 200,
          });
        }).as("updateChatRequest");

        cy.intercept("DELETE", "http://localhost:3000/chats/*", (req) => {
          chats = chats.filter((chat) => chat._id !== req.url.split("/").pop());
          req.reply({
            statusCode: 200,
          });
        }).as("deleteChatRequest");
      });
    });

    it("renders", () => {
      cy.wait("@fetchChatsRequest");

      cy.get("a")
        .should("have.length", 5)
        .each((chatLink, index) => {
          cy.wrap(chatLink).should("contain.text", `Chat ${index + 1}`);
        });
    });

    it("can open chat actions dropdown", () => {
      cy.wait("@fetchChatsRequest");

      cy.get("[data-testid='open-chat-actions-dropdown-btn']").first().click();

      cy.get("[data-testid='chat-actions-dropdown']")
        .first()
        .should("be.visible");
      cy.get("body").click(0, 0);
      cy.get("[data-testid='chat-actions-dropdown']")
        .first()
        .should("not.be.visible");
    });

    it("can edit chat", () => {
      cy.wait("@fetchChatsRequest");

      cy.get("[data-testid='open-chat-actions-dropdown-btn']").first().click();

      cy.get("[data-testid='chat-actions-dropdown']")
        .first()
        .within(() => {
          cy.get("button").first().click();
        });

      cy.get("[data-testid='edit-chat-form']").should("be.visible");

      cy.get("[data-testid='edit-chat-form'").within(() => {
        cy.get("input").clear();
        cy.get("input").type("Chat 100");
        cy.get("button").last().click();
        cy.wait("@updateChatRequest");
      });

      cy.wait("@fetchChatsRequest");

      cy.get("a").first().should("contain.text", "Chat 100");
    });

    it("can delete chat", () => {
      cy.wait("@fetchChatsRequest");

      cy.get("[data-testid='open-chat-actions-dropdown-btn']").first().click();

      cy.get("[data-testid='chat-actions-dropdown']")
        .first()
        .within(() => {
          cy.get("button").last().click();
        });

      cy.get("dialog[open='']")
        .first()
        .within(() => {
          cy.get("button").last().click();
        });

      cy.wait("@deleteChatRequest");
      cy.wait("@fetchChatsRequest");

      cy.get("a").first().should("not.contain.text", "Chat 1");
    });

    it("navigates to chat url on click", () => {
      cy.wait("@fetchChatsRequest");

      cy.get("a").first().click();
      cy.url().should("include", "/1");
    });

    it("pagination works", () => {
      const chats = {
        "1": [
          { id: "1", name: "Chat 1" },
          { id: "2", name: "Chat 2" },
          { id: "3", name: "Chat 3" },
          { id: "4", name: "Chat 4" },
          { id: "5", name: "Chat 5" },
        ],
        "2": [
          { id: "6", name: "Chat 6" },
          { id: "7", name: "Chat 7" },
          { id: "8", name: "Chat 8" },
          { id: "9", name: "Chat 9" },
          { id: "10", name: "Chat 10" },
        ],
      };

      cy.intercept("GET", "http://localhost:3000/chats**", (req) => {
        const page = req.url.split("?").pop()?.split("=").pop();

        const chats_page = chats[`${page}`];

        req.reply({
          statusCode: 200,
          body: {
            chats: chats_page,
            nextPage: +page + 1,
            hasMore: +page < 2,
          },
        });
      }).as("fetchPaginatedChatsRequest");

      cy.wait("@fetchPaginatedChatsRequest");

      cy.get("a").should("have.length", 5);

      cy.get("a")
        .should("have.length", 5)
        .each((chatLink, index) => {
          cy.wrap(chatLink).should("contain.text", `Chat ${index + 1}`);
        });

      cy.get("[data-testid='load-more-chats-btn']").click();

      cy.get("a").should("have.length", 10);
    });
  });

  // it("logout button works", () => {
  //   cy.get("[title='logout'").click();
  //   cy.wait("@logoutRequest");
  //   // The user is redirected to /login on logout
  //   cy.get("h1").should("have.text", "Login");
  //   cy.url().should("include", "/login");
  // });
});
