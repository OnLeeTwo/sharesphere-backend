const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articlesControllers");
const { authenticateJWT } = require("../middleware/authMiddleware");

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticle);
router.post("/", authenticateJWT, articleController.createArticle);
router.put("/:id", authenticateJWT, articleController.updateArticle);
router.delete("/:id", authenticateJWT, articleController.deleteArticle);

module.exports = router;
