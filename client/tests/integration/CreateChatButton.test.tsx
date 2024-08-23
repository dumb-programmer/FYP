import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import CreateChatButton from "../../src/components/CreateChatButton";
import userEvent from "@testing-library/user-event";

const renderComponent = () => render(<CreateChatButton />);

describe("CreateChatButton", () => {
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

    it("CreateChatModal is closed by default", async () => {
        renderComponent();

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("clicking on create chat button opens the dialog", async () => {
        renderComponent();

        const createChatBtn = screen.getByRole("button");

        await userEvent.click(createChatBtn);

        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
})