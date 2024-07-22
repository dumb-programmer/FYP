import MessageList from "./MessageList";
import { searchMessages } from "@/api/api";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import InfiniteScrollContainer from "./InfiniteScrollContainer";

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

    return (
        <InfiniteScrollContainer className="flex-1 p-10 flex flex-col gap-10 overflow-y-auto" hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage}>
            {
                data?.pages && <MessageList refetchMessages={refetch} messages={[].concat(...data.pages.map(page => [...page.messages].reverse()).reverse())} />
            }
        </InfiniteScrollContainer>
    )
}
