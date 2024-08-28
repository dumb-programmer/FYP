import request from "supertest";
import app from "../app";
import { Readable } from "stream";
import { RunnableSequence } from "@langchain/core/runnables";
import { getSocketFromUserId } from "../socket";


jest.mock("@langchain/core/runnables", () => {
    const actual = jest.requireActual("@langchain/core/runnables");

    return {
        ...actual,
        RunnableSequence: {
            from: jest.fn().mockImplementation(() => ({
                stream: () => {
                    const stream = new Readable({
                        read() {
                            this.push("response");
                            this.push(null);
                        }
                    })

                    return stream;
                }
            }))
        }
    }
});

let socketOn = jest.fn();
let socketEmit = jest.fn();

jest.mock("../socket.ts", () => {
    const actual = jest.requireActual("../socket.ts");

    return {
        ...actual,
        getSocketFromUserId: jest.fn().mockImplementation(() => {
            return {
                on: socketOn,
                emit: socketEmit
            }
        })
    }
})

describe("/chats/:chatId", () => {
    it("POST is protected, requires login", async () => {
        const response = await request(app).post("/chats/123");

        expect(response.status).toEqual(401);
    });

    it("POST validates chatId in URL", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });
        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/chats/123").set("Cookie", cookie);

        expect(response.status).toEqual(400);
    });

    it("POST responds with 400 if prompt is not provided", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chat = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0];

        const response = await request(app).post(`/chats/${chat._id}`).set("Cookie", cookie);

        expect(response.status).toEqual(400);
        expect(response.body.errors.prompt).toEqual("Required");
    });

    it("POST responds with 400 if prompt is less than 10 characters", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chat = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0];

        const response = await request(app).post(`/chats/${chat._id}`).set("Cookie", cookie).send({ prompt: "a" });

        expect(response.status).toEqual(400);
        expect(response.body.errors.prompt).toEqual("prompt must be at least 10 character long");
    });

    it("POST responds with 200 on success", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chat = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0];

        const response = await request(app).post(`/chats/${chat._id}`).set("Cookie", cookie).send({ prompt: "Who are you?" });

        expect(response.status).toEqual(200);

        expect(RunnableSequence.from).toHaveBeenCalled();
        expect(getSocketFromUserId).toHaveBeenCalled();

        expect(socketOn).toHaveBeenCalled();

        expect(socketEmit).toHaveBeenCalled();
    });

    it("GET /messages returns a paginated list of messages", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chat = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0];

        const response = await request(app).get(`/chats/${chat._id}/messages`).set("Cookie", cookie);

        expect(response.status).toEqual(200);

        expect(response.body.messages).toHaveLength(2);
        expect(response.body.nextPage).toEqual(2);
        expect(response.body.hasMore).toBeFalsy();
    });

    it("GET /messages validates chatId in URL", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        let response = await request(app).get(`/chats/123/messages`).set("Cookie", cookie);

        expect(response.status).toEqual(400);
    });

    it("GET /messages validates the page search query", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chat = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0];

        let response = await request(app).get(`/chats/${chat._id}/messages?page=-10`).set("Cookie", cookie);

        expect(response.status).toEqual(400);

        response = await request(app).get(`/chats/${chat._id}/messages?page=abc`).set("Cookie", cookie);

        expect(response.status).toEqual(400);

        response = await request(app).get(`/chats/${chat._id}/messages?page=2`).set("Cookie", cookie);

        expect(response.status).toEqual(200);
        expect(response.body.messages).toHaveLength(0);
        expect(response.body.hasMore).toBeFalsy();
        expect(response.body.nextPage).toEqual(3);
    });

    it("GET /messages can be filtered using the query search parameter", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chat = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0];

        let response = await request(app).get(`/chats/${chat._id}/messages?query=response`).set("Cookie", cookie);

        expect(response.status).toEqual(200);
        expect(response.body.messages).toHaveLength(1);

        response = await request(app).get(`/chats/${chat._id}/messages?query=q`).set("Cookie", cookie);

        expect(response.status).toEqual(200);
        expect(response.body.messages).toHaveLength(0);
    });

    it("DELETE request validates chatId in URL", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chatId = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0]._id;

        const messageId = (await request(app).get(`/chats/${chatId}/messages`).set("Cookie", cookie)).body.messages[0]._id;

        const response = await request(app).delete(`/chats/200/messages/${messageId}`).set("Cookie", cookie);

        expect(response.status).toEqual(400);
    });

    it("DELETE request validates messageId in URL", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chatId = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0]._id;

        const response = await request(app).delete(`/chats/200/messages/123`).set("Cookie", cookie);

        expect(response.status).toEqual(400);
    });

    it("DELETE request returns 200 on success", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const chatId = (await request(app).get("/chats").set("Cookie", cookie)).body.chats[0]._id;

        const messageId = (await request(app).get(`/chats/${chatId}/messages`).set("Cookie", cookie)).body.messages[0]._id;

        const response = await request(app).delete(`/chats/${chatId}/messages/${messageId}`).set("Cookie", cookie);

        expect(response.status).toEqual(200);

        const messagesReqBody = (await request(app).get(`/chats/${chatId}/messages`).set("Cookie", cookie)).body;

        expect(messagesReqBody.messages).toHaveLength(1);
        expect(messagesReqBody.hasMore).toBeFalsy();
    });
})