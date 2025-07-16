document
  .getElementById("top-five-find")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/repos`);
      const data = await response.json();
      const res = document.getElementById("repos-result");

      if (data.error) {
        res.innerHTML = `<p style="color: red;">${data.error}</p>`;
      } else {
        res.innerHTML = `
            <div class="repos">
                <div class="repos-item">
                    <h2>${data[0].name}</h2>
                    <p>ID: ${data[0].github_id}</p>
                    <p>Звёзд: ${data[0].stars}</p>
                    <p><a href="${data[0].url}" target="_blank" class="openGH-repos">Открыть на GitHub</a></p>
                </div>
                <div class="repos-item">
                    <h2>${data[1].name}</h2>
                    <p>ID: ${data[1].github_id}</p>
                    <p>Звёзд: ${data[1].stars}</p>
                    <p><a href="${data[1].url}" target="_blank" class="openGH-repos">Открыть на GitHub</a></p>
                </div>
                <div class="repos-item">
                    <h2>${data[2].name}</h2>
                    <p>ID: ${data[2].github_id}</p>
                    <p>Звёзд: ${data[2].stars}</p>
                    <p><a href="${data[2].url}" target="_blank" class="openGH-repos">Открыть на GitHub</a></p>
                </div>
                <div class="repos-item">    
                    <h2>${data[3].name}</h2>
                    <p>ID: ${data[3].github_id}</p>
                    <p>Звёзд: ${data[3].stars}</p>
                    <p><a href="${data[3].url}" target="_blank" class="openGH-repos">Открыть на GitHub</a></p>
                </div>
                <div class="repos-item">
                    <h2>${data[4].name}</h2>
                    <p>ID: ${data[4].github_id}</p>
                    <p>Звёзд: ${data[4].stars}</p>
                    <p><a href="${data[4].url}" target="_blank" class="openGH-repos">Открыть на GitHub</a></p>
                </div>
            </div>
            `;
      }
    } catch (error) {
      console.log("Error:", error);
      document.getElementById("repos-result").innerHTML = `<p>Error: ${error}`;
    }
  });
