import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Message from "../models/message";

describe("/feedback", () => {
    it("POST is protected, requires login", async () => {
        const response = await request(app).post("/feedback");

        expect(response.status).toEqual(401);
    });

    it("POST is validated", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/feedback").set("Cookie", cookie);

        expect(response.status).toEqual(400);
        expect(response.body.errors.type).toEqual("Required");
        expect(response.body.errors.comments).toEqual("Required");
        expect(response.body.errors.category).toEqual("Required");
        expect(response.body.errors.messageId).toEqual("Required");
    });

    it("POST makes sure type is only positive or negative", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/feedback").set("Cookie", cookie).send({ type: "test" });

        expect(response.status).toEqual(400);
        expect(response.body.errors.type).toEqual("Invalid enum value. Expected 'positive' | 'negative', received 'test'");
    });

    it("POST comments cannot be greater than 500 characters", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/feedback").set("Cookie", cookie).send({ comments: Array.from({ length: 502 }).join("a") });

        expect(response.status).toEqual(400);
        expect(response.body.errors.comments).toEqual("comments cannot be greater than 500 characters");
    });

    it("POST category cannot be other than 'correct', 'easy-to-understand', 'complete', 'other' for type 'positive'", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/feedback").set("Cookie", cookie).send({ type: "positive", category: "test", comments: "", messageId: new mongoose.Types.ObjectId() });

        expect(response.status).toEqual(400);
        expect(response.body.errors.category).toEqual('Invalid category "test" for type "positive".');
    });

    it("POST category cannot be other than 'offensive/unsafe', 'not-factually-correct', 'other' for type negative", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/feedback").set("Cookie", cookie).send({ type: "negative", category: "test", comments: "", messageId: new mongoose.Types.ObjectId() });

        expect(response.status).toEqual(400);
        expect(response.body.errors.category).toEqual('Invalid category "test" for type "negative".');
    });

    it("POST responds with 404 for a message id which doesn't exists", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).post("/feedback").set("Cookie", cookie).send({ type: "negative", category: "other", comments: "test", messageId: new mongoose.Types.ObjectId() });

        expect(response.status).toEqual(404);
    });

    it("POST responds with 200 for valid data", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const messageId = (await Message.findOne())?._id;

        const response = await request(app).post("/feedback").set("Cookie", cookie).send({ type: "negative", category: "other", comments: "test", messageId });

        expect(response.status).toEqual(201);
    });

    it("POST responds with 409, if feedback has already been submitted for a message", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const messageId = (await Message.findOne())?._id;

        const response = await request(app).post("/feedback").set("Cookie", cookie).send({ type: "negative", category: "other", comments: "test", messageId });

        expect(response.status).toEqual(409);
    });

    it("GET responds with 401 for non-admin users", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).get(`/feedback`).set("Cookie", cookie);

        expect(response.status).toEqual(401);
    });

    it("GET responds with 200 for admin users", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).get(`/feedback`).set("Cookie", cookie);

        expect(response.status).toEqual(200);
        expect(response.body.rows).toHaveLength(1);
        expect(response.body.nextPage).toEqual(2);
        expect(response.body.hasMore).toEqual(false);
        expect(response.body.total).toEqual(1);
    });
})