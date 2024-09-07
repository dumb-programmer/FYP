import React, { useRef } from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import ConfirmationModal from "../../src/components/ConfirmationModal";

const mockedOnDelete = vi.fn();
vi.mock("react", async () => ({ ...await vi.importActual("react"), useRef: vi.fn() }));

const ConfirmationModalWrapper = () => {
    const ref = useRef<HTMLDialogElement | null>(null);

    return <ConfirmationModal dialogRef={ref} title="Are you sure?" description="This is a non-recoverable action." onPrimary={mockedOnDelete} onCancel={() => ref.current?.close()} />;
};

const renderComponent = () => render(<ConfirmationModalWrapper />);

describe("ConfirmationModal", () => {
    beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn(function () {
            this.style.display = 'block';
            this.setAttribute('open', '');
        });

        HTMLDialogElement.prototype.close = vi.fn(function () {
            this.style.display = 'none';
            this.removeAttribute('open');
        });
    });

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("renders correctly", () => {
        renderComponent();

        const modal = screen.getByTestId("modal");

        expect(modal).toMatchSnapshot();
    });
})