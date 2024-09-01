import { login } from "@/api/api";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingIcon from "@/components/LoadingIcon";
import { LoginSchema } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(LoginSchema)
    });
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data) => {
        const response = await login(data);
        if (response.ok) {
            const responseData = await response.json();
            if (responseData && responseData.role === "admin") {
                navigate("/admin/dashboard");
                return;
            }
        }
        setError("root", { message: "Invalid credentials" });
    });

    return <main className="min-h-screen w-screen flex justify-center items-center">
        <div className="card p-10 shadow-md">
            <form className="flex flex-col gap-4 md:min-w-96" onSubmit={onSubmit}>
                <h1 className="card-title text-2xl">Admin</h1>
                <div className="form-control">
                    <label className="label" htmlFor="email">Email</label>
                    <input className="input input-bordered" id="email" {...register("email")} />
                    <ErrorMessage message={errors.email?.message} />
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="password">Password</label>
                    <input className="input input-bordered" id="password" type="password" {...register("password")} />
                    <ErrorMessage message={errors.password?.message} />
                </div>
                <ErrorMessage message={errors.root?.message} />
                <button className="btn btn-primary">
                    {
                        isSubmitting ? <LoadingIcon size={25} stroke="white" /> : "Login"
                    }
                </button>
            </form>
        </div>
    </main>;
}