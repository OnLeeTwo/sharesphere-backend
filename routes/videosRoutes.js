const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videosControllers");
const { authenticateJWT } = require("../middleware/authMiddleware"); // JWT middleware

router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideo);
router.post("/", authenticateJWT, videoController.createVideo);
router.put("/:id", authenticateJWT, videoController.updateVideo);
router.delete("/:id", authenticateJWT, videoController.deleteVideo);

module.exports = router;
