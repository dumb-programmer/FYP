import { getMessages, sendPrompt } from "@/api/api";
import MessageList from "@/components/MessageList";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Chat() {
    const { chatId } = useParams();
    const { data: messages } = useQuery(`chat-${chatId}`, {
        queryFn: async () => {
            const response = await getMessages(chatId);
            if (response.ok) {
                return await response.json();
            }
        }
    });
    const { handleSubmit, register, formState: { isSubmitting } } = useForm({
        defaultValues: {
            prompt: ""
        }
    })

    return <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-1 p-10 flex flex-col gap-10 overflow-y-auto">
            <MessageList messages={messages} />
        </div>
        <div className="flex justify-center p-5 bg-base-100 w-full">
            <form className="flex gap-2 w-4/5" onSubmit={handleSubmit(async (data) => {
                await sendPrompt(data, chatId);
            })}>
                <input className="input input-bordered flex-1" type="text" placeholder="Prompt..." {...register("prompt")} />
                <button aria-label="send" className={`btn btn-primary ${isSubmitting ? "loading loading-spinner" : ""}`}><PaperAirplaneIcon height={20} width={20} /></button>
            </form>
        </div>
    </div>;
}