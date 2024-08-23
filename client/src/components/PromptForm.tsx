import { sendPrompt } from "@/api/api";
import useSocketContext from "@/hooks/useSocketContext";
import { PaperAirplaneIcon, StopIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

export default function PromptForm() {
    const { handleSubmit, register, formState: { isSubmitting } } = useForm({
        defaultValues: {
            prompt: ""
        }
    });

    const { chatId } = useParams();
    const socket = useSocketContext();
    const [isCancelable, setIsCancelable] = useState(false)
    const queryClient = useQueryClient();

    useEffect(() => {
        const onMessageStart = () => setIsCancelable(true);
        const onMessageStop = () => {
            setIsCancelable(false);
            queryClient.invalidateQueries(`chat-${chatId}`)
        }

        socket.on("message-start", onMessageStart);
        socket.on("message-stop", onMessageStop);

        return () => {
            socket.off("message-start", onMessageStart);
            socket.off("message-stop", onMessageStop);
        }
    }, [socket, queryClient, chatId]);

    return (
        <form data-testid="prompt-form" className="flex gap-2 w-4/5" onSubmit={!isCancelable ? handleSubmit(async (data) => {
            await sendPrompt(data, chatId);
        }) : (e) => {
            e.preventDefault();
            socket.emit(`${chatId}-stop`);
        }}>
            <input className="input input-bordered flex-1" type="text" placeholder="Prompt..." {...register("prompt")} required />
            <button aria-label="send" className={`btn btn-primary ${isSubmitting ? "loading loading-spinner" : ""}`}>
                {
                    !isCancelable ? <PaperAirplaneIcon height={20} width={20} /> : <StopIcon height={20} width={20} />
                }
            </button>
        </form>
    )
}
