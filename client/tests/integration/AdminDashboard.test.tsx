import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import AdminDashboard from "../../src/views/AdminDashboard";
import { QueryClient, QueryClientProvider } from "react-query";
import { getFeedbackList } from "../../src/api/api";

vi.mock("../../src/api/api", async () => {
    const actual = await vi.importActual("../../src/api/api");

    const getFeedbackList = vi.fn().mockReturnValue({
        ok: true,
        json: async () => ({ rows: [{ _id: "123", type: "negative", comments: "Hello", prompt: "A", response: "B", category: "other" }], hasMore: false, nextPage: 2 })
    });


    return {
        ...actual,
        getFeedbackList,
    }
});

const client = new QueryClient();

const renderComponent = () => render(<QueryClientProvider client={client}><AdminDashboard /></QueryClientProvider>);

describe("AdminDashboard", () => {
    it("renders correctly", async () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();
        await waitFor(() => {
            expect(getFeedbackList).toHaveBeenCalled();

            expect(screen.getByText("Hello")).toBeInTheDocument();
            expect(screen.getByText("A")).toBeInTheDocument();
            expect(screen.getByText("B")).toBeInTheDocument();
            expect(screen.getByText("other")).toBeInTheDocument();
        })
    });
})