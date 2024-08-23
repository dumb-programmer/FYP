import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import Sidebar from "../../src/components/Sidebar";
import { QueryClient, QueryClientProvider } from "react-query";
import { getChats, logout } from "../../src/api/api"
import { MemoryRouter, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import useAuthContext from "../../src/hooks/useAuthContext";

vi.mock("react-router-dom", async () => ({ ...await vi.importActual("react-router-dom"), useNavigate: vi.fn() }));
vi.mock("../../src/hooks/useAuthContext", () => ({ default: vi.fn() }));
vi.mock("../../src/api/api", async () => ({ ...await vi.importActual("../../src/api/api"), getChats: vi.fn(), logout: vi.fn() }))

const queryClient = new QueryClient();
const renderComponent = () => render(
    <MemoryRouter>
        <QueryClientProvider client={queryClient}>
            <Sidebar />
        </QueryClientProvider>
    </MemoryRouter>
);

describe("Sidebar", () => {
    const setAuth = vi.fn();
    const AuthObj = { firstName: "John", lastName: "Cena", email: "john@gmail.com" };
    const mockNavigate = vi.fn();

    beforeEach(() => {
        useAuthContext.mockReturnValue({ auth: AuthObj, setAuth })
        useNavigate.mockReturnValue(mockNavigate)
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders correctly", async () => {
        await waitFor(() => {
            renderComponent();
        })

        const component = screen.getByRole("complementary");

        expect(component).toMatchSnapshot();
    });

    it("getChats is called with the correct parameters the retrieved data is shown as chat links", async () => {
        const chats = [
            { _id: "1", name: "Chat 1" },
            { _id: "2", name: "Chat 2" },
        ];
        const response = {
            ok: true,
            json: async () => ({ chats, hasMore: false, nextPage: 2 }),
            hasMore: false
        }
        getChats.mockReturnValue(response)

        await waitFor(() => {
            renderComponent();
        })

        expect(getChats).toHaveBeenCalled();
        expect(getChats).toHaveBeenCalledWith(1);
        expect(screen.getByText(/chat 1/i)).toBeInTheDocument();
        expect(screen.getByText(/chat 2/i)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();

    });

    it("load more button is shown, if there are more chat links to load", async () => {
        const chatsPage1 = [
            { _id: "1", name: "Chat 1" },
            { _id: "2", name: "Chat 2" },
        ];
        const chatsPage2 = [
            { _id: "3", name: "Chat 3" },
            { _id: "4", name: "Chat 4" },
        ];
        const response1 = {
            ok: true,
            json: async () => ({ chats: chatsPage1, hasMore: true, nextPage: 2 }),
        }
        const response2 = {
            ok: true,
            json: async () => ({ chats: chatsPage2, hasMore: false, nextPage: 3 }),
        }

        getChats.mockImplementation((page) => {
            if (page === 1) return response1;
            return response2;
        })

        await waitFor(() => {
            renderComponent();
        });


        expect(getChats).toHaveBeenCalled();
        expect(getChats).toHaveBeenCalledWith(1);
        expect(screen.getByText(/chat 1/i)).toBeInTheDocument();
        expect(screen.getByText(/chat 2/i)).toBeInTheDocument();
        expect(screen.queryByText(/chat 3/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/chat 4/i)).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: /load more/i })).toBeInTheDocument()


        await userEvent.click(screen.getByRole("button", { name: /load more/i }));

        expect(getChats).toHaveBeenCalled();
        expect(getChats).toHaveBeenCalledWith(2);
        expect(screen.getByText(/chat 1/i)).toBeInTheDocument();
        expect(screen.getByText(/chat 2/i)).toBeInTheDocument();
        expect(screen.getByText(/chat 3/i)).toBeInTheDocument();
        expect(screen.getByText(/chat 4/i)).toBeInTheDocument();

        // Since, there are no more chats to load, the load more button is hidden
        expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument()
    });

    it("logout button works", async () => {
        await waitFor(() => {
            renderComponent();
        })

        logout.mockReturnValue({ ok: true });

        await userEvent.click(screen.getByRole("button", { name: /logout/i }));

        expect(logout).toHaveBeenCalled();
        expect(setAuth).toHaveBeenCalled();

        // Navigate to /login
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    })
})