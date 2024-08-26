import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import PositiveFeedbackButton from "../../src/components/PositiveFeedbackButton";

const onClickMock = vi.fn();
const renderComponent = (filled = false) => render(<PositiveFeedbackButton filled={filled} onClick={onClickMock} />);

describe("PositiveFeebackButton", () => {
    it("renders correctly", () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();

        const icon = screen.getByTestId(/thumbs-up-icon/);

        expect(icon).toBeInTheDocument();
    });

    it("when filled props is true, renders a filled thumbs up icon", () => {
        renderComponent(true);

        const icon = screen.getByTestId(/filled-thumbs-up-icon/);

        expect(icon).toBeInTheDocument();
    });
})