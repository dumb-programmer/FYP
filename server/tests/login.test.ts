import request from "supertest";
import app from "../app";

describe("/login", () => {
    it("POST request to the endpoint without any data responds with 400", async () => {
        const response = await request(app).post("/login");

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.email).toEqual("Required");
        expect(response.body.errors.password).toEqual("Required");


    });

    it("POST request to the endpoint requires valid email", async () => {
        const response = await request(app).post("/login").send({ email: "test" });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.email).toEqual("Invalid email");
        expect(response.body.errors.password).toEqual("Required");

    });

    it("POST request to the endpoint password must be at least 8 characters", async () => {
        const response = await request(app).post("/login").send({ email: "test@gmail.com", password: "123" });

        expect(response.status).toEqual(400);
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body.errors).not.toBeNull();
        expect(response.body.errors.password).toEqual("password must be at least 8 characters long");

    });

    it("POST request to the endpoint with valid email, and password, if the user doesn't exists, responds with 401", async () => {
        const response = await request(app).post("/login").send({ email: "test@gmail.com", password: "12345678" });

        expect(response.status).toEqual(401);

    });

    it("POST request to a user which exists, incorrect password error is shown", async () => {
        const response = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345677" });

        expect(response.status).toEqual(401);

    });

    it("POST request to a user which exists, with correct credentials, sets a session cookie", async () => {
        const response = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        expect(response.status).toEqual(200);
    });
})