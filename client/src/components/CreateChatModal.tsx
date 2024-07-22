import { useForm } from "react-hook-form";
import { Action, Content, Header, Modal } from "./modal";
import { createChat } from "@/api/api";

export default function CreateChatModal({ dialogRef }: { dialogRef: React.MutableRefObject<HTMLDialogElement | null> }) {
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
        }
    });

    return <Modal dialogRef={dialogRef}>
        <Header>
            <h1 className="text-2xl font-bold">Create Chat</h1>
        </Header>
        <Content>
            <form className="flex flex-col gap-4 mt-4">
                <div className="form-control">
                    <label htmlFor="name">Name</label>
                    <input className="input input-bordered" type="text" {...register("name")} required />
                </div>
                <div className="form-control">
                    <label htmlFor="document">Document</label>
                    <input id="document" className="input file-input -ml-4 mt-2" type="file" {...register("document")} required />
                </div>
            </form>
        </Content>
        <Action>
            <button className="btn btn-ghost" type="button" onClick={() => dialogRef.current?.close()}>Cancel</button>
            <button className={`btn btn-primary${isSubmitting ? " loading loading-spinner" : ""}`} type="submit" onClick={onSubmit}>Create</button>
        </Action>
    </Modal>
}