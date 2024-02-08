import Chat from "@/views/Chat";
import Sidebar from "@/components/Sidebar";
import useAuthContext from "@/hook/useAuthContext";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function Home() {
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
        return <div className="home-layout">
            <Sidebar />
            <main>
                <Outlet />
            </main>
        </div>;
    }

    return null;
}