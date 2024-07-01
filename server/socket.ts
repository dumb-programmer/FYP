import { Server } from "socket.io";

export const io = new Server({
  cors: "http://localhost:5173",
});
