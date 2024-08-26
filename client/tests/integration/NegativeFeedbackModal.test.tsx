import React, { useRef } from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import NegativeFeedbackModal from "../../src/components/NegativeFeedbackModal";
import userEvent from "@testing-library/user-event";
import { sendFeedback } from "../../src/api/api";

vi.mock("../../src/api/api", async () => ({ ...await vi.importActual("../../src/api/api"), sendFeedback: vi.fn() }))

const messageId = "abc";
const onSuccessMock = vi.fn();
const onCancelMock = vi.fn();

const WrapperComponent = () => {
    const ref = useRef<HTMLDialogElement | null>(null);

    return <NegativeFeedbackModal dialogRef={ref} messageId={messageId} onSuccess={onSuccessMock} onCancel={onCancelMock} />
}

const renderComponent = () => render(<WrapperComponent />);

describe("NegativeFeedbackModal", () => {
    it("renders correctly", () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();
    });

    it("modal is closed by default", () => {
        renderComponent();

        const dialog = screen.queryByRole("dialog");

        expect(dialog).not.toBeInTheDocument();
    });

    it("cancel button works", async () => {
        const { container } = renderComponent();

        const dialog = container.querySelector("dialog");

        dialog?.setAttribute("open", "");

        const cancelBtn = screen.getByRole("button", { name: /cancel/i });

        await userEvent.click(cancelBtn);

        expect(onCancelMock).toHaveBeenCalled();
    });

    it("form submission works", async () => {
        sendFeedback.mockReturnValue({ ok: true });

        const { container } = renderComponent();

        const dialog = container.querySelector("dialog");

        dialog?.setAttribute("open", "");

        await userEvent.type(screen.getByRole("textbox"), "hello");

        await userEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(sendFeedback).toHaveBeenCalled();
        expect(sendFeedback).toHaveBeenCalledWith({ category: "offensive/unsafe", comments: "hello", messageId, type: "negative" });
        expect(onSuccessMock).toHaveBeenCalled();
    });
});