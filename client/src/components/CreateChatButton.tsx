import { useRef } from "react";
import CreateChatModal from "./CreateChatModal";
import { PlusIcon } from "@heroicons/react/16/solid";

export default function CreateChatButton() {
    const chatModalRef = useRef<HTMLDialogElement>(null);

    return <>
        <button className="btn ghost" onClick={() => chatModalRef.current?.showModal()}>
            <PlusIcon height={20} width={20} />
            Create Chat
        </button>
        <CreateChatModal dialogRef={chatModalRef} />
    </>
}