import { HandThumbDownIcon } from "@heroicons/react/24/outline";
import { HandThumbDownIcon as HandThumbsDownIconSolid } from "@heroicons/react/16/solid";

export default function NegativeFeedbackButton({ filled, onClick }: { filled: boolean, onClick: () => void | undefined }) {
    return <button className="btn btn-sm btn-ghost disabled:bg-transparent" title="thumbs-down" onClick={onClick} disabled={!onClick}>
        {
            filled ? <HandThumbsDownIconSolid height={15} width={15} color="#696969" data-testid="filled-thumbs-down-icon" /> : <HandThumbDownIcon height={15} width={15} color="#696969" data-testid="thumbs-down-icon" />
        }
    </button>
}