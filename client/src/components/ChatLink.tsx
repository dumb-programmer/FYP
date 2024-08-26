import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import EditChatForm from "./EditChatForm";
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteChat } from "@/api/api";

export default function ChatLink({ chat, refetch }) {
    const [edit, setEdit] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const deleteChatModalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const onClick = () => {
            if (dropdownOpen) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", onClick);

        return () => {
            document.removeEventListener("click", onClick);
        }

    }, [dropdownOpen]);

    return !edit ? <div className="relative">
        <li className="-z-0">
            <NavLink className="flex justify-between" to={`/${chat._id}`}>
                {chat.name}
                <button data-testid="open-chat-actions-dropdown-btn" className="btn btn-ghost btn-xs" onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDropdownOpen(open => !open)
                }}>
                    <EllipsisHorizontalIcon height={20} width={20} className="text-fuchsia-50" />
                </button>
            </NavLink>
        </li>
        <div data-testid="chat-actions-dropdown" className={`absolute right-0 z-10 overflow-hidden dropdown${dropdownOpen ? "dropdown-open" : ""}`}>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                    <button className="text-xs" onClick={() => setEdit(true)}>
                        <PencilIcon height={15} width={15} />
                        Rename
                    </button>
                </li>
                <li>
                    <button className="text-xs" onClick={() => deleteChatModalRef.current?.showModal()}>
                        <TrashIcon height={15} width={15} />
                        Delete
                    </button>
                </li>
            </ul>
        </div>
        <div className="flex gap-2">
            <DeleteConfirmationModal title="Delete Chat" description="Are you sure you want to delete this chat? This action is non-recoverable" dialogRef={deleteChatModalRef} onDelete={async () => {
                const response = await deleteChat(chat._id);
                if (response.ok) {
                    refetch()
                    deleteChatModalRef.current?.close();
                }
            }} onCancel={() => {
                deleteChatModalRef.current?.close();
            }} />
        </div>
    </div> : <EditChatForm chat={chat} refetch={refetch} onCancel={() => setEdit(false)} />

}