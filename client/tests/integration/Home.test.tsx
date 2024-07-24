import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import Home from "../../src/views/Home";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { getUser } from "../../src/api/api";
import AuthContextProvider from "../../src/components/AuthContextProvider";
import { QueryClient, QueryClientProvider } from "react-query";

vi.mock("../../src/api/api", async () => ({ ...await vi.importActual("../../src/api/api"), getUser: vi.fn(async () => ({})) }))

vi.mock("react-router-dom", async () => ({ ...await vi.importActual("react-router-dom"), useNavigate: vi.fn() }))

const ProtectedComponent = () => <p>Protected</p>

const queryClient = new QueryClient();

const renderComponent = (path?: string) => render(
    <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
            <MemoryRouter initialEntries={path ? [path] : undefined}>
                <Routes>
                    <Route path="/" element={<Home />}>
                        <Route path="/chat/:chatId" element={<ProtectedComponent />}></Route>
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContextProvider>
    </QueryClientProvider>


);

describe("Home", () => {
    let mockNavigate;

    beforeEach(() => {
        mockNavigate = vi.fn();

        useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("calls getUser on render", async () => {
        renderComponent();

        await waitFor(() => {
            expect(getUser).toHaveBeenCalled();
        });
    });

    it("redirects to /login if user isn't authenticated", async () => {
        renderComponent();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("redirects to /login and saves the URL from which it was redirected in the searchParams, if the URL is not /, if user isn't authenticated", async () => {
        renderComponent("/chat/123");

        const searchParams = new URLSearchParams()
        searchParams.set("redirect", "/chat/123")

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith(`/login?${searchParams.toString()}`);
        });
    });

    it("If the user is authenticated, calls setAuth to save the current user, and renders the protected component", async () => {
        const user = { firstName: "test", lastName: "123", email: "test@gmail.com" };
        const response = { ok: true, json: async () => user };
        getUser.mockImplementation(async () => response)

        renderComponent("/chat/123");
        
        await waitFor(() => {
            expect(getUser).toHaveBeenCalled();
            expect(screen.getByText(/^protected/i)).toBeInTheDocument();
        });
    });
})