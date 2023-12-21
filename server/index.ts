import express from "express";
import authRouter from "./routes/auth";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";

config();

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

app.use("/", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
