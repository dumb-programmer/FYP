import React, { useRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import CreateChatModal from "../../src/components/CreateChatModal";
import userEvent from "@testing-library/user-event";
import { createChat } from "../../src/api/api";

vi.mock("../../src/api/api.ts")

const mockRefetch = vi.fn();

const CreateChatModalWrapper = () => {
    const ref = useRef<HTMLDialogElement | null>(null);

    return <CreateChatModal dialogRef={ref} refetch={mockRefetch} />;
};

const renderComponent = () => {
    const renderResult = render(<CreateChatModalWrapper />)

    renderResult.container.querySelector("dialog")?.showModal();

    return renderResult;
};

describe("CreateChatModal", () => {
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

        const modal = screen.getByRole("dialog");

        expect(modal).toMatchSnapshot();
    });

    it("name input works", async () => {
        renderComponent();

        const nameInput = screen.getByRole("textbox");

        await userEvent.type(nameInput, "chat");

        expect(nameInput.value).toEqual("chat");
    });

    it("file input works", async () => {
        renderComponent();

        const fileInput = screen.getByLabelText(/document/i);

        const file = new File(["content"], "chat.pdf", { type: "application/pdf" })

        await userEvent.upload(fileInput, file);

        expect(fileInput.files[0]).toEqual(file);
        expect(fileInput.files).toHaveLength(1);
    });

    it("name input is required", () => {
        renderComponent();

        const nameInput = screen.getByRole("textbox");

        expect(nameInput).toBeRequired();
    });

    it("file input is required", () => {
        renderComponent();

        const fileInput = screen.getByLabelText(/document/i);

        expect(fileInput).toBeRequired();
    });

    it("cancel button closes the modal", async () => {
        renderComponent();

        const cancelBtn = screen.getByRole("button", { name: /cancel/i });

        await userEvent.click(cancelBtn);

        const dialog = screen.queryByRole("dialog");

        expect(dialog).toBeNull();
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("submit button creates a new chat and closes the modal", async () => {
        createChat.mockReturnValue({ ok: true });

        const { container } = renderComponent();

        const nameInput = screen.getByRole("textbox");

        await userEvent.type(nameInput, "chat");

        const fileInput = screen.getByLabelText(/document/i);

        const file = new File(["content"], "chat.pdf", { type: "application/pdf" })

        await userEvent.upload(fileInput, file);

        fireEvent.submit(container.querySelector("#create-chat-form"));

        const formData = new FormData();
        formData.set("name", "chat");
        formData.set("document", file);

        await waitFor(() => {
            expect(createChat).toHaveBeenCalled();
            expect(createChat).toHaveBeenCalledWith(formData);
            expect(mockRefetch).toHaveBeenCalled();
        })
    });
})