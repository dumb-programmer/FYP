import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/types/schema";
import { Link } from "react-router-dom";
import LoadingIcon from "@/components/LoadingIcon";
import AuthProviderBtns from "@/components/AuthProviderBtns";
import ErrorMessage from "@/components/ErrorMessage";

export default function Signup() {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: ""
        },
        resolver: zodResolver(SignupSchema)
    });

    return <main className="min-h-screen flex justify-center items-center">
        <div className="card shadow-md">
            <form className="flex flex-col gap-4 p-10" onSubmit={handleSubmit(async (data) => {
                const response = await fetch("http://localhost:3000/signup", {
                    method: "POST", body: JSON.stringify({ ...data, confirmPassword: undefined }), headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response.status === 409) {
                    setError("email", { message: "A user with this email already exists" })
                }
            })}>
                <h1 className="card-title text-2xl">Signup</h1>
                <div className="flex gap-4 flex-wrap">
                    <div className="form-control w-full md:w-auto">
                        <label className="label" htmlFor="firstName">First Name</label>
                        <input className="input input-bordered" id="firstName" type="text" {...register("firstName")} />
                        <ErrorMessage message={errors.firstName?.message} />
                    </div>
                    <div className="form-control w-full md:w-auto">
                        <label className="label" htmlFor="lastName">Last Name</label>
                        <input className="input input-bordered" id="lastName" type="text" {...register("lastName")} />
                        <ErrorMessage message={errors.lastName?.message} />
                    </div>
                </div>
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
                <div className="form-control">
                    <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                    <input className="input input-bordered" id="confirmPassword" type="password" {...register("confirmPassword")} />
                    <ErrorMessage message={errors.confirmPassword?.message} />
                </div>
                <button className="btn btn-primary">
                    {
                        isSubmitting ? <LoadingIcon size={25} stroke="white" /> : "Submit"
                    }
                </button>
                <p className="text-gray-500">Already have an account? <Link className="link" to="/login">Login</Link></p>
                <div className="divider">OR</div>
                <AuthProviderBtns />
            </form>
        </div>
    </main>;
}