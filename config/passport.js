const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const {
  findUserByProvider,
  findUserByEmail,
  createOAuthUser,
} = require("../models/user");

const findOrCreateUser = async (provider, profile) => {
  const providerId = profile.id;
  const email = profile.emails?.[0]?.value;
  const username = profile.displayName;
  const avatar =
    profile.photos?.[0]?.value || "https://default-avatar.com/avatar.png";

  let user = await findUserByProvider(provider, providerId);
  if (!user) {
    // Check if email is used by local account (optional)
    const existing = await findUserByEmail(email);
    if (existing && existing.provider === "local") {
      throw new Error("Email already used by a local account");
    }

    user = await createOAuthUser(username, email, avatar, provider, providerId);
  }

  return user;
};

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_URL}/google`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser("google", profile);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.OAUTH_CALLBACK_URL}/facebook`,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser("facebook", profile);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
