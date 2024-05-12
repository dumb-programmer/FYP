import { Action, Content, Header, Modal } from "./modal";

export default function ConfirmationModal({ dialogRef, onDelete }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null>, onDelete: () => void }) {
    return <Modal dialogRef={dialogRef}>
        <Header>
            <h1 className="text-xl font-bold">
                Delete Chat
            </h1>
        </Header>
        <Content>
            <p className="mt-4">
                Are you sure you want to delete this chat? This action is non-recoverable
            </p>
        </Content>
        <Action>
            <button className="btn" onClick={() => dialogRef.current?.close()}>Cancel</button>
            <button className="btn btn-error" onClick={onDelete}>Delete</button>
        </Action>
    </Modal>
}