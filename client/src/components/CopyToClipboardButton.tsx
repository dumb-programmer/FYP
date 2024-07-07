import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid"
import { useEffect, useState } from "react"

export default function CopyToClipboard({ data }: { data: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout;
        if (copied) {
            timerId = setTimeout(() => setCopied(false), 1000)
        }

        return () => {
            if (timerId) {
                clearTimeout(timerId)
            }
        }

    }, [copied])

    return <button title="copy-to-clipboard" className="btn btn-sm btn-ghost" onClick={() => {
        navigator.clipboard.writeText(data)
        setCopied(true)
    }}>
        {
            copied ? <ClipboardDocumentCheckIcon title="clipboard-document-check-icon" color="#696969" height={15} width={15} /> : <ClipboardDocumentIcon title="clipboard-document-icon" color="#696969" height={15} width={15} />
        }
    </button>
}