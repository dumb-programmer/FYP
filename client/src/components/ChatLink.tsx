import { useState } from "react";
import { NavLink } from "react-router-dom";
import EditChatForm from "./EditChatForm";

export default function ChatLink({ chat, refetch }) {
    const [edit, setEdit] = useState(false);

    return <div key={chat._id}>
        {
            !edit ? <>
                <li><NavLink to={`/${chat._id}`}>{chat.name}</NavLink></li>
                <button onClick={() => setEdit(true)}>Edit</button>
                <button onClick={async () => {
                    const response = await fetch(`http://localhost:3000/chats/${chat._id}`, {
                        method: "DELETE",
                        credentials: "include",
                        mode: "cors"
                    });
                    if (response.ok) {
                        refetch()
                    }
                }}>Delete</button>
            </> : <EditChatForm chat={chat} refetch={refetch} onCancel={() => setEdit(false)} />
        }
    </div>
}