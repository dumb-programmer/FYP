import { logout } from "@/api/api";
import useAuthContext from "@/hooks/useAuthContext";
import { ArrowLeftStartOnRectangleIcon, ArrowTopRightOnSquareIcon, ChartPieIcon, HomeIcon, UsersIcon } from "@heroicons/react/16/solid";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
    const navigate = useNavigate();
    const { setAuth } = useAuthContext();

    const onLogout = async () => {
        const response = await logout();
        if (response.ok) {
            navigate("/admin/login");
            setAuth(null);
        }
    }

    return <div className="min-h-screen w-screen flex">
        <aside className="menu prose relative p-8 w-72 bg-base-300 flex flex-col justify-between">
            <nav>
                <ul className="flex flex-col gap-4">
                    <li><NavLink to="/admin/dashboard"> <HomeIcon height={20} width={20} /> Home</NavLink></li>
                    <li><NavLink to="/admin/users"> <UsersIcon height={20} width={20} /> Users</NavLink></li>
                    <li><a className="link no-underline" href="http://localhost:9000/localhost" target="_blank"><ChartPieIcon height={20} width={20} />Analytics <ArrowTopRightOnSquareIcon height={20} width={20} /></a></li>
                </ul>
            </nav>
            <button className="btn btn-error w-full" onClick={onLogout}>Logout <ArrowLeftStartOnRectangleIcon height={20} width={20} /></button>
        </aside>
        <main className="flex-1 p-4">
            <Outlet />
        </main>
    </div>
}