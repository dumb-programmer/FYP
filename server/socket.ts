import passport from "passport";
import { Server, Socket } from "socket.io";
import sessionMiddleware from "./middleware/sessionMiddleware";
import { NextFunction } from "express-serve-static-core";

export const io = new Server({
  cors: {
    origin: "https://localhost:5173",
    credentials: true,
  },
});

// TODO: Replace with Redis
const users = new Map();

const wrap =
  (middleware: (...args: any) => any) => (socket: Socket, next: () => void) =>
    middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket: Socket, next) => {
  sessionMiddleware(socket.request as any, {} as any, next as NextFunction);
});

io.on("connection", (socket) => {
  const sessions = (socket.request as any).sessionStore.sessions;

  let user = null;

  for (const key in sessions) {
    const sessionData = JSON.parse(sessions[key]);

    if (sessionData.passport && sessionData.passport.user) {
      user = sessionData.passport.user;
      break; // Assuming we want the first user we find
    }
  }

  if (user) {
    users.set(user._id, socket);
    console.log(users.get(user._id));
    console.log("User found:", user);
  } else {
    console.log("No user found in sessions.");
  }

  socket.on("disconnect", () => {
    users.delete(user?._id);
  });
});

export const getSocketFromUserId = (userId: string) => users.get(userId);
