import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import ErrorMessage from "../../src/components/ErrorMessage";

const renderComponent = () => render(<ErrorMessage message="something went wrong" />);

describe("ErrorMessage", () => {
    it("renders correctly", () => {
        renderComponent();

        const errorMessage = screen.getByText(/something went wrong/);

        expect(errorMessage).toMatchSnapshot();
    });
})