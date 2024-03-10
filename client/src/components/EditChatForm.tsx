import { useState } from "react"

export default function EditChatForm({ chat, refetch, onCancel }) {
    const [name, setName] = useState(chat.name);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:3000/chats/${chat._id}`, {
            method: "PATCH",
            body: JSON.stringify({ name }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            mode: "cors"
        });
        if (response.ok) {
            onCancel();
            refetch();
        }
    }

    return <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input className="input input-bordered" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex justify-end gap-2">
            <button className="btn" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary" type="submit">Submit</button>
        </div>
    </form>;
}