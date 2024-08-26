import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import ChatLink from "../../src/components/ChatLink";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { deleteChat } from "../../src/api/api";

vi.mock("../../src/api/api.ts", async () => ({ ...await vi.importActual("../../src/api/api"), deleteChat: vi.fn().mockReturnValue({ ok: true }) }))

const chatId = "123";
const chat = { _id: chatId, name: "chat" };
const mockRefetch = vi.fn();
const renderComponent = () => render(<MemoryRouter><ChatLink chat={chat} refetch={mockRefetch} /></MemoryRouter>);

describe("ChatLink", () => {
    beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn(function () {
            this.style.display = 'block';
            this.setAttribute('open', '');
        });

        HTMLDialogElement.prototype.close = vi.fn(function () {
            this.style.display = 'none';
            this.removeAttribute('open');
        });
    });

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("renders correctly", () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();
    });

    it("clicking on dropdown button opens the dropdown with rename and edit buttons", async () => {
        renderComponent();

        const dropdown = screen.getByTestId("chat-actions-dropdown")

        await userEvent.click(dropdown);

        expect(screen.getByRole("button", { name: /rename/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("rename button opens the EditChatForm", async () => {
        renderComponent();

        const dropdown = screen.getByTestId("chat-actions-dropdown")

        await userEvent.click(dropdown);

        await userEvent.click(screen.getByRole("button", { name: /rename/i }));

        const input = screen.getByRole("textbox");
        const saveBtn = screen.getByRole("button", { name: /submit/i });
        const cancelBtn = screen.getByRole("button", { name: /cancel/i });

        expect(input).toBeInTheDocument();
        expect(input.value).toEqual(chat.name);
        expect(saveBtn).toBeInTheDocument();
        expect(cancelBtn).toBeInTheDocument();
    });

    it("delete button opens the DeleteConfirmationModal", async () => {
        renderComponent();

        const dropdown = screen.getByTestId("chat-actions-dropdown")

        await userEvent.click(dropdown);

        await userEvent.click(screen.getByRole("button", { name: /delete/i }));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("delete button onDelete calls the deleteChat function and refetches the chats", async () => {
        renderComponent();

        const dropdown = screen.getByTestId("chat-actions-dropdown")

        await userEvent.click(dropdown);

        await userEvent.click(screen.getByRole("button", { name: /delete/i }));

        expect(screen.getByRole("dialog")).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("delete-confirmation-dialog-delete-btn"))

        expect(deleteChat).toHaveBeenCalled();
        expect(deleteChat).toHaveBeenCalledWith(chat._id);
        expect(mockRefetch).toHaveBeenCalled();
    });

    it("delete button onCancel closes the DeleteConfirmationModal", async () => {
        renderComponent();

        const dropdown = screen.getByTestId("chat-actions-dropdown")

        await userEvent.click(dropdown);

        await userEvent.click(screen.getByRole("button", { name: /delete/i }));

        expect(screen.getByRole("dialog")).toBeVisible();

        await userEvent.click(screen.getByTestId("delete-confirmation-dialog-cancel-btn"));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
})