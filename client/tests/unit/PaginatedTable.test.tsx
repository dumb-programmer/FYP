import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import PaginatedTable from "../../src/components/PaginatedTable";

const mockFetchNextPage = vi.fn();

const colDefs = [{ field: "A" }, { field: "B" }, { field: "C" }]

const renderComponent = (data: unknown, limit: number, hasNextPage: boolean, isFetchingNextPage: boolean) => render(<PaginatedTable colDefs={colDefs} data={data} limit={limit} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={mockFetchNextPage} />);

describe("PaginatedTable", () => {
    it("renders correctly", () => {
        const data = { pages: [{ rows: [], hasNextPage: false, nextPage: 2 }] }
        renderComponent(data, 10, false, false);

        const table = screen.getByTestId("data-table");

        expect(table).toMatchSnapshot();
    });

    it("next button, and previous buttons are disabled if there's only one page", () => {
        const data = { pages: [{ rows: [], hasNextPage: false, nextPage: 2 }] }
        renderComponent(data, 10, false, false);

        expect(screen.getByLabelText("previous page")).toBeDisabled();
        expect(screen.getByLabelText("next page")).toBeDisabled();
    });

    it("next button becomes disabled if there are no more pages", () => {
        const data = { pages: [{ rows: [{ A: 10, B: 20 }], hasNextPage: true, nextPage: 2 }, { rows: [{ A: 30, B: 40 }], hasNextPage: false, nextPage: 3 }] }
        renderComponent(data, 1, false, false);

        const nextPageBtn = screen.getByLabelText("next page");
        const prevPageBtn = screen.getByLabelText("previous page");

        expect(nextPageBtn).not.toBeDisabled();
        expect(prevPageBtn).toBeDisabled();

        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("20")).toBeInTheDocument();

        fireEvent.click(nextPageBtn);

        expect(screen.queryByText("10")).not.toBeInTheDocument();
        expect(screen.queryByText("20")).not.toBeInTheDocument();

        expect(screen.queryByText("30")).toBeInTheDocument();
        expect(screen.queryByText("40")).toBeInTheDocument();

        expect(prevPageBtn).not.toBeDisabled();
        expect(nextPageBtn).toBeDisabled();
    });

    it("prev button becomes undisabled if there are previous pages", () => {
        const data = { pages: [{ rows: [{ A: 10, B: 20 }], hasNextPage: true, nextPage: 2 }, { rows: [{ A: 30, B: 40 }], hasNextPage: false, nextPage: 3 }] }
        renderComponent(data, 1, false, false);

        const nextPageBtn = screen.getByLabelText("next page");
        const prevPageBtn = screen.getByLabelText("previous page");

        expect(nextPageBtn).not.toBeDisabled();
        expect(prevPageBtn).toBeDisabled();

        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("20")).toBeInTheDocument();

        fireEvent.click(nextPageBtn);

        expect(screen.queryByText("10")).not.toBeInTheDocument();
        expect(screen.queryByText("20")).not.toBeInTheDocument();

        expect(screen.queryByText("30")).toBeInTheDocument();
        expect(screen.queryByText("40")).toBeInTheDocument();

        expect(prevPageBtn).not.toBeDisabled();
        expect(nextPageBtn).toBeDisabled();

        fireEvent.click(prevPageBtn);

        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("20")).toBeInTheDocument();

        expect(screen.queryByText("30")).not.toBeInTheDocument();
        expect(screen.queryByText("40")).not.toBeInTheDocument();

        expect(prevPageBtn).toBeDisabled();
        expect(nextPageBtn).not.toBeDisabled();
    });
})