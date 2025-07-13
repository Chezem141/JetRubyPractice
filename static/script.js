document.getElementById("repoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = document.getElementById("repoIdentifier").value.trim();
  if (!identifier) return;

  try {
    const response = await fetch(`/repos/${encodeURIComponent(identifier)}`);
    const data = await response.json();
    const res = document.getElementById("result");

    if (data.error) {
      res.innerHTML = `<p style="color: red;">${data.error}</p>`;
    } else {
      res.innerHTML = `
            <h2>${data.name}</h2>
            <p>ID: ${data.id}</p>
            <p>Stars: ${data.stargazers_count}</p>
            <p><a href="${data.html_url}" target="_blank">Open on GitHub</a></p>
            `;
    }
  } catch (error) {
    console.log("Errororrroreeee:", error);
    document.getElementById("result").innerHTML = `<p>Errooeorore: ${error}`;
  }
});
