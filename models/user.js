const db = require("./db");

// Find user by email
const findUserByEmail = async (email) => {
  const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

// Find user by provider + provider_id (OAuth)
const findUserByProvider = async (provider, providerId) => {
  const res = await db.query(
    "SELECT * FROM users WHERE provider = $1 AND provider_id = $2",
    [provider, providerId]
  );
  return res.rows[0];
};

// Create user (traditional login)
const createUser = async (username, email, hashedPassword, tier = "free") => {
  const res = await db.query(
    `INSERT INTO users (username, email, password, tier, provider) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [username, email, hashedPassword, tier, "local"]
  );
  return res.rows[0];
};

// Create OAuth user
const createOAuthUser = async (
  username,
  email,
  avatar,
  provider,
  providerId,
  tier = "free"
) => {
  const res = await db.query(
    `INSERT INTO users (username, email, avatar, provider, provider_id, tier) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [username, email, avatar, provider, providerId, tier]
  );
  return res.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserByProvider,
  createUser,
  createOAuthUser,
};
