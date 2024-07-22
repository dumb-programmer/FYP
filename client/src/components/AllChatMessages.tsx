import MessageList from "./MessageList";
import { useParams } from "react-router-dom";
import { getMessages } from "@/api/api";
import { useInfiniteQuery } from "react-query";
import StreamedMessage from "./StreamedMessage";
import InfiniteScrollContainer from "./InfiniteScrollContainer";

export default function AllChatMessages() {
    const { chatId } = useParams();
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(`chat-${chatId}`, {
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getMessages(chatId as string, pageParam);
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
            <StreamedMessage chatId={chatId as string} />
        </InfiniteScrollContainer>
    )
}
