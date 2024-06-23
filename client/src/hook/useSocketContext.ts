import { SocketContext } from "@/context/SocketContext";
import { useContext } from "react";

export default function useSocketContext() {
  return useContext(SocketContext);
}
