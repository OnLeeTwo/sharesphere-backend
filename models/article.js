const db = require("./db");
const { buildListQuery } = require("../utils/queryBuilder");

const getAllArticles = async (filters) => {
  const { query, values } = buildListQuery({ table: "articles", filters });
  const result = await db.query(query, values);

  // Count total rows for pagination
  let countQuery = `SELECT COUNT(*) FROM articles`;
  let countValues = [];

  let conditions = [];
  let index = 1;

  if (filters.search) {
    conditions.push(`title ILIKE $${index++}`);
    countValues.push(`%${filters.search}%`);
  }

  if (filters.access_tier) {
    conditions.push(`access_tier = $${index++}`);
    countValues.push(filters.access_tier);
  }

  if (filters.category) {
    conditions.push(`category = $${index++}`);
    countValues.push(filters.category);
  }

  if (conditions.length) {
    countQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  const totalResult = await db.query(countQuery, countValues);
  const total = parseInt(totalResult.rows[0].count, 10);

  return {
    articles: result.rows,
    total,
  };
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
