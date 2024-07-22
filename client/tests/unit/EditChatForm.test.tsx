import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import EditChatForm from "../../src/components/EditChatForm";
import userEvent from "@testing-library/user-event";
import { updateChat } from "../../src/api/api";


vi.mock("../../src/api/api.ts", async () => ({ ...await vi.importActual("../../src/api/api.ts"), updateChat: vi.fn().mockReturnValue({ ok: true }) }))

const chat = { _id: crypto.randomUUID(), name: "test" }
const mockRefetch = vi.fn();
const mockOnCancel = vi.fn();
const renderComponent = () => render(<EditChatForm chat={chat} refetch={mockRefetch} onCancel={mockOnCancel} />);

describe("EditChatForm", () => {
    it("renders correctly", () => {
        renderComponent();

        const component = screen.getByTestId("edit-chat-form");

        expect(component).toMatchSnapshot();
    });

    it("input is populated with chat name by default", () => {
        renderComponent();

        const input = screen.getByRole("textbox");

        expect(input.value).toEqual(chat.name);
    });

    it("input works", async () => {
        renderComponent();

        const input = screen.getByRole("textbox");

        await userEvent.clear(input);
        await userEvent.type(input, "new chat");

        expect(input.value).toEqual("new chat");
    });

    it("onCancel is called on cancel button click", async () => {
        renderComponent();

        const cancelBtn = screen.getAllByRole("button")[0];

        await userEvent.click(cancelBtn);

        expect(mockOnCancel).toHaveBeenCalled();
    });

    it("chat is updated on submit", async () => {
        renderComponent();

        const input = screen.getByRole("textbox");

        await userEvent.clear(input);
        await userEvent.type(input, "new chat");

        const submitBtn = screen.getAllByRole("button")[1];

        await userEvent.click(submitBtn);

        expect(updateChat).toHaveBeenCalled();
        expect(updateChat).toHaveBeenCalledWith(chat._id, "new chat");

        expect(mockRefetch).toHaveBeenCalled();
    });
})