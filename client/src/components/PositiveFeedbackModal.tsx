import React from "react";
import { Action, Content, Header, Modal } from "./modal";
import PositiveFeedbackForm from "./PositiveFeedbackForm";

const formId = "positive-feedback-form";
export default function PositiveFeedbackModal({ dialogRef, messageId, onCancel, onSuccess }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null>, messageId: string | null, onCancel: () => void, onSuccess: () => void }) {
    return <Modal dialogRef={dialogRef}>
        <Header>
            <h1 className="text-xl font-bold mb-8">Share What You Loved!</h1>
        </Header>
        <Content>
            <PositiveFeedbackForm id={formId} messageId={messageId} onSuccess={onSuccess} />
        </Content>
        <Action>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button form={formId} type="submit" className="btn btn-primary">Submit</button>
        </Action>
    </Modal>;
}