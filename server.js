const express = require("express");
const path = require("path");
const { fetchTrendingRepos, resetSyncTimer, cache } = require("./ghsync");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/repos/:identifier", (req, res) => {
  const repos = cache.get("trendingRepos") || [];
  const repo = repos.find(
    (r) => r.id == req.params.identifier || r.name == req.params.identifier
  );
  res.json(repo || { error: "Repository not found =(" });
});

app.get("/repos", (req, res) => {
  const repos = cache.get("trendingRepos") || [];
  const filteredRepos = repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    stars: repo.stargazers_count,
    url: repo.html_url,
  }));

  res.json(filteredRepos);
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
