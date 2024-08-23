import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import AuthProviderBtns from "../../src/components/AuthProviderBtns";

const renderComponent = () => render(<AuthProviderBtns />);

describe("AuthProviderBtns", () => {
    it("renders correctly", () => {
        renderComponent();

        const authProviderBtns = screen.getByTestId("auth-provider-btns");

        expect(authProviderBtns).toMatchSnapshot();
    });

    it("continue with google button has redirect link to google provider", () => {
        renderComponent();

        const continueWithGoogleButton = screen.getByRole("link", { name: /continue with google/i });

        expect(continueWithGoogleButton).toHaveAttribute("href", "http://localhost:3000/auth/google");
    });

    it("continue with github button has redirect link to github provider", () => {
        renderComponent();

        const continueWithGithubButton = screen.getByRole("link", { name: /continue with github/i });

        expect(continueWithGithubButton).toHaveAttribute("href", "http://localhost:3000/auth/github");
    });
})