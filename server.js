const express = require("express");
const path = require("path");
const { fetchTrendingRepos, resetSyncTimer, cache } = require("./ghsync");
const pool = require("./db");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/repos/:identifier", async (req, res) => {
  const repos = cache.get("trendingRepos") || [];
  const repo = repos.find(
    (r) => r.id == req.params.identifier || r.name == req.params.identifier
  );
  res.json(repo || { error: "Репозиторий не найден" });
});

app.get("/repos", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "select * from github_schema.repos order by stars desc"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "DB error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/sync", (req, res) => {
  resetSyncTimer();
  fetchTrendingRepos();
  res.json({ status: "Sync done" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  fetchTrendingRepos();
});
