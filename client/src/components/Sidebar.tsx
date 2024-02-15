import useAuthContext from "@/hook/useAuthContext";
import { useQuery } from "react-query"
import { NavLink, useNavigate } from "react-router-dom";
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

    return <aside>
        <h1>Chats</h1>
        <CreateChatButton />
        <nav>
            <ul>
                {
                    chats?.map(chat => <ChatLink key={chat._id} chat={chat} refetch={refetch} />)
                }
            </ul>
        </nav>
        <div className="user-controls">
            <p>{`${auth.firstName} ${auth.lastName}`}</p>
            <button onClick={async () => {
                const response = await fetch("http://localhost:3000/logout", { method: "POST", mode: "cors", credentials: "include" });
                if (response.ok) {
                    setAuth(null);
                    navigate("/login");
                }
            }}>Logout</button>
        </div>
    </aside>
}