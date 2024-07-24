import React from "react";
import { act, render, screen } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import StreamedMessage from "../../src/components/StreamedMessage";
import useSocketContext from "../../src/hooks/useSocketContext";
import { useQueryClient } from "react-query";

vi.mock('react-query', () => ({
    useQueryClient: vi.fn(),
}));

vi.mock("../../src/hooks/useSocketContext", () => ({
    default: vi.fn()
}));

const chatId = crypto.randomUUID()
const renderComponent = () => render(<StreamedMessage chatId={chatId} />);


describe("StreamedMessage", () => {
    let mockSocket;
    let mockInvalidateQueries;

    beforeEach(() => {
        mockSocket = {
            on: vi.fn(),
            off: vi.fn(),
        }

        useSocketContext.mockImplementation(() => mockSocket);

        mockInvalidateQueries = vi.fn();

        useQueryClient.mockImplementation(() => ({
            invalidateQueries: mockInvalidateQueries,
        }));

    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("subscribes to message event on mount", () => {
        renderComponent();

        expect(mockSocket.on).toHaveBeenCalled();
        expect(mockSocket.on).toHaveBeenCalledWith("message", expect.any(Function));
    });

    it("unsubscribes from message event on unmount", () => {
        const { unmount } = renderComponent();

        unmount();

        expect(mockSocket.off).toHaveBeenCalled();
        expect(mockSocket.off).toHaveBeenCalledWith("message", expect.any(Function));
    });

    it("The streamed message is shown on message event", async () => {
        renderComponent();

        const messageCallback = mockSocket.on.mock.calls.find(
            (call) => call[0] === 'message'
        )[1];

        const mockMessage = { prompt: "Hello", word: "Hi", more: true }

        act(() => {
            messageCallback(mockMessage);
        });

        expect(screen.getByText(/hello/i)).not.toBeNull();
        expect(screen.getByText(/hi/i)).not.toBeNull();

        const cursorIcon = screen.getByTestId("cursor-icon");

        expect(cursorIcon).not.toBeNull();
    });

    it("The query is invalidated and the streamed message is removed from the screen if there are no more words", () => {
        renderComponent();

        const messageCallback = mockSocket.on.mock.calls.find(
            (call) => call[0] === 'message'
        )[1];

        const mockMessage = { prompt: "Hello", word: "Hi", more: false }

        act(() => {
            messageCallback(mockMessage);
        });

        expect(screen.queryByText(/hello/i)).toBeNull();
        expect(screen.queryByText(/hi/i)).toBeNull();

        const cursorIcon = screen.queryByText("cursor-icon");

        expect(cursorIcon).toBeNull();

        expect(mockInvalidateQueries).toBeCalled();
        expect(mockInvalidateQueries).toBeCalledWith({ queryKey: `chat-${chatId}` });
    })
})