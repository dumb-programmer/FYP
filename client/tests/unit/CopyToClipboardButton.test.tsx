import React from "react";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { vi, expect, describe, it, beforeAll, afterAll } from "vitest";
import CopyToClipboardButton from "../../src/components/CopyToClipboardButton"

const renderComponent = () => render(<CopyToClipboardButton data="hello" />);

describe("CopyToClipboardButton", () => {
    let setTimeoutSpy;
    let clearTimeoutSpy;

    beforeAll(() => {
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn()
            }
        })
        vi.useFakeTimers();
        setTimeoutSpy = vi.spyOn(global, "setTimeout");
        clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    });

    afterAll(() => {
        cleanup();
        vi.useRealTimers();
        vi.resetAllMocks();
    });

    it("renders correctly", () => {
        renderComponent();

        const button = screen.getByTitle(/copy-to-clipboard/);

        expect(button).toMatchSnapshot();
    });

    it("data is copied to clipboard on click", async () => {
        renderComponent();
        const button = screen.getByTitle(/copy-to-clipboard/);

        fireEvent.click(button);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello")
    });

    it("timer of 1000ms is started on click", async () => {
        renderComponent();

        const button = screen.getByTitle(/copy-to-clipboard/);

        fireEvent.click(button);

        expect(setTimeoutSpy).toHaveBeenCalled();
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it("timer is cleared on unmount", async () => {
        const { unmount } = renderComponent();

        const button = screen.getByTitle(/copy-to-clipboard/);

        fireEvent.click(button);

        unmount()

        expect(clearTimeoutSpy).toBeCalled();
    });

    it("icon changes from document to check document on click and changes back after 1000mss", () => {
        renderComponent();

        const button = screen.getByTitle(/copy-to-clipboard/);

        expect(screen.getByTitle(/clipboard-document-icon/)).not.toBeNull();


        fireEvent.click(button);

        expect(screen.queryByText(/clipboard-document-icon/)).toBeNull();
        expect(screen.getByText(/clipboard-document-check-icon/)).not.toBeNull();

        act(() => {
            vi.advanceTimersByTime(1000);
        })

        expect(screen.queryByText(/clipboard-document-icon/)).not.toBeNull();
    })
})