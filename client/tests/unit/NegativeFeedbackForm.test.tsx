import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import NegaiveFeedbackForm from "../../src/components/NegativeFeedbackForm";
import userEvent from "@testing-library/user-event";

const id = "negative-feedback-form";
const messageId = "abc";
const onSuccessMock = vi.fn();
const renderComponent = () => render(<NegaiveFeedbackForm id={id} messageId={messageId} onSuccess={onSuccessMock} />);

describe("NegativeFeedback", () => {
    it("renders correctly", () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();
    });

    it("comments input works", async () => {
        renderComponent();

        const input = screen.getByRole("textbox");

        await userEvent.type(input, "hello");

        expect(input.value).toEqual("hello");
    });

    it("comments input works", async () => {
        renderComponent();

        const input = screen.getByRole("textbox");

        await userEvent.type(input, "hello");

        expect(input.value).toEqual("hello");
    });

    it("radio inputs work", async () => {
        renderComponent();

        const radioInputs = screen.getAllByRole("radio");

        for (const radioInput of radioInputs) {
            await userEvent.click(radioInput);

            expect(radioInput).toBeChecked();
        }
    });
})