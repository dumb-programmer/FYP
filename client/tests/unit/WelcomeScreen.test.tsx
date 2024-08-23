import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import WelcomeScreen from "../../src/views/WelcomeScreen";

const renderComponent = () => render(<WelcomeScreen />);

describe("WelcomeScreen", () => {
    it("renders correctly", () => {
        renderComponent();

        const welcomeScreen = screen.getByTestId("welcome-screen");

        expect(welcomeScreen).toMatchSnapshot();
    });
})