import session from "express-session";

export default session({
  secret: "cat",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === "production" },
});
