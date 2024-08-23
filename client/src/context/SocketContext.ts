import { createContext } from "react";
import { Socket } from "socket.io";

export const SocketContext = createContext<Socket | null>(null);
