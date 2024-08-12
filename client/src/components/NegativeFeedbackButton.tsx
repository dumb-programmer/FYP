import { HandThumbDownIcon } from "@heroicons/react/16/solid";

export default function NegativeFeedbackButton({ onClick }: { onClick: () => void }) {
    return <button className="btn btn-sm btn-ghost" onClick={onClick}>
        <HandThumbDownIcon height={15} width={15} color="#696969" />
    </button>
}