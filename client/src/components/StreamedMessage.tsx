import useSocketContext from "@/hook/useSocketContext";
import Message from "./Message";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

type StreamedMessageProps = {
    chatId: string;
}

export default function StreamedMessage({ chatId }: StreamedMessageProps) {
    const socket = useSocketContext();
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const query = useQueryClient();

    useEffect(() => {
        const onMessage = async ({ prompt, word, more }: { prompt: string, word: string, more: boolean }) => {
            if (more) {
                setPrompt(prompt)
                setResponse(response => response + word)
            }
            else {
                await query.invalidateQueries({ queryKey: `chat-${chatId}` })
                setResponse("");
                setPrompt("");
            }
        }

        socket.on("message", onMessage)

        return () => {
            socket.off("message", onMessage)
        }
    }, [socket, chatId, query]);

    return response && <Message message={{ _id: crypto.randomUUID(), prompt, response, createdAt: Date.now() }} cursor />;
}