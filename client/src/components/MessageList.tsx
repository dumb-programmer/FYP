import { useRef, useState } from "react";
import Message from "./Message";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useParams } from "react-router-dom";
import { deleteMessage } from "@/api/api";
import PositiveFeedbackModal from "./PositiveFeedbackModal";
import NegativeFeedbackModal from "./NegativeFeedbackModal";

// TODO: Use a single modal, with changing form depending upon which buttons was clicked

export default function MessageList({ messages, refetchMessages }) {
    const deleteMessageDialogRef = useRef<HTMLDialogElement>(null);
    const positiveFeedbackFormRef = useRef<HTMLDialogElement>(null);
    const negativeFeedbackFormRef = useRef<HTMLDialogElement>(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const { chatId } = useParams();

    return <>
        {messages?.map(message => <Message
            key={message._id}
            message={message}
            onDelete={() => {
                setSelectedMessageId(message._id);
                deleteMessageDialogRef.current?.showModal()
            }}
            onThumbsUp={() => {
                setSelectedMessageId(message._id);
                positiveFeedbackFormRef.current?.showModal()
            }}
            onThumbsDown={() => {
                setSelectedMessageId(message._id);
                negativeFeedbackFormRef.current?.showModal()
            }}
        />)}
        <DeleteConfirmationModal dialogRef={deleteMessageDialogRef} title="Delete Message" description="Are you sure you want to delete this message? This action is non-recoverable" onDelete={async () => {
            const response = await deleteMessage(chatId, selectedMessageId);
            if (response.ok) {
                refetchMessages()
                deleteMessageDialogRef.current?.close()
            }
        }} onCancel={() => {
            deleteMessageDialogRef.current?.close();
            setSelectedMessageId(null);
        }} />
        <PositiveFeedbackModal
            dialogRef={positiveFeedbackFormRef}
            messageId={selectedMessageId}
            onCancel={() => {
                positiveFeedbackFormRef.current?.close();
                setSelectedMessageId(null);
            }}
            onSuccess={() => {
                refetchMessages();
                positiveFeedbackFormRef.current?.close();
                setSelectedMessageId(null);
            }} />
        <NegativeFeedbackModal
            dialogRef={negativeFeedbackFormRef}
            messageId={selectedMessageId}
            onCancel={() => {
                negativeFeedbackFormRef.current?.close();
                setSelectedMessageId(null);
            }}
            onSuccess={() => {
                refetchMessages();
                positiveFeedbackFormRef.current?.close();
                setSelectedMessageId(null);
            }}

        />

    </>
}