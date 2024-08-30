import GoogleStrategy, { VerifyCallback } from "passport-google-oauth2";
import GitHubStrategy from "passport-github2";
import LocalStrategy from "passport-local";
import { Request } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true,
  },
  function (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    User.findOne({ email: profile.email }).then((user) => {
      if (!user) {
        User.create({
          email: profile.email,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        }).then((createdUser) => done(null, createdUser));
        return;
      }
      done(null, user);
    });
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
    User.findOne({ username: profile.username }).then((user) => {
      if (!user) {
        const [firstName, lastName] = profile.displayName.split(" ");
        User.create({
          username: profile.username,
          firstName,
          lastName,
        }).then((createdUser) => done(null, createdUser));
        return;
      }
      done(null, user);
    });
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
      done(null);
      return;
    }

    const passwordsMatched = bcrypt.compareSync(
      password,
      user?.password as string
    );

    if (passwordsMatched) {
      done(null, {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user?.role,
      });
    } else {
      done(null);
    }
  }
);

export { googleStrategy, githubStrategy, localStrategy };
