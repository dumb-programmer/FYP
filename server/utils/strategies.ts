import GoogleStrategy, { VerifyCallback } from "passport-google-oauth2";
import GitHubStrategy from "passport-github2";

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

export { googleStrategy, githubStrategy };
