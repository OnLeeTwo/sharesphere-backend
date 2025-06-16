const db = require("./db");
const { buildListQuery } = require("../utils/queryBuilder");

const getAllVideos = async (filters) => {
  const { query, values } = buildListQuery({ table: "videos", filters });
  const result = await db.query(query, values);

  let countQuery = `SELECT COUNT(*) FROM videos`;
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

  if (conditions.length) {
    countQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  const totalResult = await db.query(countQuery, countValues);
  const total = parseInt(totalResult.rows[0].count, 10);

  return {
    videos: result.rows,
    total,
  };
};

const getVideoById = async (id) => {
  const result = await db.query("SELECT * FROM videos WHERE id = $1", [id]);
  return result.rows[0];
};

const createVideo = async ({
  title,
  description,
  video_url,
  thumbnail_url,
  author_id,
  access_tier,
}) => {
  const result = await db.query(
    `INSERT INTO videos (title, description, video_url, thumbnail_url, author_id, access_tier)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, video_url, thumbnail_url, author_id, access_tier]
  );
  return result.rows[0];
};

const updateVideo = async (
  id,
  { title, description, video_url, thumbnail_url, access_tier }
) => {
  const result = await db.query(
    `UPDATE videos
     SET title = $1,
         description = $2,
         video_url = $3,
         thumbnail_url = $4,
         access_tier = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [title, description, video_url, thumbnail_url, access_tier, id]
  );
  return result.rows[0];
};

const deleteVideo = async (id) => {
  await db.query("DELETE FROM videos WHERE id = $1", [id]);
};

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
};
