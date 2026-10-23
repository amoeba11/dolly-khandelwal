const GITHUB_USER = 'amoeba11';
const FEATURED = new Set(['brain-byte', 'aeroplane-boarding-simulation', 'wordle-arena']);

async function loadProjects() {
  const container = document.getElementById('more-projects');

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const repos = await res.json();

    const rest = repos
      .filter((r) => !r.fork && !FEATURED.has(r.name))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (rest.length === 0) return;

    const heading = document.createElement('div');
    heading.className = 'projects-status';
    heading.textContent = 'All public repos (synced live from GitHub)';
    heading.style.marginBottom = '14px';
    container.appendChild(heading);

    for (const repo of rest) {
      const row = document.createElement('a');
      row.className = 'project-row';
      row.href = repo.html_url;
      row.target = '_blank';
      row.rel = 'noopener noreferrer';

      const title = document.createElement('div');
      title.className = 'project-title';
      title.textContent = repo.name;

      const desc = document.createElement('div');
      desc.className = 'project-desc';
      desc.textContent = repo.description || 'No description provided.';
      if (repo.language || repo.stargazers_count > 0) {
        const meta = document.createElement('div');
        meta.className = 'project-meta';
        meta.textContent = [repo.language, repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : null]
          .filter(Boolean)
          .join(' · ');
        desc.appendChild(meta);
      }

      row.appendChild(title);
      row.appendChild(desc);
      container.appendChild(row);
    }
  } catch (err) {
    const status = document.createElement('div');
    status.className = 'projects-status';
    status.textContent = "Couldn't load the full project list from GitHub right now.";
    container.appendChild(status);
    console.error('Failed to load GitHub repos:', err);
  }
}

loadProjects();
