import { getChatName } from "@/api/api";
import AllChatMessages from "@/components/AllChatMessages";
import PromptForm from "@/components/PromptForm";
import SearchResults from "@/components/SearchResults";
import Searchbar from "@/components/Searchbar";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";

export default function Chat() {
    const [URLSearchParams] = useSearchParams();
    const { chatId } = useParams();
    const { data } = useQuery({
        queryKey: chatId,
        queryFn: async () => {
            const response = await getChatName(chatId)
            if (response.ok) {
                return await response.json()
            }
        },
    })

    const query = URLSearchParams.get("query");

    useEffect(() => {
        if (data) {
            document.title = data.name
        }
    }, [data]);

    return <div className="flex flex-col h-screen overflow-hidden">
        <div className="p-5">
            <Searchbar />
        </div>
        {
            query ? <SearchResults query={query} /> : <AllChatMessages />
        }
        <div className="flex justify-center p-5 bg-base-100 w-full">
            <PromptForm />
        </div>
    </div>;
}