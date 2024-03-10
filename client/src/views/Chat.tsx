import MessageList from "@/components/MessageList";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Chat() {
    const { chatId } = useParams();
    const { data: messages } = useQuery(`chat-${chatId}`, {
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/chats/${chatId}/messages`, { mode: "cors", credentials: "include" });
            if (response.ok) {
                return await response.json();
            }
        }
    });
    const { handleSubmit, register } = useForm({
        defaultValues: {
            prompt: ""
        }
    })

    return <div className="flex flex-col h-screen overflow-hidden">
        <h2>{chatId}</h2>
        <div className="flex-1 p-10 flex flex-col gap-10 overflow-y-auto">
            <MessageList messages={messages}/>
        </div>
        <div className="flex justify-center p-5 bg-slate-200 w-full">
            <form className="flex gap-2 w-4/5" onSubmit={handleSubmit(async (data) => {
                const response = await fetch(`http://localhost:3000/chats/${chatId}`, {
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            })}>
                <input className="input input-borderd flex-1" type="text" placeholder="Prompt..." {...register("prompt")} />
                <button className="btn btn-primary">Send</button>
            </form>
        </div>
    </div>;
}