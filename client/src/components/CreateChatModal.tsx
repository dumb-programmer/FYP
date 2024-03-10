import { useForm } from "react-hook-form";
import { Action, Content, Header, Modal } from "./modal";

const formId = "create-chat-form";
export default function CreateChatModal({ dialogRef }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null> }) {
    const { handleSubmit, register, reset } = useForm({
        defaultValues: {
            name: "",
            document: ""
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();
        formData.set("name", data.name);
        formData.set("document", data.document[0]);
        const response = await fetch("http://localhost:3000/chats", { method: "POST", body: formData, credentials: "include", mode: "cors" });
        if (response.ok) {
            reset();
        }
    });

    return <Modal dialogRef={dialogRef}>
        <Header>
            <h1 className="text-2xl font-bold">Create Chat</h1>
        </Header>
        <Content>
            <form className="flex flex-col gap-4" id={formId} onSubmit={onSubmit}>
                <div className="form-control">
                    <label htmlFor="name">Name</label>
                    <input className="input input-bordered" type="text" {...register("name")} />
                </div>
                <div className="form-control">
                    <label htmlFor="document">Document</label>
                    <input className="input file-input" type="file" {...register("document")} />
                </div>
            </form>
        </Content>
        <Action>
            <button className="btn btn-ghost" type="button" onClick={() => dialogRef.current?.close()}>Cancel</button>
            <button className="btn btn-primary" type="submit" form={formId}>Create</button>
        </Action>
    </Modal>
}