import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function useAuthContext() {
  return useContext(AuthContext);
}
