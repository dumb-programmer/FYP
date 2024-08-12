import { TrashIcon } from "@heroicons/react/16/solid";
import CopyToClipboard from "./CopyToClipboardButton";
import PositiveFeedbackButton from "./PositiveFeedbackButton";
import NegativeFeedbackButton from "./NegativeFeedbackButton";

type MessageProps = {
    message: any;
    onThumbsUp: () => void;
    onThumbsDown: () => void;
    onDelete?: () => void;
    cursor?: boolean;
}

export default function Message({ message, onThumbsUp, onThumbsDown, onDelete, cursor = false }: MessageProps) {
    return <div data-testid="message" key={message._id} className="flex flex-col gap-8">
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
                    <span data-testid="cursor-icon" className="absolute ml-2 mt-[3px] w-[2px] h-[20px] bg-slate-700 rounded-sm animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                }
            </p>
        </div>
        {
            onDelete && <div className="flex justify-start pl-20 gap-2">
                <button title="delete-button" className="btn btn-sm btn-ghost" onClick={onDelete}><TrashIcon color="red" height={15} width={15} /></button>
                <CopyToClipboard data={message.response} />
                <PositiveFeedbackButton onClick={onThumbsUp} />
                <NegativeFeedbackButton onClick={onThumbsDown} />
            </div>
        }
    </div>
}