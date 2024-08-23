import { sendFeedback } from "@/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const options = ["offensive/unsafe", "not-factually-correct", "other"] as const;

const schema = z.object({ category: z.enum(options), comments: z.string().max(100) });
export default function NegativeFeedbackForm({ id, messageId, onSuccess }: { id: string, messageId: string, onSuccess: () => void }) {
    const { handleSubmit, watch, register, formState } = useForm({
        defaultValues: {
            category: options[0],
            comments: ""
        },
        resolver: zodResolver(schema)
    });

    const onSubmit = handleSubmit(async (data) => {
        if (!formState.isSubmitting) {
            const response = await sendFeedback({ ...data, type: "negative", messageId })
            if (response.ok) {
                onSuccess();
            }
        }
    });

    return <form id={id} className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="form-control flex flex-wrap gap-4 flex-row text-sm">
            {
                options.map(option => <label key={option} className={`flex items-center gap-2 relative bg-gray-200 p-4 rounded-xl w-fit cursor-pointer hover:bg-gray-300 transition-all ${watch("category") === option ? "bg-slate-800 text-white hover:bg-slate-700" : ""}`}>
                    <input type="radio" className="radio radio-primary invisible absolute" value={option} {...register("category", { required: true })} />
                    {option.split("-").join(" ")}
                </label>)
            }
        </div>
        <textarea className="textarea input-bordered" placeholder="(Optional) Something else you'd like to say"  {...register("comments")} ></textarea>
    </form>
}