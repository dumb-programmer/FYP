import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import LoadingIcon from "../../src/components/LoadingIcon";

const renderComponent = () => render(<LoadingIcon size={20} />);

describe("EditChatForm", () => {
    it("renders correctly", () => {
        renderComponent();

        const component = screen.getByTestId("loading-icon");

        expect(component).toMatchSnapshot();
    });
})