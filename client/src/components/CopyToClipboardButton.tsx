import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid"
import { useEffect, useState } from "react"

export default function CopyToClipboard({ data }) {
    const [copied, setCopied] = useState(false);


    useEffect(() => {

        let timerId: number;
        if (copied) {
            timerId = setTimeout(() => setCopied(false), 1000)
        }

        return () => {
            if (timerId) {
                clearTimeout(timerId)
            }
        }

    }, [copied])
    return <button className="btn btn-sm btn-ghost" onClick={() => {
        navigator.clipboard.writeText(data)
        setCopied(true)
    }}>{
            copied ? <ClipboardDocumentCheckIcon color="#696969" height={15} width={15} /> : <ClipboardDocumentIcon color="#696969" height={15} width={15} />
        }
    </button>
}