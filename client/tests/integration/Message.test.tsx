import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { expect, describe, it, vi, beforeAll, afterAll } from "vitest";
import Message from "../../src/components/Message";

const _ID = crypto.randomUUID();
const PROMPT = "Hello";
const RESPONSE = "Hi";

const onDeleteMock = vi.fn();
const onThumbsUpMock = vi.fn();
const onThumbsDownMock = vi.fn();
const renderComponent = (cursor = false, omitOnDelete = false, hasFeedback = false) => render(<Message message={{ _id: _ID, prompt: PROMPT, response: RESPONSE, feedback: hasFeedback ? { feedback: { positive: true } } : undefined }} onDelete={omitOnDelete ? undefined : onDeleteMock} onThumbsUp={onThumbsUpMock} onThumbsDown={onThumbsDownMock} cursor={cursor} />);

describe("Message", () => {

    beforeAll(() => {
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn()
            }
        })
    });

    afterAll(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it("renders correctly", () => {
        renderComponent();

        const component = screen.getByTestId("message");

        expect(component).toMatchSnapshot()
    });

    it("copy-to-clipboard button copies the response to clipboard", () => {
        renderComponent();

        const copyToClipboardButton = screen.getByTitle(/copy-to-clipboard/);

        fireEvent.click(copyToClipboardButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalled();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(RESPONSE);
    });

    it("onDelete is called when the delete button is clicked", () => {
        renderComponent();

        const deleteButton = screen.getByTitle(/delete-button/);

        fireEvent.click(deleteButton);

        expect(onDeleteMock).toHaveBeenCalled();
    });

    it("onThumbsUp is called on thumbs up button", () => {
        renderComponent();

        const thumbsUpBtn = screen.getByTitle(/thumbs-up/);

        fireEvent.click(thumbsUpBtn);

        expect(onThumbsUpMock).toHaveBeenCalled();
    });

    it("onThumbsDown is called on thumbs down button", () => {
        renderComponent();

        const thumbsDownBtn = screen.getByTitle(/thumbs-down/);

        fireEvent.click(thumbsDownBtn);

        expect(onThumbsDownMock).toHaveBeenCalled();
    });

    it("if the message already has feedback, then feedback buttons aren't clicked", () => {
        onThumbsUpMock.mockReset();
        onThumbsDownMock.mockReset();

        renderComponent(false, false, true);

        const thumbsUpBtn = screen.getByTitle(/thumbs-up/);

        fireEvent.click(thumbsUpBtn);

        expect(onThumbsUpMock).not.toHaveBeenCalled();

        const thumbsDownBtn = screen.getByTitle(/thumbs-down/);

        fireEvent.click(thumbsDownBtn);

        expect(onThumbsDownMock).not.toHaveBeenCalled();
    });

    it("cursor is not shown by default", () => {
        renderComponent();

        const cursorIcon = screen.queryByTestId(/cursor-icon/);

        expect(cursorIcon).not.toBeInTheDocument();
    });

    it("cursor is shown, if cursor props is true", () => {
        renderComponent(true);

        const cursorIcon = screen.getByTestId(/cursor-icon/);

        expect(cursorIcon).toBeInTheDocument();
    });

})