import { SocketContext } from "@/context/SocketContext";
import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export default function SocketContextProvider({ children }: { children: React.ReactNode }) {
    const socket = useMemo(
        () =>
            io("http://localhost:3001/", {
                autoConnect: false,
            }),
        []
    );

    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}