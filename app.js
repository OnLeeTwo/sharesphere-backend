require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", require("./routes/dbTest"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/articles", require("./routes/articlesRoutes"));
app.use("/api/videos", require("./routes/videosRoutes"));

app.listen(process.env.API_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.API_PORT}`);
});
