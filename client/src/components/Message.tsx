export default function Message({ message }) {
    return <div key={message._id} className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-accent rounded-full flex items-center justify-center text-slate-50 font-bold">User</div>
            <p className="flex-1">{message.prompt}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-info rounded-full flex items-center justify-center text-slate-50 font-bold">AI</div>
            <p className="flex-1">{message.response}</p>
        </div>
    </div>
}