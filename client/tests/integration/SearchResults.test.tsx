import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchResults from "../../src/components/SearchResults";
import { searchMessages } from "../../src/api/api";

vi.mock("../../src/api/api", async () => ({
    ...await vi.importActual("../../src/api/api"),
    searchMessages: vi.fn()
}));

const queryClient = new QueryClient();

const renderComponent = (query: string, chatId: string) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[`/chat/${chatId}`]}>
                <Routes>
                    <Route path="/chat/:chatId" element={<SearchResults query={query} />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe("SearchResults", () => {
    beforeEach(() => {
        window.IntersectionObserver = vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() }))
        HTMLDivElement.prototype.scrollBy = vi.fn()
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders correctly with messages", async () => {
        const mockMessages = [{ _id: "1", prompt: "A", response: "B" }, { _id: "2", prompt: "C", response: "D" }];
        const mockResponse = {
            ok: true,
            json: async () => ({
                messages: mockMessages,
                hasMore: false,
                nextPage: undefined,
            }),
        };

        searchMessages.mockResolvedValue(mockResponse as any);

        const { container } = renderComponent("test", "123");

        expect(container).toMatchSnapshot();

        await waitFor(() => {
            expect(screen.getByText("A")).toBeInTheDocument();
            expect(screen.getByText("B")).toBeInTheDocument();
            expect(screen.getByText("C")).toBeInTheDocument();
            expect(screen.getByText("D")).toBeInTheDocument();

        });

    });

    it("renders empty state if no messages", async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                messages: [],
                hasMore: false,
                nextPage: undefined,
            }),
        };

        searchMessages.mockResolvedValue(mockResponse as any);

        renderComponent("test", "123");

        await waitFor(() => {
            expect(screen.queryByText("A")).not.toBeInTheDocument();
            expect(screen.queryByText("B")).not.toBeInTheDocument();
            expect(screen.queryByText("C")).not.toBeInTheDocument();
            expect(screen.queryByText("D")).not.toBeInTheDocument();

        });
    });

    it("calls searchMessages with correct parameters", async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                messages: [{ _id: "1", prompt: "Hello", response: "Hi" }],
                hasMore: false,
                nextPage: undefined,
            }),
        };

        searchMessages.mockResolvedValue(mockResponse as any);

        renderComponent("test", "123");

        await waitFor(() => {
            expect(searchMessages).toHaveBeenCalledWith("123", "test", 1);
        });
    });

    it("calls searchMessages with correct parameters, even if there are more pages", async () => {
        vi.mock("../../src/hooks/useIntersectionObserver", () => ({ default: () => ({ ref: vi.fn(), inView: true }) }))

        const mockResponsePage1 = {
            ok: true,
            json: async () => ({
                messages: [{ _id: "1", prompt: "Hello", response: "Hi" }],
                hasMore: true,
                nextPage: 2,
            }),
        };

        const mockResponsePage2 = {
            ok: true,
            json: async () => ({
                messages: [{
                    _id: "2", prompt: "A", response: "B"
                }],
                hasMore: false,
                nextPage: undefined,
            }),
        };

        searchMessages.mockImplementation((chatId, query, page) => {
            if (page === 1) return mockResponsePage1;
            return mockResponsePage2;
        })

        const { container } = renderComponent("test", "123");

        await waitFor(() => {
            expect(searchMessages).toHaveBeenCalledWith("123", "test", 1);
        });

        fireEvent.scroll(container.querySelector("div") as HTMLDivElement, { target: { scrollTop: 0 } })

        await waitFor(() => {
            expect(searchMessages).toHaveBeenCalledWith("123", "test", 2);
        });

    });
});
