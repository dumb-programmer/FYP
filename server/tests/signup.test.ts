import request from "supertest";
import app from "../app";
import User from "../models/user";

describe("/login", () => {
    it("without any data responds with 400", async () => {
        const response = await request(app).post("/signup");

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.email).toEqual("Required");
        expect(response.body.errors.password).toEqual("Required");
        expect(response.body.errors.firstName).toEqual("Required");
        expect(response.body.errors.lastName).toEqual("Required");
    });

    it("email must be valid email", async () => {
        const response = await request(app).post("/signup").send({ email: "test" });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.email).toEqual("Invalid email");
    });

    it("password must be at least 8 characters", async () => {
        const response = await request(app).post("/signup").send({ password: "test" });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.password).toEqual("password must be at least 8 characters long");
    });

    it("firstName must be at least 1 character", async () => {
        const response = await request(app).post("/signup").send({ firstName: "" });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.firstName).toEqual("firstName must be at least 1 characters long");
    });

    it("firstName can be at most 100 character", async () => {
        const response = await request(app).post("/signup").send({ firstName: Array.from({ length: 102 }).join("a") });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.firstName).toEqual("firstName cannot be greater than 100 characters");
    });

    it("lastName must be at least 1 character", async () => {
        const response = await request(app).post("/signup").send({ lastName: "" });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.lastName).toEqual("lastName must be at least 1 characters long");
    });

    it("lastName can be at most 100 character", async () => {
        const response = await request(app).post("/signup").send({ lastName: Array.from({ length: 102 }).join("a") });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.lastName).toEqual("lastName cannot be greater than 100 characters");
    });

    it("responds with 409 if a user with an email already exists", async () => {
        const response = await request(app).post("/signup").send({ email: "john@gmail.com", password: "12345678", firstName: "a", lastName: "b" });

        expect(response.status).toEqual(409);
    });

    it("responds with 201 when a user is successfully created", async () => {
        const response = await request(app).post("/signup").send({ email: "test@gmail.com", password: "12345678", firstName: "a", lastName: "b" });

        expect(response.status).toEqual(201);
    })
})