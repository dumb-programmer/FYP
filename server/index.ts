import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import authRouter from "./routes/auth";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "passport";
import session from "express-session";
import isAuthenticated from "./middleware/isAuthenticated";

const app = express();

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

app.use(
  session({
    secret: "cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", isAuthenticated, (req, res) => {
  res.json({ message: "Hello" });
});

app.use("/", authRouter);

app.use((req, res) => {
  return res.sendStatus(404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.sendStatus(500);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
