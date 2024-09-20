import { getUser } from "@/api/api";
import Sidebar from "@/components/Sidebar";
import SocketContextProvider from "@/components/SocketContextProvider";
import useAuthContext from "@/hooks/useAuthContext";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Home() {
    const { auth, setAuth } = useAuthContext();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    useEffect(() => {
        getUser().then(response => {
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

    if (!auth) {
        return null;
    }

    return <div className="h-screen w-screen flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pl-10 pr-10">
            <SocketContextProvider>
                <Outlet />
            </SocketContextProvider>
        </main>
    </div>;
}