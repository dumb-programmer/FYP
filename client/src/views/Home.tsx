import Sidebar from "@/components/Sidebar";
import SocketContextProvider from "@/components/SocketContextProvider";
import useAuthContext from "@/hook/useAuthContext";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Home() {
    const { auth, setAuth } = useAuthContext();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    useEffect(() => {
        fetch("http://localhost:3000/user", { credentials: "include", mode: "cors" }).then(response => {
            if (response.ok) {
                response.json().then(user => {
                    setAuth(user);
                })
            }
            else {
                if (pathname !== "/") {
                    const searchParams = new URLSearchParams();
                    searchParams.set("redirect", pathname + search)
                    navigate(`/login?${searchParams.toString()}`)
                }
                else {
                    navigate("/login")
                }
            }
        });
    }, [navigate, setAuth, pathname, search]);

    if (auth) {
        return <div className="h-screen w-screen flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <SocketContextProvider>
                    <Outlet />
                </SocketContextProvider>
            </main>
        </div>;
    }

    return null;
}