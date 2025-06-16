const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ error: "Authorization header missing" });
  }
};

module.exports = { authenticateJWT };
