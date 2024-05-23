import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

export default function Searchbar() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();

    const query = searchParams.get("query");

    return (
        <div className="relative">
            <MagnifyingGlassIcon className="absolute mt-[13px] ml-3" height={20} width={20} color="#696969" />
            <input className="input input-bordered w-full pl-10" placeholder="Search..." defaultValue={query || ""} onChange={(e) => {
                const searchParams = new URLSearchParams()
                if (e.target.value) {
                    searchParams.set("query", e.target.value)
                    navigate(`${pathname}?${searchParams.toString()}`)
                }
                else {
                    navigate(`${pathname}`)
                }
            }} />
        </div>
    )
}
