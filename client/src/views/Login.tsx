import googleIcon from "@/assets/google-icon.svg";
import githubIcon from "@/assets/github-icon.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/schema";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "@/components/LoadingIcon";

export default function Login() {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(LoginSchema)
    });
    const navigate = useNavigate();

    return <main className="full-screen centered">
        <div style={{ boxShadow: "0 0 3px 3px rgba(0,0,0,0.2)", padding: 20, borderRadius: 5 }}>
            <form className="form" onSubmit={handleSubmit(async (data) => {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST", body: JSON.stringify(data), headers: {
                        "Content-Type": "application/json"
                    },
                    mode: "cors",
                    credentials: "include"
                })
                if (response.ok) {
                    navigate("/");
                }
                else {
                    setError("email", { message: "Incorrect username or password" })
                }
            })}>
                <h1>Login</h1>
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
                <button className="btn btn-primary">
                    {
                        isSubmitting ? <LoadingIcon size={25} stroke="white" /> : "Submit"
                    }
                </button>
                <p className="subtle-text">Don't have an account? <Link className="link" to="/signup">Signup</Link></p>
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