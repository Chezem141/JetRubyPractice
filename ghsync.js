const axios = require("axios");
const NodeCache = require("node-cache");
const TIMER_MIN = 10;
const cache = new NodeCache({ stdTTL: TIMER_MIN * 60 });

const GITHUB_API_URL =
  "https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc";

async function fetchTrendingRepos() {
  try {
    const response = await axios.get(GITHUB_API_URL, {
      headers: { "User-Agent": "github-trending-service" },
    });
    const repos = response.data.items.slice(0, 5);
    cache.set("trendingRepos", repos);
    console.log("repos updated");
  } catch (error) {
    console.error("FUCK!", error.message);
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
