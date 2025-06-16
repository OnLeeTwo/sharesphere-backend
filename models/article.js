const db = require("./db");

const getAllArticles = async () => {
  const result = await db.query(
    "SELECT * FROM articles ORDER BY created_at DESC"
  );
  return result.rows;
};

const getArticleById = async (id) => {
  const result = await db.query("SELECT * FROM articles WHERE id = $1", [id]);
  return result.rows[0];
};

const createArticle = async ({ title, content, author_id, access_tier }) => {
  const result = await db.query(
    `INSERT INTO articles (title, content, author_id, access_tier)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content, author_id, access_tier]
  );
  return result.rows[0];
};

const updateArticle = async (id, { title, content, access_tier }) => {
  const result = await db.query(
    `UPDATE articles
     SET title = $1, content = $2, access_tier = $3, updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [title, content, access_tier, id]
  );
  return result.rows[0];
};

const deleteArticle = async (id) => {
  await db.query("DELETE FROM articles WHERE id = $1", [id]);
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
