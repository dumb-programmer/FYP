import { TrashIcon } from "@heroicons/react/16/solid";
import CopyToClipboard from "./CopyToClipboardButton";

type MessageProps = {
    message: any;
    onDelete?: () => void;
    cursor: boolean;
}

export default function Message({ message, onDelete, cursor = false }: MessageProps) {
    return <div key={message._id} className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-accent rounded-full flex items-center justify-center text-slate-50 font-bold">User</div>
            <p className="flex-1">{message.prompt}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-info rounded-full flex items-center justify-center text-slate-50 font-bold">AI</div>
            <p className="relative flex-1">
                {message.response}
                {
                    cursor &&
                    <span className="absolute ml-2 mt-[3px] w-[2px] h-[20px] bg-slate-700 rounded-sm animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                }
            </p>
        </div>
        {
            onDelete && <div className="flex justify-start pl-20 gap-2">
                <button className="btn btn-sm btn-ghost" onClick={onDelete}><TrashIcon color="red" height={15} width={15} /></button>
                <CopyToClipboard data={message.response} />
            </div>
        }
    </div>
}