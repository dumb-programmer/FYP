import { AuthContext } from "@/context/AuthContext";
import { useState } from "react";

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState(null);

    return <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
    </AuthContext.Provider>
}