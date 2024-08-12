import { HandThumbUpIcon } from "@heroicons/react/16/solid";

export default function PositiveFeedbackButton({ onClick }: { onClick: () => void }) {
    return <button className="btn btn-sm btn-ghost" onClick={onClick}>
        <HandThumbUpIcon height={15} width={15} color="#696969" />
    </button>;
}