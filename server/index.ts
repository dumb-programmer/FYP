import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import passport from "passport";
import rateLimit from "express-rate-limit";
import session from "express-session";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import isAuthenticated from "./middleware/isAuthenticated";
import cors from "cors";
// import { PDFExtract } from "pdf.js-extract";

(async () => {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
})();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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
  console.log(req.user);
});

// app.post("/", (req, res, next) => {
//   console.log(req.file);
//   upload(req, res, (err) => {
//     if (!err) {
//       if (req.file?.buffer) {
//         // getDocument({ data: req.file?.buffer });
//         new PDFExtract().extractBuffer(req.file.buffer, {}, (err, pdf) => {
//           if (pdf?.pages) {
//             for (const page of pdf.pages) {
//               console.log(
//                 "\n\n-------------------------- PAGE ---------------------------------\n\n"
//               );
//               console.log(page.content.map((item) => item.str).join(""));
//             }
//           }
//         });
//       }
//       res.json({ message: "File uploaded" });
//     } else {
//       res.status(403).json({ message: "File type not supported" });
//     }
//   });
// });

app.use("/", authRouter);
app.use("/chats", isAuthenticated, chatRouter);

app.use((req, res, next) => {
  return res.sendStatus(404);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.sendStatus(500);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
