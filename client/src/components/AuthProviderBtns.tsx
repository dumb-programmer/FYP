import googleIcon from "@/assets/google-icon.svg";
import githubIcon from "@/assets/github-icon.svg";

export default function AuthProviderBtns() {
    return <div className="flex flex-col gap-4" data-testid="auth-provider-btns">
        <a href="http://localhost:3000/auth/google" className="btn glass flex items-center gap-4">
            <img src={googleIcon} style={{ transform: "scale(1.3)" }} alt="google" />
            Continue With Google
        </a>
        <a href="http://localhost:3000/auth/github" className="btn glass flex items-center gap-4">
            <img src={githubIcon} style={{ transform: "scale(1.8)" }} alt="github" />
            Continue With Github
        </a>
    </div>;
}