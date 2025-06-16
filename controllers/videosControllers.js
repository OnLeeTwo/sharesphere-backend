const videoModel = require("../models/video");

const getVideos = async (req, res) => {
  try {
    const videos = await videoModel.getAllVideos();
    res.json(videos);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch videos", error: err.message });
  }
};

const getVideo = async (req, res) => {
  try {
    const video = await videoModel.getVideoById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving video", error: err.message });
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, description, video_url, thumbnail_url, access_tier } =
      req.body;
    const author_id = req.user.id; // assuming JWT middleware sets req.user
    const video = await videoModel.createVideo({
      title,
      description,
      video_url,
      thumbnail_url,
      author_id,
      access_tier,
    });
    res.status(201).json(video);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create video", error: err.message });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { title, description, video_url, thumbnail_url, access_tier } =
      req.body;
    const video = await videoModel.updateVideo(req.params.id, {
      title,
      description,
      video_url,
      thumbnail_url,
      access_tier,
    });
    res.json(video);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update video", error: err.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    await videoModel.deleteVideo(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete video", error: err.message });
  }
};

module.exports = {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
};
