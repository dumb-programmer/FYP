import { updateChat } from "@/api/api";
import { useState } from "react"

export default function EditChatForm({ chat, refetch, onCancel }) {
    const [name, setName] = useState(chat.name);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await updateChat(chat._id, name);
        if (response.ok) {
            onCancel();
            refetch();
        }
    }

    return <form data-testid="edit-chat-form" className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input className="input input-bordered" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex justify-end gap-2">
            <button className="btn btn-sm text-xs" type="button" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary btn-sm text-xs" type="submit">Submit</button>
        </div>
    </form>;
}