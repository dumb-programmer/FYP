import { useRef } from "react";
import CreateChatModal from "./CreateChatModal";
import { PlusIcon } from "@heroicons/react/16/solid";

export default function CreateChatButton({ refetch }: { refetch: () => void }) {
    const chatModalRef = useRef<HTMLDialogElement>(null);

    return <>
        <button data-testid="create-chat-btn" className="btn ghost" onClick={() => chatModalRef.current?.showModal()}>
            <PlusIcon height={20} width={20} />
            Create Chat
        </button>
        <CreateChatModal dialogRef={chatModalRef} refetch={refetch} />
    </>
}