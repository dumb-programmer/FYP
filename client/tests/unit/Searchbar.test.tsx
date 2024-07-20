import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";
import Searchbar from "../../src/components/Searchbar";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useLocation: vi.fn().mockReturnValue({
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: crypto.randomUUID(),
    }),
    useSearchParams: vi.fn().mockReturnValue([
        new URLSearchParams(),
        vi.fn(),
    ]),
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));


const renderComponent = () => render(<Searchbar />);

describe("Searchbar", () => {
    it("renders correctly", () => {
        renderComponent();

        const searchbar = screen.getByTestId(/searchbar/i);

        expect(searchbar).toMatchSnapshot();
        
        expect(useLocation).toHaveBeenCalled();
        expect(useSearchParams).toHaveBeenCalled();
        expect(useNavigate).toHaveBeenCalled();
    });

    it("input works", async () => {
        renderComponent();

        const searchbar = screen.getByRole("textbox");

        await userEvent.type(searchbar, "hello");

        expect(searchbar.value).toEqual("hello");
    });

    it("changing input applies search query", async () => {
        const mockNavigate = vi.fn();

        useNavigate.mockReturnValue(mockNavigate);

        renderComponent();

        const searchbar = screen.getByRole("textbox");

        await userEvent.type(searchbar, "hello");

        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/?query=hello")

    });

    it("when the input text is erased the search query is deleted", async () => {
        const mockNavigate = vi.fn();

        useNavigate.mockReturnValue(mockNavigate);

        renderComponent();

        const searchbar = screen.getByRole("textbox");

        await userEvent.type(searchbar, "hello");

        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/?query=hello");

        await userEvent.clear(searchbar);

        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("The input is filled with the default value equal to query if specified in the URL search params", () => {
        const urlSearchParms = new URLSearchParams();
        urlSearchParms.set("query", "test");
        useSearchParams.mockReturnValue([urlSearchParms,
            vi.fn(),])

        renderComponent();

        const searchbar = screen.getByRole("textbox");

        expect(searchbar.value).toEqual("test");
    })
})