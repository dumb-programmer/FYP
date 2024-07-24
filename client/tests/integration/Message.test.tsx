import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { expect, describe, it, vi, beforeAll, afterAll } from "vitest";
import Message from "../../src/components/Message";

const _ID = crypto.randomUUID();
const PROMPT = "Hello";
const RESPONSE = "Hi";

const onDeleteMock = vi.fn();
const renderComponent = (cursor = false, omitOnDelete = false) => render(<Message message={{ _id: _ID, prompt: PROMPT, response: RESPONSE }} onDelete={omitOnDelete ? undefined : onDeleteMock} cursor={cursor} />);

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

})