import { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import useIntersectionObserver from "@/hook/useIntersectionObserver";
import { searchMessages } from "@/api/api";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "react-query";

export default function SearchResults({ query }: { query: string }) {
    const { chatId } = useParams();
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(`chat-${chatId}?${query}`, {
        queryFn: async ({ pageParam = 1 }) => {
            const response = await searchMessages(chatId, query, pageParam);
            if (response.ok) {
                return await response.json();
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.nextPage
            }
            return undefined
        }
    });
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
    }, [inView]);

    return (
        <div ref={containerRef} className="flex-1 p-10 flex flex-col gap-10 overflow-y-auto">
            <div ref={ref}></div>
            {
                data?.pages && <MessageList refetchMessages={refetch} messages={[].concat(...data.pages.map(page => [...page.messages].reverse()).reverse())} />
            }
        </div>
    )
}
