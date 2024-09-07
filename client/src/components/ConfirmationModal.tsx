import { Action, Content, Header, Modal } from "./modal";

export default function ConfirmationModal({ dialogRef, title, description, primaryBtnClass = "btn-error", primaryBtnText = "Delete", onPrimary, onCancel }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null>, title: string, description: string, primaryBtnClass?: string, primaryBtnText?: string, onPrimary: () => void, onCancel: () => void }) {
    return <Modal dialogRef={dialogRef}>
        <Header>
            <h1 className="text-xl font-bold">
                {title}
            </h1>
        </Header>
        <Content>
            <p className="mt-4">
                {description}
            </p>
        </Content>
        <Action>
            <button data-testid="delete-confirmation-dialog-cancel-btn" className="btn" onClick={onCancel}>Cancel</button>
            <button data-testid="delete-confirmation-dialog-delete-btn" className={`btn ${primaryBtnClass}`} onClick={onPrimary}>{primaryBtnText}</button>
        </Action>
    </Modal>
}