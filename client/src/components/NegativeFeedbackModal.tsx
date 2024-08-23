import React from "react";
import { Action, Content, Header, Modal } from "./modal";
import NegativeFeedbackForm from "./NegativeFeedbackForm";

const formId = "negative-feedback-form";
export default function NegativeFeedbackModal({ dialogRef, messageId, onCancel, onSuccess }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null>, messageId: string | null, onCancel: () => void, onSuccess: () => void }) {
    return <Modal dialogRef={dialogRef}>
        <Header>
            <h1 className="text-xl font-bold mb-8">Help Us Improve</h1>
        </Header>
        <Content>
            <NegativeFeedbackForm id={formId} messageId={messageId} onSuccess={onSuccess} />
        </Content>
        <Action>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button form={formId} type="submit" className="btn btn-primary">Submit</button>
        </Action>
    </Modal>;
}