import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { expect, describe, it, vi, beforeEach, beforeAll } from "vitest";
import AdminUsers from "../../src/views/AdminUsers";
import { QueryClient, QueryClientProvider } from "react-query";
import { getUsersList, blockUser, unblockUser, deleteUser } from "../../src/api/api";
import userEvent from "@testing-library/user-event";

vi.mock("../../src/api/api");

const client = new QueryClient();

const renderComponent = () => render(<QueryClientProvider client={client}><AdminUsers /></QueryClientProvider>);

describe("AdminUsers", () => {
    beforeAll(() => {
        HTMLDialogElement.prototype.showModal = vi.fn(function () {
            this.style.display = 'block';
            this.setAttribute('open', '');
        });

        HTMLDialogElement.prototype.close = vi.fn(function () {
            this.style.display = 'none';
            this.removeAttribute('open');
        });
    })

    beforeEach(() => {
        let users = [{ _id: "123", firstName: "John", lastName: "Cena", email: "john@gmail.com" }];

        getUsersList.mockReturnValue({
            ok: true,
            json: async () => ({ rows: users, hasMore: false, nextPage: 2 })
        });

        blockUser.mockImplementation((id) => {
            users = users.map(user => {
                if (user._id !== id) {
                    return user
                }
                else {
                    return { ...user, isBlocked: true }
                }
            })

            return { ok: true }
        });
        unblockUser.mockImplementation((id) => {
            users = users.map(user => {
                if (user._id !== id) {
                    return user
                }
                else {
                    delete user?.isBlocked
                    return user;
                }
            })
            return { ok: true }
        });

        deleteUser.mockImplementation((id) => {
            users = users.filter(user => user._id !== id)
            return { ok: true }
        });
    });

    it("renders correctly", async () => {
        const { container } = renderComponent();

        expect(container).toMatchSnapshot();
        expect(getUsersList).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getByText("John")).toBeInTheDocument();
            expect(screen.getByText("Cena")).toBeInTheDocument();
            expect(screen.getByText("john@gmail.com")).toBeInTheDocument();
        })
    });

    it("can block/unblock user", async () => {
        renderComponent();

        await waitFor(async () => {

            const blockBtn = screen.getByRole("button", { name: /block/i })

            expect(blockBtn).toBeInTheDocument();

            await userEvent.click(blockBtn);

            const blockDialog = screen.getByRole("dialog");

            expect(blockDialog).toBeInTheDocument();

            await userEvent.click(within(blockDialog).getByRole("button", { name: /block/i }));

            expect(blockUser).toHaveBeenCalled();
            expect(blockUser).toHaveBeenCalledWith("123");

            expect(blockBtn).not.toBeInTheDocument();
            expect(blockDialog).not.toBeVisible();

            const unblockBtn = screen.getByRole("button", { name: /unblock/i });

            await userEvent.click(unblockBtn);

            const unblockDialog = screen.getByRole("dialog");

            expect(unblockDialog).toBeInTheDocument();

            await userEvent.click(within(unblockDialog).getByRole("button", { name: /unblock/i }));
            expect(unblockUser).toHaveBeenCalled();
            expect(unblockUser).toHaveBeenCalledWith("123");

            expect(unblockBtn).not.toBeInTheDocument();
            expect(unblockDialog).not.toBeVisible();
        })
    });

    it("can delete user", async () => {
        renderComponent();

        await waitFor(async () => {

            const deleteBtn = screen.getByRole("button", { name: /delete/i })

            expect(deleteBtn).toBeInTheDocument();

            await userEvent.click(deleteBtn);

            const deleteDialog = screen.getByRole("dialog");

            expect(deleteDialog).toBeInTheDocument();

            await userEvent.click(within(deleteDialog).getByRole("button", { name: /delete/i }));

            expect(deleteUser).toHaveBeenCalled();
            expect(deleteUser).toHaveBeenCalledWith("123");

            expect(deleteBtn).not.toBeInTheDocument();
            expect(deleteDialog).not.toBeVisible();
        })
    });

})