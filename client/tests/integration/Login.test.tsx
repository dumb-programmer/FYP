import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import Login from "../../src/views/Login";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { login } from "../../src/api/api";


vi.mock("../../src/api/api", async () => ({ ...await vi.importActual("../../src/api/api"), login: vi.fn(() => ({ ok: true })) }))

vi.mock("react-router-dom", async () => ({ ...await vi.importActual("react-router-dom"), useNavigate: vi.fn() }))

const renderComponent = (redirect?: string) => render(
    <MemoryRouter initialEntries={[`/login${redirect ? `?redirect=${redirect}` : ""}`]}>
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    </MemoryRouter>
);

describe("Login", () => {
    it("renders correctly", () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();
    });

    it("email input works", async () => {
        renderComponent();
        const input = screen.getByLabelText(/^email$/i);

        await userEvent.type(input, "test");

        expect(input.value).toEqual("test");
    });

    it("password input works", async () => {
        renderComponent();
        const input = screen.getByLabelText(/^password$/i);

        await userEvent.type(input, "test");

        expect(input.value).toEqual("test");
    });

    it("email input is validated", async () => {
        renderComponent();
        const input = screen.getByLabelText(/^email$/i);

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^email is required/i)).toBeInTheDocument();

        await userEvent.type(input, "test");

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^invalid email/i)).toBeInTheDocument();
    });

    it("password input is validated", async () => {
        renderComponent();
        const input = screen.getByLabelText(/^password$/i);

        await userEvent.type(input, "test");

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it("login is called and user is redirected to / on submit, when all inputs are valid", async () => {
        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate);

        const EMAIL = "test@gmail.com";
        const PASSWORD = "12345678";

        renderComponent();

        await userEvent.type(screen.getByLabelText(/^email$/i), EMAIL);
        await userEvent.type(screen.getByLabelText(/^password$/i), PASSWORD);

        await userEvent.click(screen.getByRole("button"));

        expect(login).toHaveBeenCalled();
        expect(login).toHaveBeenCalledWith({ "email": EMAIL, "password": PASSWORD });

        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("login is called and user is redirected to redirect_url if present in search params on submit, when all inputs are valid", async () => {
        const EMAIL = "test@gmail.com";
        const PASSWORD = "12345678";

        renderComponent("/chat/123");

        await userEvent.type(screen.getByLabelText(/^email$/i), EMAIL);
        await userEvent.type(screen.getByLabelText(/^password$/i), PASSWORD);

        await userEvent.click(screen.getByRole("button"));

        expect(login).toHaveBeenCalled();
        expect(login).toHaveBeenCalledWith({ "email": EMAIL, "password": PASSWORD })
    });

    it("login is called and error message is shown if invalid credentials are provided", async () => {
        const mockNavigate = vi.fn();
        useNavigate.mockReturnValue(mockNavigate);

        login.mockReturnValue({});

        const EMAIL = "test@gmail.com";
        const PASSWORD = "12345678";

        renderComponent();

        await userEvent.type(screen.getByLabelText(/^email$/i), EMAIL);
        await userEvent.type(screen.getByLabelText(/^password$/i), PASSWORD);

        await userEvent.click(screen.getByRole("button"));

        expect(login).toHaveBeenCalled();
        expect(login).toHaveBeenCalledWith({ "email": EMAIL, "password": PASSWORD });

        expect(screen.getByText(/^invalid credentials$/i)).toBeInTheDocument();
    });
})