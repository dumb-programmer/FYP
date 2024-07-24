import React from "react";
import { render } from "@testing-library/react";
import { expect, describe, it, vi, afterEach, beforeEach } from "vitest";
import InfiniteScrollContainer from "../../src/components/InfiniteScrollContainer";
import useIntersectionObserver from "../../src//hooks/useIntersectionObserver";

vi.mock("../../src/hooks/useIntersectionObserver", () => ({ default: vi.fn(() => ({ inView: true, ref: vi.fn() })) }))

const mockFetchNextPage = vi.fn();
const renderComponent = (hasNextPage: boolean, isFetchingNextPage: boolean) => render(<InfiniteScrollContainer hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={mockFetchNextPage}><div className="w-96"></div></InfiniteScrollContainer>);

describe("InfiniteScrollContainer", () => {

    beforeEach(() => {
        HTMLDivElement.prototype.scrollBy = vi.fn();
    })

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders correctly", () => {
        const { container } = renderComponent(true, true);

        expect(container).toMatchSnapshot();
    });

    it("fetchNextPage is called when inView is true, and isFetchingNextPage is false, and hasNextPage is true", () => {
        renderComponent(true, false);

        expect(mockFetchNextPage).toHaveBeenCalled();

        expect(HTMLDivElement.prototype.scrollBy).toHaveBeenCalled();
        expect(HTMLDivElement.prototype.scrollBy).toHaveBeenCalledWith({ top: 20, behavior: "smooth" });
    });

    it("fetchNextPage is not called when inView is true, and isFetchingNextPage is true, and hasNextPage is true", () => {
        renderComponent(true, true);

        expect(mockFetchNextPage).not.toHaveBeenCalled();
        expect(HTMLDivElement.prototype.scrollBy).not.toHaveBeenCalled();
    });

    it("fetchNextPage is not called when inView is true, and isFetchingNextPage is false, and hasNextPage is false", () => {
        renderComponent(false, false);

        expect(mockFetchNextPage).not.toHaveBeenCalled();
        expect(HTMLDivElement.prototype.scrollBy).not.toHaveBeenCalled();
    });

    it("fetchNextPage is not called when inView is false", () => {
        useIntersectionObserver.mockReturnValue({
            inView: false,
            ref: vi.fn(),
        });

        renderComponent(false, false);

        expect(mockFetchNextPage).not.toHaveBeenCalled();
        expect(HTMLDivElement.prototype.scrollBy).not.toHaveBeenCalled();
    });
})