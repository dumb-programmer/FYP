import React, { useRef } from "react";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import DeleteConfirmationModal from "../../src/components/DeleteConfirmationModal";

const mockedOnDelete = vi.fn();
vi.mock("react", async () => ({ ...await vi.importActual("react"), useRef: vi.fn() }));

const DeleteConfirmationModalWrapper = () => {
    const ref = useRef<HTMLDialogElement | null>(null);

    return <DeleteConfirmationModal dialogRef={ref} title="Are you sure?" description="This is a non-recoverable action." onDelete={mockedOnDelete} />;
};

const renderComponent = () => render(<DeleteConfirmationModalWrapper />);

describe("DeleteConfirmationModal", () => {
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