import Message from "@/components/Message";
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

    return <div>
        <h2>{chatId}</h2>
        <div className="p-10 flex flex-col gap-10">
            <MessageList messages={messages}/>
        </div>
        <div className="fixed bottom-0 w-screen">
            <form className="flex" onSubmit={handleSubmit(async (data) => {
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
                <input className="input flex-1" type="text" placeholder="prompt..." {...register("prompt")} />
                <button>Send</button>
            </form>
        </div>
    </div>;
}