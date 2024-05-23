import { sendPrompt } from "@/api/api";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

export default function PromptForm() {
    const { handleSubmit, register, formState: { isSubmitting } } = useForm({
        defaultValues: {
            prompt: ""
        }
    });

    const { chatId } = useParams();

    return (
        <form className="flex gap-2 w-4/5" onSubmit={handleSubmit(async (data) => {
            await sendPrompt(data, chatId);
        })}>
            <input className="input input-bordered flex-1" type="text" placeholder="Prompt..." {...register("prompt")} />
            <button aria-label="send" className={`btn btn-primary ${isSubmitting ? "loading loading-spinner" : ""}`}><PaperAirplaneIcon height={20} width={20} /></button>
        </form>
    )
}
