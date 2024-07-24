import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach } from "vitest";
import Chat from "../../src/views/Chat";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { getChatName, getMessages, searchMessages } from "../../src/api/api";
import userEvent from "@testing-library/user-event";

vi.mock("../../src/hooks/useSocketContext", async () => {
    return {
        default: () => ({ on: vi.fn(), off: vi.fn() })
    }
})

vi.mock("../../src/api/api", async () => {
    const actual = await vi.importActual("../../src/api/api");

    return {
        ...actual,
        getChatName: vi.fn().mockReturnValue({ ok: true, json: () => ({ name: "Chat 123" }) }),
        searchMessages: vi.fn(),
        getMessages: vi.fn()
    }
})

const queryClient = new QueryClient();
const renderComponent = () => render(
    <MemoryRouter initialEntries={["/chat/123"]}>
        <Routes>
            <Route path="/chat/:chatId" element={
                <QueryClientProvider client={queryClient}>
                    <Chat />
                </QueryClientProvider>} />
        </Routes>
    </MemoryRouter>
);

describe("Chat", () => {
    beforeEach(() => {
        window.IntersectionObserver = vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() }))
        HTMLDivElement.prototype.scrollBy = vi.fn()
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders correctly", async () => {
        await waitFor(() => {
            const { container } = renderComponent();
            expect(container).toMatchSnapshot();
        })
    });

    it("By default getMessages is called and all messages are shown", async () => {
        await waitFor(() => {
            const { container } = renderComponent();
            expect(container).toMatchSnapshot();
        })

        expect(getMessages).toHaveBeenCalled();
        expect(getMessages).toHaveBeenCalledWith("123", 1);
    });

    it("When the user types a query, searchMessages is called and SearchResults are shown", async () => {
        await waitFor(() => {
            const { container } = renderComponent();
            expect(container).toMatchSnapshot();
        });

        await userEvent.type(screen.getByPlaceholderText(/search/i), "test");

        expect(searchMessages).toHaveBeenCalled();
        expect(searchMessages).toHaveBeenCalledWith("123", "test", 1);
    });
})