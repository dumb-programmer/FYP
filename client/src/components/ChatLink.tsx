import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import EditChatForm from "./EditChatForm";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import ConfirmationModal from "./ConfirmationModal";

export default function ChatLink({ chat, refetch }) {
    const [edit, setEdit] = useState(false);
    const deleteChatModalRef = useRef<HTMLDialogElement>(null);

    return <div key={chat._id}>
        {
            !edit ? <>
                <li><NavLink to={`/${chat._id}`}>{chat.name}</NavLink></li>
                <div className="flex gap-2">
                    <button onClick={() => setEdit(true)}>
                        <PencilIcon height={20} width={20} />
                    </button>
                    <button onClick={() => deleteChatModalRef.current?.showModal()}>
                        <TrashIcon height={20} width={20} />
                    </button>
                    <ConfirmationModal dialogRef={deleteChatModalRef} onDelete={async () => {
                        const response = await fetch(`http://localhost:3000/chats/${chat._id}`, {
                            method: "DELETE",
                            credentials: "include",
                            mode: "cors"
                        });
                        if (response.ok) {
                            refetch()
                        }
                    }} />
                </div>
            </> : <EditChatForm chat={chat} refetch={refetch} onCancel={() => setEdit(false)} />
        }
    </div>
}