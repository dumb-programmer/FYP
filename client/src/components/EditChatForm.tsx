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

    return <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={onCancel}>Cancel</button>
        <button type="submit">Submit</button>
    </form>;
}