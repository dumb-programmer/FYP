import { render, act, screen, waitFor } from "@testing-library/react";
import React from "react";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import useIntersectionObserver from "../../src/hooks/useIntersectionObserver";


let element;
const TestComponent = () => {
    const { ref, inView } = useIntersectionObserver();
    element = ref;
    return (
        <div>
            <div ref={ref}>Observed Element</div>
            <div>{`In view: ${inView}`}</div>
        </div>
    );
};

describe("useIntersectionObserver", () => {
    let observe;
    let disconnect;
    let triggerIntersection;

    beforeEach(() => {
        observe = vi.fn();
        disconnect = vi.fn();

        global.IntersectionObserver = vi.fn((callback) => {
            triggerIntersection = callback;
            return {
                observe,
                disconnect,
            };
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("initializes ref and inView state", () => {
        const { getByText } = render(<TestComponent />);
        expect(getByText("Observed Element")).toBeInTheDocument();
        expect(getByText("In view: false")).toBeInTheDocument();
    });

    it("calls observer.observe on mount", () => {
        render(<TestComponent />);
        expect(observe).toHaveBeenCalled();
    });

    it("sets inView to true when element intersects", async () => {
        const { container } = render(<TestComponent />);
        act(() => {
            triggerIntersection([{ target: element.current, isIntersecting: true }]);
        });
        expect(screen.getByText("In view: true")).toBeInTheDocument();

        await waitFor(() => {
            const entries = [{ target: container.querySelector("div>div"), isIntersecting: true }];
            window.IntersectionObserver.mock.calls[0][0](entries);
        });
        expect(screen.getByText("In view: true")).toBeInTheDocument()
    });

    it("sets inView to false when element does not intersect", () => {
        const { getByText } = render(<TestComponent />);
        act(() => {
            triggerIntersection([{ target: element.current, isIntersecting: false }]);
        });
        expect(getByText("In view: false")).toBeInTheDocument();
    });

    it("disconnects observer on unmount", () => {
        const { unmount } = render(<TestComponent />);
        unmount();
        expect(disconnect).toHaveBeenCalled();
    });
});
