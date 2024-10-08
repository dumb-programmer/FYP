import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import passport from "passport";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import feedbackRouter from "./routes/feedback";
import userRouter from "./routes/user";
import isAuthenticated from "./middleware/isAuthenticated";
import cors from "cors";
import sessionMiddleware from "./middleware/sessionMiddleware";
import isAdmin from "./middleware/isAdmin";

interface CustomUser {
    _id: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    isAdmin?: boolean | null;
}

declare global {
    namespace Express {
        interface User extends CustomUser { }
    }
}

const app = express();

app.use(cors({ origin: "https://localhost:5173", credentials: true }));
app.use(express.json());
app.use(helmet());

if (process.env.NODE_ENV === "production") {
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 100,
            standardHeaders: "draft-7",
            legacyHeaders: false,
        })
    );
}

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/chats", isAuthenticated, chatRouter);
app.use("/feedback", isAuthenticated, feedbackRouter);
app.use("/users", isAuthenticated, isAdmin, userRouter);

app.use((req, res, next) => {
    return res.sendStatus(404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res.sendStatus(500);
});

export default app;
