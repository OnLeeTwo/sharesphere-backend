const express = require("express");
const db = require("../models/db.js");

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Hello world");
});

router.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()"); // simple query
    res.json({
      status: "success",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

module.exports = router;
