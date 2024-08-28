import request from "supertest";
import app from "../app";
import { ChromaClient } from "chromadb";
import { PDFDocument } from "pdf-lib";

describe("/chat", () => {
    it("is protected, requires login", async () => {
        const response = await request(app).post("/chats");

        expect(response.status).toEqual(401);
    });

    it("responds with 400 if valid document is not provided", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/chats").set("Cookie", cookie);

        expect(response.status).toEqual(400);
        expect(response.body.error.document).toEqual("Required");
    });

    it("responds with 400 if valid name is not provided", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const document = new File([], "document.pdf", { type: "application/pdf" })

        const response = await request(app).post("/chats").set("Cookie", cookie).attach("document", Buffer.from(await document.arrayBuffer()), "document.pdf");

        expect(response.status).toEqual(400);
        expect(response.body.errors.name).toEqual("Required");
    });

    it("name field must be at least 1 character", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const document = new File([], "document.pdf", { type: "application/pdf" })

        const response = await request(app).post("/chats").set("Cookie", cookie).field("name", "").attach("document", Buffer.from(await document.arrayBuffer()), "document.pdf");

        expect(response.status).toEqual(400);
        expect(response.body.errors.name).toEqual("name must be at least 1 character long");
    });

    it("name field cannot be greater than 100 characters", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const document = new File([], "document.pdf", { type: "application/pdf" })

        const response = await request(app).post("/chats").set("Cookie", cookie).field("name", Array.from({ length: 102 }).join("a")).attach("document", Buffer.from(await document.arrayBuffer()), "document.pdf");

        expect(response.status).toEqual(400);
        expect(response.body.errors.name).toEqual("name cannot be greater than 100 characters");
    });

    let chatId: string;

    it("responds with 201 on chat creation", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const pdfDoc = await PDFDocument.create();
        pdfDoc.addPage();
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const document = new File([pdfBlob], 'dummy-document.pdf', { type: 'application/pdf' });

        const response = await request(app).post("/chats").set("Cookie", cookie).field("name", "test").attach("document", Buffer.from(await document.arrayBuffer()), "document.pdf");

        expect(response.status).toEqual(201);

        chatId = response.body._id;

        const client = new ChromaClient();

        client.deleteCollection({ name: response.body.index });
    });

    it("can fetch chats list", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];
        const response = await request(app).get("/chats").set("Cookie", cookie);

        expect(response.status).toEqual(200);
        expect(response.body.chats[0].name).toEqual("test");
    });

    it("fetch chats list pagination is validated", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];
        let response = await request(app).get("/chats?page=abc").set("Cookie", cookie);

        expect(response.status).toEqual(400);

        response = await request(app).get("/chats?page=-10").set("Cookie", cookie);

        expect(response.status).toEqual(400);
    });

    it("fetch chats list is paginated", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];
        const response = await request(app).get("/chats?page=2").set("Cookie", cookie);

        expect(response.status).toEqual(200);
        expect(response.body.nextPage).toEqual(3);
    });

    it("update chat name route is validated", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        let response = await request(app).patch(`/chats/${chatId}`).set("Cookie", cookie).send({ name: "" });

        expect(response.status).toEqual(400);
        expect(response.body.errors.name).toEqual("name must be at least 1 character long");


        response = await request(app).patch(`/chats/${chatId}`).set("Cookie", cookie).send({ name: Array.from({ length: 102 }).join("a") });

        expect(response.status).toEqual(400);
        expect(response.body.errors.name).toEqual("name cannot be greater than 100 characters");

    });

    it("can update chat only accepts valid ObjectId", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        let response = await request(app).patch(`/chats/123`).set("Cookie", cookie);

        expect(response.status).toEqual(400);
    });

    it("can update chat name", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        let response = await request(app).patch(`/chats/${chatId}`).set("Cookie", cookie).send({ name: "test10" });

        expect(response.status).toEqual(200);

        response = await request(app).get("/chats").set("Cookie", cookie);

        expect(response.body.chats[0].name).toEqual("test10");
    });

    it("can delete chat only accepts valid ObjectId", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        let response = await request(app).delete(`/chats/123`).set("Cookie", cookie);

        expect(response.status).toEqual(400);
    });

    it("can delete chat", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        let response = await request(app).delete(`/chats/${chatId}`).set("Cookie", cookie);

        expect(response.status).toEqual(200);

        response = await request(app).get("/chats").set("Cookie", cookie);

        expect(response.body.chats.length).toEqual(0);
    });

})