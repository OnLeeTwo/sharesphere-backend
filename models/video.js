const db = require("./db");

const getAllVideos = async () => {
  const result = await db.query(
    "SELECT * FROM videos ORDER BY created_at DESC"
  );
  return result.rows;
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
