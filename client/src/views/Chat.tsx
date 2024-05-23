import AllChatMessages from "@/components/AllChatMessages";
import PromptForm from "@/components/PromptForm";
import SearchResults from "@/components/SearchResults";
import Searchbar from "@/components/Searchbar";
import { useSearchParams } from "react-router-dom";

export default function Chat() {
    const [URLSearchParams] = useSearchParams();

    const query = URLSearchParams.get("query");

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