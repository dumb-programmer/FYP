import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import MessageList from "../../src/components/MessageList";
import { deleteMessage } from "../../src/api/api";
import userEvent from "@testing-library/user-event";

const chatId = crypto.randomUUID()
vi.mock("react-router-dom", async () => ({
    ... await vi.importActual("react-router-dom"),
    useParams: () => ({ chatId })
}));

vi.mock("../../src/api/api.ts", async () => ({
    ...await vi.importActual("../../src/api/api.ts"),
    deleteMessage: vi.fn().mockReturnValue({ ok: true })
}));

const messages = [
    { _id: crypto.randomUUID(), prompt: "A", response: "B" },
    { _id: crypto.randomUUID(), prompt: "C", response: "D" },
    { _id: crypto.randomUUID(), prompt: "E", response: "F" },
];

const mockRefetchMessages = vi.fn();

const renderComponent = () => render(<MessageList messages={messages} refetchMessages={mockRefetchMessages} />);

describe("MessageList", () => {
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
        renderComponent();

        for (const message of messages) {
            expect(screen.getByText(message.prompt)).toBeInTheDocument()
            expect(screen.getByText(message.response)).toBeInTheDocument();
        }
    });

    it("Can delete message by clicking on the delete button for the message, and then clicking delete button in the confirmation dialog", async () => {
        renderComponent();

        const deleteMsgButton = screen.getAllByTitle("delete-button")[0];

        await userEvent.click(deleteMsgButton);

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

        const deleteButton = screen.getByTestId("delete-confirmation-dialog-delete-btn");


        await userEvent.click(deleteButton);

        expect(deleteMessage).toHaveBeenCalled();
        expect(deleteMessage).toHaveBeenCalledWith(chatId, messages[0]._id);

        expect(mockRefetchMessages).toHaveBeenCalled();

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    })
})