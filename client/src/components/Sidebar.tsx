import useAuthContext from "@/hooks/useAuthContext";
import { useInfiniteQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import CreateChatButton from "./CreateChatButton";
import ChatLink from "./ChatLink";
import { ArrowLeftStartOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { getChats, logout } from "@/api/api";

export default function Sidebar() {
    const { data, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery("chat-links", {
        queryFn: async ({ pageParam = 1 }) => {
            const response = await getChats(pageParam)
            if (response.ok) {
                return response.json();
            }
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.nextPage
            }
        }
    });

    const { auth, setAuth } = useAuthContext();
    const navigate = useNavigate();

    return <aside className="menu prose relative p-10 bg-base-300 flex flex-col">
        <h1 className="text-3xl">Chats</h1>
        <div className="pt-10 flex flex-col gap-6 overflow-auto h-5/6">
            <CreateChatButton refetch={refetch} />
            <nav className="flex flex-col overflow-y-auto h-1/2">
                <ul>
                    {
                        data && [].concat(...data.pages.map(page => page.chats)).map(chat => <ChatLink key={chat._id} chat={chat} refetch={refetch} />)
                    }
                </ul>
                {hasNextPage && <button data-testid="load-more-chats-btn" className="mt-2 btn btn-sm text-xs" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>Load More <ChevronDownIcon color="black" height={20} width={20} /> </button>}
            </nav>
        </div>
        <div className="mt-auto flex gap-3 items-center">
            {auth.profilePicture && <img className="h-12 w-12 rounded-full" src={auth.profilePicture} alt={`${auth.firstName} ${auth.lastName}`} />}
            <div>
                <p className="font-bold">{`${auth.firstName} ${auth.lastName}`}</p>
                <span className="text-gray-600 text-sm">{auth?.email}</span>
                <span className="text-gray-600">{auth?.username}</span>
            </div>
            <button title="logout" className="btn btn-ghost" onClick={async () => {
                const response = await logout();
                if (response.ok) {
                    setAuth(null);
                    navigate("/login");
                }
            }}>
                <ArrowLeftStartOnRectangleIcon height={20} width={20} />
            </button>
        </div>
    </aside>
}