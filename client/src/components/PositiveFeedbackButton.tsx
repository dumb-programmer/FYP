import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbsUpIconSolid } from "@heroicons/react/16/solid";

export default function PositiveFeedbackButton({ filled, onClick }: { filled: boolean, onClick: (() => void) | undefined }) {
    return <button className="btn btn-sm btn-ghost disabled:bg-transparent" title="thumbs-up" onClick={onClick} disabled={!onClick}>
        {
            filled ? <HandThumbsUpIconSolid height={15} width={15} color="#696969" data-testid="filled-thumbs-up-icon" /> : <HandThumbUpIcon height={15} width={15} color="#696969" data-testid="thumbs-up-icon" />
        }
    </button>
}