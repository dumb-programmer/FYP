import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/schema";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "@/components/LoadingIcon";
import AuthProviderBtns from "@/components/AuthProviderBtns";
import ErrorMessage from "@/components/ErrorMessage";
import { login } from "@/api/api";

export default function Login() {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(LoginSchema)
    });
    const navigate = useNavigate();

    return <main className="min-h-screen w-screen flex justify-center items-center">
        <div className="card p-10 shadow-md">
            <form className="flex flex-col gap-4 md:min-w-96" onSubmit={handleSubmit(async (data) => {
                const response = await login(data);
                if (response.ok) {
                    navigate("/");
                }
                else {
                    setError("root", {
                        message: "Invalid credentials"
                    });
                }
            })}>
                <h1 className="card-title text-2xl">Login</h1>
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
                        isSubmitting ? <LoadingIcon size={25} stroke="white" /> : "Submit"
                    }
                </button>
                <p className="text-gray-500">Don't have an account? <Link className="link" to="/signup">Signup</Link></p>
                <div className="divider">OR</div>
                <AuthProviderBtns />
            </form>
        </div>
    </main>;
}