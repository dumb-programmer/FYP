import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";
import PromptForm from "../../src/components/PromptForm";
import { sendPrompt } from "../../src/api/api";
import { useParams } from "react-router-dom";

vi.mock("react-router-dom", async () => ({
    ...await vi.importActual("react-router-dom"),
    useParams: vi.fn().mockReturnValue({
        chatId: crypto.randomUUID()
    }),
}));

const mockSocket = {
    on: vi.fn(),
    off: vi.fn(),
}

vi.mock("../../src/hooks/useSocketContext", () => ({
    default: () => mockSocket
}));

vi.mock("../../src/api/api.ts", () => ({
    ...vi.importActual("../../src/api/api.ts"),
    sendPrompt: vi.fn()
}));

const renderComponent = () => render(<PromptForm />);

describe("PromptForm", () => {
    it("renders correctly", () => {
        renderComponent();

        const promptForm = screen.getByTestId(/prompt-form/i);

        expect(promptForm).toMatchSnapshot();
    });

    it("socket listeners are called on mount and cleaned up on unmount", () => {
        const { unmount } = renderComponent();

        expect(mockSocket.on).toHaveBeenCalled();
        expect(mockSocket.on).toHaveBeenCalledWith("message-start", expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalled();
        expect(mockSocket.on).toHaveBeenCalledWith("message-stop", expect.any(Function));

        unmount()

        expect(mockSocket.off).toHaveBeenCalled();
        expect(mockSocket.off).toHaveBeenCalledWith("message-start", expect.any(Function));
        expect(mockSocket.off).toHaveBeenCalled();
        expect(mockSocket.off).toHaveBeenCalledWith("message-stop", expect.any(Function));
    });

    it("text input works", async () => {
        renderComponent();

        const textInput = screen.getByRole("textbox");

        await userEvent.type(textInput, "hello");

        expect(textInput.value).toEqual("hello");
    });

    it("sendPrompt is called on form submit", async () => {
        renderComponent();

        const textInput = screen.getByRole("textbox");
        const submitButton = screen.getByRole("button");

        await userEvent.type(textInput, "hello");

        await userEvent.click(submitButton);

        const { chatId } = useParams();

        expect(sendPrompt).toHaveBeenCalled();
        expect(sendPrompt).toHaveBeenCalledWith({ prompt: "hello" }, chatId);
    });
})