import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "@/api/api";
import useAuthContext from "@/hooks/useAuthContext";
import { useQuery } from "react-query";

export default function AdminRouteGuard() {
    const { auth, setAuth } = useAuthContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isLoading: loading } = useQuery({
        queryKey: ["user", pathname], queryFn: async () => {
            const response = await getUser();
            if (response.ok) {
                setAuth(await response.json());
            }
        }
    });

    useEffect(() => {
        if (!loading) {
            if (auth && auth.isAdmin && pathname === "/admin/login") {
                navigate("/admin/dashboard")
            }
            else if (!auth && pathname !== "/admin/login") {
                navigate("/admin/login")
            }
        }
    }, [loading, auth, pathname, navigate]);

    if (!loading && auth && auth.isAdmin && pathname !== "/admin/login") {
        return <Outlet />;
    }

    if (!loading && (!auth || auth.role !== "admin") && pathname === "/admin/login") {
        return <Outlet />;
    }

    return null;
}