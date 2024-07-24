import { useId } from "react";

export default function Modal({ dialogRef, children }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null>, children: React.ReactNode }) {
    return <dialog data-testid="modal" className="modal" id={useId()} ref={dialogRef}>
        <div className="modal-box">
            {children}
        </div>
    </dialog>;
}