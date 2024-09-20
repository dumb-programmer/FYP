import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import NegativeFeedbackButton from "../../src/components/NegativeFeedbackButton";

const onClickMock = vi.fn();
const renderComponent = (filled = false) => render(<NegativeFeedbackButton filled={filled} onClick={onClickMock} />);

describe("NegativeButton", () => {
    it("renders correctly", () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();

        const icon = screen.getByTestId(/thumbs-down-icon/);

        expect(icon).toBeInTheDocument();
    });

    it("when filled props is true, renders a filled thumbs down icon", () => {
        renderComponent(true);

        const icon = screen.getByTestId(/filled-thumbs-down-icon/);

        expect(icon).toBeInTheDocument();
    });
})