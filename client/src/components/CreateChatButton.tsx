import { useRef } from "react";
import CreateChatModal from "./CreateChatModal";

export default function CreateChatButton() {
    const chatModalRef = useRef<HTMLDialogElement>(null);

    return <>
        <button onClick={() => chatModalRef.current?.showModal()}>Create Chat</button>
        <CreateChatModal dialogRef={chatModalRef} />
    </>
}