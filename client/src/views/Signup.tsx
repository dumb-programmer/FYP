import googleIcon from "@/assets/google-icon.svg";
import githubIcon from "@/assets/github-icon.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/types/schema";
import { Link } from "react-router-dom";
import LoadingIcon from "@/components/LoadingIcon";

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

    return <main className="full-screen centered">
        <div style={{ boxShadow: "0 0 3px 3px rgba(0,0,0,0.2)", padding: 20, borderRadius: 5 }}>
            <form className="form" onSubmit={handleSubmit(async (data) => {
                const response = await fetch("http://localhost:3000/signup", {
                    method: "POST", body: JSON.stringify({ ...data, confirmPassword: undefined }), headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (response.status === 409) {
                    setError("email", { message: "A user with this email already exists" })
                }
            })}>
                <h1>Signup</h1>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <div className="form-control">
                        <label className="label" htmlFor="firstName">First Name</label>
                        <input className="input" id="firstName" type="text" {...register("firstName")} />
                        <span className="error-msg">{errors.firstName?.message}</span>
                    </div>
                    <div className="form-control">
                        <label className="label" htmlFor="lastName">Last Name</label>
                        <input className="input" id="lastName" type="text" {...register("lastName")} />
                        <span className="error-msg">{errors.lastName?.message}</span>
                    </div>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="email">Email</label>
                    <input className="input" id="email" {...register("email")} />
                    <span className="error-msg">{errors.email?.message}</span>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="password">Password</label>
                    <input className="input" id="password" type="password" {...register("password")} />
                    <span className="error-msg">{errors.password?.message}</span>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                    <input className="input" id="confirmPassword" type="password" {...register("confirmPassword")} />
                    <span className="error-msg">{errors.confirmPassword?.message}</span>
                </div>
                <button className="btn btn-primary">
                    {
                        isSubmitting ? <LoadingIcon size={25} stroke="white" /> : "Submit"
                    }
                </button>
                <p className="subtle-text">Already have an account? <Link className="link" to="/login">Login</Link></p>
                <hr className="separator" />
                <div className="provider-btns">
                    <a aria-label="signup with google" href="http://localhost:3000/auth/google" className="btn btn-secondary">
                        <img src={googleIcon} style={{ transform: "scale(1.3)" }} alt="google" />
                    </a>
                    <a aria-label="signup with github" href="http://localhost:3000/auth/github" className="btn btn-secondary">
                        <img src={githubIcon} style={{ transform: "scale(1.8)" }} alt="github" />
                    </a>
                </div>
            </form>
        </div>
    </main>;
}