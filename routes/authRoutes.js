const express = require("express");
const router = express.Router();
const passport = require("../config/passport.js");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require("../middleware/authMiddleware");
const {
  register,
  login,
  oauthLogin,
  getProfile,
} = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateJWT, getProfile);
router.post("/oauth", oauthLogin); // Optional: direct endpoint if you're using token exchange manually

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      tier: user.tier,
      provider: user.provider,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback/google",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/callback/facebook",
  passport.authenticate("facebook", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

module.exports = router;
