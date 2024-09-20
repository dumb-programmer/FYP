import useAuthContext from "@/hooks/useAuthContext";
import { useInfiniteQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import CreateChatButton from "./CreateChatButton";
import ChatLink from "./ChatLink";
import { ArrowLeftStartOnRectangleIcon, Bars3Icon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { getChats, logout } from "@/api/api";
import { useLayoutEffect, useState } from "react";

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
    const [show, setShow] = useState(false);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setShow(true);
            } else {
                setShow(false);
            }
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return <>
        {
            !show && <button className="btn btn-sm fixed top-6 left-2 z-10" onClick={() => setShow(show => !show)} title="open sidebar">
                <ChevronRightIcon height={18} width={18} />
            </button>
        }
        <aside className={`absolute lg:relative h-full z-10 menu prose bg-base-300 flex flex-col transition-all origin-left duration-150 ${!show ? "w-0 overflow-hidden bg-transparent" : "w-[300px] scale-x-100 after:content-[''] after:fixed after:inset-0 after:w-[calc(100vw-300px)] after:bg-black/50 after:left-[300px] after:-z-10 md:after:content-none"}`}>
            <button className="btn btn-sm absolute top-7 right-5 z-10" onClick={() => setShow(show => !show)} title="collapse sidebar">
                <ChevronLeftIcon height={18} width={18} />
            </button>
            <div className="flex flex-col justify-between h-full p-6">
                <div>
                    <h1 className="mt-10 text-3xl">Chats</h1>
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
                </div>
                <div className="flex justify-between gap-3 items-center w-full">
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
            </div>
        </aside>
    </>
}