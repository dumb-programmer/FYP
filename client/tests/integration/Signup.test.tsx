import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import Signup from "../../src/views/Signup";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { signup } from "../../src/api/api";

vi.mock("../../src/api/api", async () => ({ ... await vi.importActual("../../src/api/api"), signup: vi.fn(() => ({ status: 201 })) }))

const renderComponent = () => render(
    <MemoryRouter>
        <Signup />
    </MemoryRouter>
);

describe("Signup", () => {
    it("renders correctly", () => {
        const { container } = renderComponent();
        expect(container).toMatchSnapshot();
    });

    it("firstName input works", async () => {
        renderComponent();

        const input = screen.getByLabelText(/^first name$/i);

        await userEvent.type(input, "test");

        expect(input.value).toEqual("test");
    });

    it("lastName input works", async () => {
        renderComponent();

        const input = screen.getByLabelText(/^last name$/i);

        await userEvent.type(input, "test");

        expect(input.value).toEqual("test");
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

    it("confirmPassword input works", async () => {
        renderComponent();

        const input = screen.getByLabelText(/^confirm password$/i);

        await userEvent.type(input, "test");

        expect(input.value).toEqual("test");
    });

    it("firstName is validated", async () => {
        renderComponent();

        const input = screen.getByLabelText(/^first name$/i);

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^first name is required/i)).toBeInTheDocument();

        await userEvent.type(input, Array.from({ length: 200 }).map(() => "a").join(""))

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^first name must be 100 characters or fewer/i)).toBeInTheDocument();
    });

    it("lastName is validated", async () => {
        renderComponent();

        const input = screen.getByLabelText(/^last name$/i);

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^last name is required/i)).toBeInTheDocument();

        await userEvent.type(input, Array.from({ length: 200 }).map(() => "a").join(""))

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^last name must be 100 characters or fewer/i)).toBeInTheDocument();
    });

    it("email is validated", async () => {
        renderComponent();

        const input = screen.getByLabelText(/^email$/i);

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^email is required/i)).toBeInTheDocument();

        await userEvent.type(input, "test");

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^invalid email/i)).toBeInTheDocument();
    });

    it("password is validated", async () => {
        renderComponent();

        const input = screen.getByLabelText(/^password$/i);

        await userEvent.type(input, "test");

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it("confirmPassword is validated", async () => {
        renderComponent();

        const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^confirm password must be at least 8 characters/i)).toBeInTheDocument();

        const passwordInput = screen.getByLabelText(/^password$/i);

        await userEvent.type(passwordInput, "test1234");

        await userEvent.type(confirmPasswordInput, "test1235");

        await userEvent.click(screen.getByRole("button"));

        expect(screen.getByText(/^passwords must match/i)).toBeInTheDocument();
    });

    it("signup is called, if all the inputs are valid", async () => {
        renderComponent();

        const FIRST_NAME = "lorem";
        const LAST_NAME = "epsum"
        const EMAIL = "test@gmail.com";
        const PASSWORD = "12345678";

        await userEvent.type(screen.getByLabelText(/^first name$/i), FIRST_NAME);
        await userEvent.type(screen.getByLabelText(/^last name$/i), LAST_NAME);
        await userEvent.type(screen.getByLabelText(/^email$/i), EMAIL);
        await userEvent.type(screen.getByLabelText(/^password$/i), PASSWORD);
        await userEvent.type(screen.getByLabelText(/^confirm password$/i), PASSWORD);

        await userEvent.click(screen.getByRole("button"));

        expect(signup).toHaveBeenCalled();
    });

    it("On status 409 email is already taken error is shown", async () => {
        signup.mockReturnValue({status:409})

        renderComponent();

        const FIRST_NAME = "lorem";
        const LAST_NAME = "epsum"
        const EMAIL = "test@gmail.com";
        const PASSWORD = "12345678";

        await userEvent.type(screen.getByLabelText(/^first name$/i), FIRST_NAME);
        await userEvent.type(screen.getByLabelText(/^last name$/i), LAST_NAME);
        await userEvent.type(screen.getByLabelText(/^email$/i), EMAIL);
        await userEvent.type(screen.getByLabelText(/^password$/i), PASSWORD);
        await userEvent.type(screen.getByLabelText(/^confirm password$/i), PASSWORD);

        await userEvent.click(screen.getByRole("button"));

        expect(signup).toHaveBeenCalled();

        expect(screen.getByText(/^a user with this email already exists/i))
    })
})