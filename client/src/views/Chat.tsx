import { getMessages, sendPrompt } from "@/api/api";
import MessageList from "@/components/MessageList";
import useIntersectionObserver from "@/hook/useIntersectionObserver";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useInfiniteQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Chat() {
    const { chatId } = useParams();
    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery(`chat-${chatId}`, {
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getMessages(chatId, pageParam);
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
    const { handleSubmit, register, formState: { isSubmitting } } = useForm({
        defaultValues: {
            prompt: ""
        }
    })
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

    return <div className="flex flex-col h-screen overflow-hidden">
        <div ref={containerRef} className="flex-1 p-10 flex flex-col gap-10 overflow-y-auto">
            <div ref={ref}></div>
            {
                data?.pages && <MessageList refetchMessages={refetch} messages={[].concat(...data.pages.map(page => [...page.messages].reverse()).reverse())} />
            }
        </div>
        <div className="flex justify-center p-5 bg-base-100 w-full">
            <form className="flex gap-2 w-4/5" onSubmit={handleSubmit(async (data) => {
                await sendPrompt(data, chatId);
            })}>
                <input className="input input-bordered flex-1" type="text" placeholder="Prompt..." {...register("prompt")} />
                <button aria-label="send" className={`btn btn-primary ${isSubmitting ? "loading loading-spinner" : ""}`}><PaperAirplaneIcon height={20} width={20} /></button>
            </form>
        </div>
    </div>;
}