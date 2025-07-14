const axios = require("axios");
const NodeCache = require("node-cache");
const TIMER_MIN = 10;
const cache = new NodeCache({ stdTTL: TIMER_MIN * 60 });
const pool = require("./db");

const GITHUB_API_URL =
  "https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc";

async function saveReposToDB(repos) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const repo of repos) {
      await client.query(
        `
        insert into github_schema.repos (github_id, name, stars, url) values ($1, $2, $3, $4)
        on conflict (github_id) do update set
        stars = excluded.stars,
        last_updated = current_timestamp
        `,
        [repo.id, repo.name, repo.stargazers_count, repo.html_url]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("DB err:", error);
  } finally {
    client.release();
  }
}

async function fetchTrendingRepos() {
  try {
    const response = await axios.get(GITHUB_API_URL);
    const repos = response.data.items.slice(0, 5);
    await saveReposToDB(repos);
    cache.set("trendingRepos", repos);
    console.log("repos updated");
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

const SYNC_INTERVAL = TIMER_MIN * 60 * 1000;
let syncTimer = setInterval(fetchTrendingRepos, SYNC_INTERVAL);

function resetSyncTimer() {
  clearInterval(syncTimer);
  syncTimer = setInterval(fetchTrendingRepos, SYNC_INTERVAL);
  console.log("timer reloaded");
}

module.exports = { fetchTrendingRepos, resetSyncTimer, cache };
