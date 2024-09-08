import request from "supertest";
import app from "../app";
import User from "../models/user";

describe("/users", () => {
    it("GET is protected, requires login", async () => {
        const response = await request(app).get("/users");

        expect(response.status).toEqual(401);
    });

    it("GET cannot be accessed by non-admin users", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).get("/users").set("Cookie", cookie);

        expect(response.status).toEqual(401);
    });

    it("GET can be accessed by admins", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).get("/users").set("Cookie", cookie)

        expect(response.status).toEqual(200);
        expect(response.body.rows).toHaveLength(1);
        expect(response.body.nextPage).toEqual(2);
        expect(response.body.hasMore).toBeFalsy();
    });

    it("PUT /users/:userId/block is protected", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).put("/users/123/block").set("Cookie", cookie);

        expect(response.status).toEqual(401);
    });

    it("PUT /users/:userId/block can only be accessed admins, and is validated", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).put("/users/123/block").set("Cookie", cookie);

        expect(response.status).toEqual(400);
        expect(response.body.errors.userId).toEqual("Invalid ObjectId");
    });

    it("PUT /users/:userId/block returns 404 for non-existent user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).put("/users/651179a6e3d6f8710f7b1a34/block").set("Cookie", cookie);

        expect(response.status).toEqual(404);
    });

    it("PUT /users/:userId/block returns 404 for an admin user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const adminId = (await User.findOne({ email: "admin@gmail.com" }))?._id;

        const response = await request(app).put(`/users/${adminId}/block`).set("Cookie", cookie);

        expect(response.status).toEqual(404);
    });

    it("PUT /users/:userId/block returns 200 for a valid, non-admin user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const userId = (await User.findOne({ isAdmin: { $ne: true } }))?._id;

        const response = await request(app).put(`/users/${userId}/block`).set("Cookie", cookie);

        expect(response.status).toEqual(200);

        const user = await User.findOne({ _id: userId });

        expect(user?.isBlocked).toBeTruthy();
    });

    it("PUT /users/:userId/unblock is protected", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).put("/users/123/unblock").set("Cookie", cookie);

        expect(response.status).toEqual(401);
    });

    it("PUT /users/:userId/unblock can only be accessed admins, and is validated", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).put("/users/123/unblock").set("Cookie", cookie);

        expect(response.status).toEqual(400);
        expect(response.body.errors.userId).toEqual("Invalid ObjectId");
    });

    it("PUT /users/:userId/unblock returns 404 for non-existent user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).put("/users/651179a6e3d6f8710f7b1a34/unblock").set("Cookie", cookie);

        expect(response.status).toEqual(404);
    });

    it("PUT /users/:userId/unblock returns 404 for an admin user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const adminId = (await User.findOne({ email: "admin@gmail.com" }))?._id;

        const response = await request(app).put(`/users/${adminId}/unblock`).set("Cookie", cookie);

        expect(response.status).toEqual(404);
    });

    it("PUT /users/:userId/unblock returns 200 for a valid, non-admin user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        let user = await User.findOne({ isAdmin: { $ne: true } });

        expect(user?.isBlocked).toBeTruthy();

        const response = await request(app).put(`/users/${user?._id}/unblock`).set("Cookie", cookie);

        expect(response.status).toEqual(200);

        user = await User.findOne({ _id: user?._id });

        expect(user?.isBlocked).toBeFalsy();
    });

    it("DELETE /users/:userId is protected", async () => {
        const response = await request(app).delete(`/users/123`);

        expect(response.status).toEqual(401);
    });

    it("DELETE /users/:userId cannot be accessed by non-admin users", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "john@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).delete(`/users/123`).set("Cookie", cookie);

        expect(response.status).toEqual(401);
    });

    it("DELETE /users/:userId can be accessed by admins, and is validated", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).delete(`/users/123`).set("Cookie", cookie);

        expect(response.status).toEqual(400);
        expect(response.body.errors.userId).toEqual("Invalid ObjectId");
    });

    it("DELETE /users/:userId returns 404 for a non-existent user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const response = await request(app).delete(`/users/651179a6e3d6f8710f7b1a34`).set("Cookie", cookie);

        expect(response.status).toEqual(404);
    });

    it("DELETE /users/:userId returns 404 for an admin user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const adminId = (await User.findOne({ isAdmin: true }))?._id;

        const response = await request(app).delete(`/users/${adminId}`).set("Cookie", cookie);

        expect(response.status).toEqual(404);
    });

    it("DELETE /users/:userId returns 200 for an existent, non-admin user", async () => {
        const loginResponse = await request(app).post("/login").send({ email: "admin@gmail.com", password: "12345678" });

        const cookie = loginResponse.headers["set-cookie"][0];

        const userId = (await User.findOne({ isAdmin: { $ne: true } }))?._id;

        const response = await request(app).delete(`/users/${userId}`).set("Cookie", cookie);

        expect(response.status).toEqual(200);

        const user = await User.findOne({ _id: userId });

        expect(user).toBeNull();
    });
});