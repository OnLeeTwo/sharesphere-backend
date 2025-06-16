const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  findUserByProvider,
  createUser,
  createOAuthUser,
} = require("../models/user");

// Local register
const register = async (req, res) => {
  const { username, email, password, tier } = req.body;
  try {
    const existing = await findUserByEmail(email);
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, email, hashedPassword, tier);

    res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Local login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user)
      return res
        .status(400)
        .json({ message: "Email or password is not correct" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ message: "Email or password is not correct" });

    if (user.provider !== "local") {
      return res.status(400).json({ message: "Use Google/Facebook to login" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        tier: user.tier,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, tier: user.tier },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// OAuth login handler
const oauthLogin = async (req, res) => {
  const { email, username, avatar, provider, providerId, tier } = req.body;
  try {
    let user = await findUserByProvider(provider, providerId);

    if (!user) {
      // Check if email is already used with local account
      const existing = await findUserByEmail(email);
      if (existing)
        return res
          .status(400)
          .json({ message: "Email already used with a local account" });

      user = await createOAuthUser(
        username,
        email,
        avatar,
        provider,
        providerId,
        tier
      );
    }

    const token = jwt.sign(
      { id: user.id, tier: user.tier, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, tier: user.tier },
    });
  } catch (err) {
    res.status(500).json({ message: "OAuth login error", error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude sensitive fields like password
    const { password, ...userData } = user;
    res.json({ user: userData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

module.exports = { register, login, oauthLogin, getProfile };
