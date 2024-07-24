import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AllChatMessages from "../../src/components/AllChatMessages";
import { getMessages } from "../../src/api/api";

vi.mock("../../src/api/api", async () => ({
    ...await vi.importActual("../../src/api/api"),
    getMessages: vi.fn()
}));

vi.mock("../../src/hooks/useSocketContext", () => ({ default: () => ({ on: vi.fn(), off: vi.fn() }) }));

const queryClient = new QueryClient();

const renderComponent = (chatId: string) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[`/chat/${chatId}`]}>
                <Routes>
                    <Route path="/chat/:chatId" element={<AllChatMessages />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe("AllChatMessages", () => {
    beforeEach(() => {
        window.IntersectionObserver = vi.fn((callback) => {
            const observer = {
                observe: vi.fn(),
                unobserve: vi.fn(),
                disconnect: vi.fn(),
            };
            return observer;
        });

        HTMLDivElement.prototype.scrollBy = vi.fn()
    });

    afterEach(() => {
        vi.clearAllMocks();
    })

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

        getMessages.mockResolvedValue(mockResponse as any);

        const { container } = renderComponent("123");

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

        getMessages.mockResolvedValue(mockResponse as any);

        renderComponent("123");

        await waitFor(() => {
            expect(screen.queryByText("A")).not.toBeInTheDocument();
            expect(screen.queryByText("B")).not.toBeInTheDocument();
            expect(screen.queryByText("C")).not.toBeInTheDocument();
            expect(screen.queryByText("D")).not.toBeInTheDocument();

        });
    });

    it("calls getMessages with correct parameters", async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                messages: [{ _id: "1", prompt: "Hello", response: "Hi" }],
                hasMore: false,
                nextPage: undefined,
            }),
        };

        getMessages.mockResolvedValue(mockResponse as any);

        renderComponent("123");

        await waitFor(() => {
            expect(getMessages).toHaveBeenCalledWith("123", 1);
        });
    });

    it("calls getMessages with correct parameters, even if there are more pages", async () => {
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

        getMessages.mockImplementation((chatId, page) => {
            if (page === 1) return mockResponsePage1;
            return mockResponsePage2;
        })

        const { container } = renderComponent("123");

        await waitFor(() => {
            expect(getMessages).toHaveBeenCalledWith("123", 1);
        });

        fireEvent.scroll(container.querySelector("div") as HTMLDivElement, { target: { scrollTop: 0 } })

        await waitFor(() => {
            expect(getMessages).toHaveBeenCalledWith("123", 2);
        });

    });
});
