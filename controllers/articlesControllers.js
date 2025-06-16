const articleModel = require("../models/article");

const getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const per_page = parseInt(req.query.per_page || "10");

    const { articles, total } = await articleModel.getAllArticles(req.query);

    res.json({
      articles,
      total,
      page,
      per_page,
      total_pages: Math.ceil(total / per_page),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch articles", error: err.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await articleModel.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving article", error: err.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const { title, content, access_tier } = req.body;
    const author_id = req.user.id; // Assuming JWT middleware sets req.user
    const article = await articleModel.createArticle({
      title,
      content,
      access_tier,
      author_id,
    });
    res.status(201).json(article);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create article", error: err.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { title, content, access_tier } = req.body;
    const article = await articleModel.updateArticle(req.params.id, {
      title,
      content,
      access_tier,
    });
    res.json(article);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update article", error: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await articleModel.deleteArticle(req.params.id);
    res.json({ message: "Article deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete article", error: err.message });
  }
};

module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
};
