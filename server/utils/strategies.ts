import GoogleStrategy, { VerifyCallback } from "passport-google-oauth2";
import GitHubStrategy from "passport-github2";
import LocalStrategy from "passport-local";
import User from "../models/user";
import bcrypt from "bcrypt";

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true,
  },
  function (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    done(null, profile);
  }
);

const githubStrategy = new GitHubStrategy.Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/github/callback",
  },
  function (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    done(null, profile);
  }
);

const localStrategy = new LocalStrategy.Strategy(
  { usernameField: "email", passwordField: "password" },
  async (
    email: string,
    password: string,
    done: (
      error: any,
      user?: false | Express.User | undefined,
      options?: LocalStrategy.IVerifyOptions | undefined
    ) => void
  ) => {
    const user = await User.findOne({ email });
    if (!user) {
      done({ message: "No such user exists" });
      return;
    }
    const passwordsMatched = bcrypt.compareSync(
      password,
      user?.password as string
    );
    if (passwordsMatched) {
      done(null, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      done({ message: "Invalid password" });
    }
  }
);

export { googleStrategy, githubStrategy, localStrategy };
