import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import React, { useEffect, useRef } from "react";

interface InfiniteScrollContainerProps extends React.HTMLProps<HTMLDivElement> {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean | undefined;
    fetchNextPage: () => void;
    children: React.ReactNode;
}

export default function InfiniteScrollContainer({ hasNextPage, isFetchingNextPage, fetchNextPage, children, ...props }: InfiniteScrollContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { inView, ref } = useIntersectionObserver();

    useEffect(() => {
        if (inView && !isFetchingNextPage && hasNextPage) {
            fetchNextPage();
            containerRef?.current?.scrollBy({
                top: 20,
                behavior: "smooth",
            });
        }
    }, [inView, fetchNextPage, isFetchingNextPage, hasNextPage]);

    return <div id="messages-container" ref={containerRef} {...props}>
        <div ref={ref}></div>
        {
            children
        }
    </div>
}