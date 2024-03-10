import useAuthContext from "@/hook/useAuthContext";
import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import CreateChatButton from "./CreateChatButton";
import ChatLink from "./ChatLink";

export default function Sidebar() {
    const { data: chats, refetch } = useQuery("chat-links", {
        queryFn: async () => {
            const response = await fetch("http://localhost:3000/chats", { mode: "cors", credentials: "include" })
            if (response.ok) {
                return response.json();
            }
        }
    });

    const { auth, setAuth } = useAuthContext();
    const navigate = useNavigate();

    return <aside className="menu prose relative p-10">
        <h1 className="text-3xl">Chats</h1>
        <div className="mt-10 flex flex-col gap-4">
            <CreateChatButton />
            <nav>
                <ul>
                    {
                        chats?.map(chat => <ChatLink key={chat._id} chat={chat} refetch={refetch} />)
                    }
                </ul>
            </nav>
        </div>
        <div className="absolute bottom-4 flex gap-2 items-center">
            <p>{`${auth.firstName} ${auth.lastName}`}</p>
            <button className="btn btn-outline" onClick={async () => {
                const response = await fetch("http://localhost:3000/logout", { method: "POST", mode: "cors", credentials: "include" });
                if (response.ok) {
                    setAuth(null);
                    navigate("/login");
                }
            }}>Logout</button>
        </div>
    </aside>
}