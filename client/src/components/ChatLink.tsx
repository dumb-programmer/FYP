import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import EditChatForm from "./EditChatForm";
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import ConfirmationModal from "./ConfirmationModal";
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

    return <div>
        {
            !edit ? <div className="relative">
                <li>
                    <NavLink className="flex justify-between" to={`/${chat._id}`}>
                        {chat.name}
                        <button className="btn btn-ghost btn-xs" onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDropdownOpen(open => !open)
                        }}>
                            <EllipsisHorizontalIcon height={20} width={20} className="text-fuchsia-50" />
                        </button>
                    </NavLink>
                </li>
                <div className={`absolute right-0 dropdown${dropdownOpen ? "dropdown-open" : ""}`}>
                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <button onClick={() => setEdit(true)}>
                                <PencilIcon height={20} width={20} />
                                Rename
                            </button>
                        </li>
                        <li>
                            <button onClick={() => deleteChatModalRef.current?.showModal()}>
                                <TrashIcon height={20} width={20} />
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="flex gap-2">
                    <ConfirmationModal dialogRef={deleteChatModalRef} onDelete={async () => {
                        const response = await deleteChat(chat._id);
                        if (response.ok) {
                            refetch()
                        }
                    }} />
                </div>
            </div> : <EditChatForm chat={chat} refetch={refetch} onCancel={() => setEdit(false)} />
        }
    </div>
}