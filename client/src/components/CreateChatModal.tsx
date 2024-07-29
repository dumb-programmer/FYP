import { useForm } from "react-hook-form";
import { Action, Content, Header, Modal } from "./modal";
import { createChat } from "@/api/api";

const formId = "create-chat-form";
export default function CreateChatModal({ dialogRef, refetch }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null>, refetch: () => void }) {
    const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            name: "",
            document: ""
        }
    });

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();
        formData.set("name", data.name);
        formData.set("document", data.document[0]);
        const response = await createChat(formData);
        if (response.ok) {
            reset();
            refetch();
            dialogRef.current?.close()
        }
    });

    return <Modal dialogRef={dialogRef}>
        <Header>
            <h1 className="text-2xl font-bold">Create Chat</h1>
        </Header>
        <Content>
            <form id={formId} className="flex flex-col gap-4 mt-4" onSubmit={onSubmit}>
                <div className="form-control">
                    <label htmlFor="name">Name</label>
                    <input id="name" className="input input-bordered" type="text" {...register("name")} required />
                </div>
                <div className="form-control">
                    <label htmlFor="document">Document</label>
                    <input id="document" className="input file-input -ml-4 mt-2" type="file" {...register("document")} required />
                </div>
            </form>
        </Content>
        <Action>
            <button className="btn btn-ghost" type="button" onClick={() => dialogRef.current?.close()}>Cancel</button>
            <button form={formId} className={`btn btn-primary${isSubmitting ? " loading loading-spinner" : ""}`} type="submit">Create</button>
        </Action>
    </Modal>
}