import { useRef, useState } from "react";
import Message from "./Message";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useParams } from "react-router-dom";
import { deleteMessage } from "@/api/api";

export default function MessageList({ messages, refetchMessages, }) {
    const deleteMessageDialogRef = useRef<HTMLDialogElement>(null);
    const [selectedMessageId, setSelectedMessageId] = useState();
    const { chatId } = useParams();

    return <>
        {messages?.map(message => <Message key={message._id} message={message} onDelete={() => {
            setSelectedMessageId(message._id);
            deleteMessageDialogRef.current?.showModal()
        }} />)}
        <DeleteConfirmationModal dialogRef={deleteMessageDialogRef} title="Delete Message" description="Are you sure you want to delete this message? This action is non-recoverable" onDelete={async () => {
            const response = await deleteMessage(chatId, selectedMessageId);
            if (response.ok) {
                refetchMessages()
                deleteMessageDialogRef.current?.close()
            }
        }} />
    </>
}