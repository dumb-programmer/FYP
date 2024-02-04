import useAuthContext from "@/hook/useAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
    const { auth, setAuth } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/user", { credentials: "include", mode: "cors" }).then(response => {
            if (response.ok) {
                response.json().then(user => {
                    setAuth(user);
                })
            }
            else {
                navigate("/login");
            }
        });
    }, [navigate, setAuth]);

    if (auth) {
        return <>
            <h1>Hello {auth.firstName}</h1>
            <button className="btn btn-primary" onClick={() => {
                fetch("http://localhost:3000/logout", { method: "POST", credentials: "include", mode: "cors" }).then(response => {
                    if (response.ok) {
                        setAuth(null);
                        navigate("/login");
                    }
                })
            }}>Logout</button>
        </>;
    }

    return null;
}